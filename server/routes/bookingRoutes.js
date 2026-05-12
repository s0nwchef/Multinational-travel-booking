import mongoose from "mongoose";
import express from "express";
import DatTour from "../models/DatTour.js";
import TourVi from "../models/TourVi.js";
import LichKhoiHanh from "../models/LichKhoiHanh.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { sendNotification } from "../utils/notificationHelper.js";

const router = express.Router();

router.get("/", requireAuth(), async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await DatTour.find({ id_nguoi_dung: userId })
      .populate("id_nguoi_dung", "ho_ten email")
      .populate({
        path: "id_tour",
        select: "ten_tour anh_dai_dien gia_nguoi_lon id_diem_den so_ngay",
        populate: { path: "id_diem_den", select: "thanh_pho quoc_gia" },
      })
      .populate("id_lich_khoi_hanh")
      .sort({ ngay_tao: -1 })
      .lean();

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách booking của bạn",
      error: error.message,
    });
  }
});

router.post("/", requireAuth(), async (req, res) => {
  // Bắt đầu Session để dùng Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { itemId, travelers, customerName } = req.body;

    // 1. Xác định lịch khởi hành (nguồn dữ liệu tin cậy về giá và chỗ)
    const scheduleId = itemId || req.body.scheduleId;
    const schedule = await LichKhoiHanh.findById(scheduleId).session(session);

    if (!schedule || schedule.trang_thai !== "available") {
      throw new Error("Lịch khởi hành không tồn tại hoặc đã đóng nhận khách.");
    }

    // 2. Phân loại hành khách & Kiểm tra số lượng
    const formattedTravelers =
      travelers && travelers.length > 0
        ? travelers.map((t) => ({
            ho_ten: t.fullName || "N/A",
            ngay_sinh: t.dateOfBirth
              ? new Date(t.dateOfBirth)
              : new Date("2000-01-01"),
            gioi_tinh: t.gender || "other",
            so_ho_chieu: t.documentId || "",
            loai: t.age && t.age < 12 ? "tre_em" : "nguoi_lon",
          }))
        : [
            {
              ho_ten: customerName || req.user.ho_ten || "Khách hàng",
              ngay_sinh: new Date("2000-01-01"),
              gioi_tinh: "other",
              so_ho_chieu: "",
              loai: "nguoi_lon",
            },
          ];

    const numAdults = formattedTravelers.filter(
      (t) => t.loai === "nguoi_lon",
    ).length;
    const numChildren = formattedTravelers.filter(
      (t) => t.loai === "tre_em",
    ).length;
    const totalBooked = numAdults + numChildren;

    // Kiểm tra tràn chỗ (Overbooking)
    if (schedule.cho_da_dat + totalBooked > schedule.tong_cho) {
      throw new Error(
        "Xin lỗi, tour này chỉ còn " +
          (schedule.tong_cho - schedule.cho_da_dat) +
          " chỗ trống.",
      );
    }

    // 3. TỰ TÍNH TIỀN TẠI BACKEND (Bảo mật - Không tin giá từ client gửi lên)
    const totalBeforeDiscount =
      numAdults * schedule.gia_nguoi_lon + numChildren * schedule.gia_tre_em;
    const discountAmount = 0; // Bạn có thể thêm logic kiểm tra Coupon ở đây
    const finalTotal = totalBeforeDiscount - discountAmount;

    // 4. Lưu thông tin đặt tour
    const newBooking = new DatTour({
      id_nguoi_dung: userId,
      id_tour: schedule.id_tour,
      id_lich_khoi_hanh: schedule._id,
      thong_tin_lien_he: {
        ho_ten: customerName || req.user.ho_ten || "Unknown",
        email: req.user.email,
        so_dien_thoai: req.user.so_dien_thoai || "0000000000",
      },
      hanh_khach: formattedTravelers,
      so_nguoi_lon: numAdults,
      so_tre_em: numChildren,
      don_gia_nguoi_lon: schedule.gia_nguoi_lon,
      don_gia_tre_em: schedule.gia_tre_em,
      tong_tien_truoc_giam: totalBeforeDiscount,
      tien_giam_gia: discountAmount,
      tong_tien_cuoi: finalTotal,
      trang_thai: "pending",
      trang_thai_thanh_toan: "unpaid",
    });

    const savedBooking = await newBooking.save({ session });

    // 5. Cập nhật số chỗ đã đặt vào Lịch khởi hành
    await LichKhoiHanh.findByIdAndUpdate(
      scheduleId,
      { $inc: { cho_da_dat: totalBooked } },
      { session },
    );

    // Hoàn tất Transaction
    try {
      await session.commitTransaction();
    } finally {
      session.endSession();
    }

    // Gửi thông báo (Gửi sau khi commit thành công)
    sendNotification(userId, {
      title: "Đặt tour thành công",
      message: `Mã đặt tour: ${savedBooking.ma_dat_tour}`,
      type: "booking",
      link: `/my-bookings/${savedBooking._id}`,
    }).catch((err) => console.error("Thông báo lỗi:", err));

    res.status(201).json(savedBooking);
  } catch (error) {
    // Nếu có lỗi, hủy bỏ mọi thay đổi đã thực hiện trong transaction
    try {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/cancel", requireAuth(), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const booking = await DatTour.findById(req.params.id).session(session);

    if (!booking) throw new Error("Không tìm thấy đơn đặt tour.");

    // Bảo mật: Chỉ người đặt mới được hủy
    if (!booking.id_nguoi_dung.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền hủy đơn này." });
    }

    // Tránh việc hủy 2 lần cộng lại chỗ ngồi
    if (booking.trang_thai === "cancelled") {
      throw new Error("Đơn đặt tour này đã được hủy trước đó.");
    }

    // Cập nhật trạng thái booking
    booking.trang_thai = "cancelled";
    booking.ly_do_huy =
      req.body.ly_do_huy || "Khách hàng chủ động hủy trên hệ thống";
    booking.ngay_huy = new Date();
    await booking.save({ session });

    // Trả lại chỗ trống cho lịch khởi hành
    if (booking.id_lich_khoi_hanh) {
      const totalPeople =
        (booking.so_nguoi_lon || 0) + (booking.so_tre_em || 0);
      await LichKhoiHanh.findByIdAndUpdate(
        booking.id_lich_khoi_hanh,
        { $inc: { cho_da_dat: -totalPeople } },
        { session },
      );
    }

    try {
      await session.commitTransaction();
    } finally {
      session.endSession();
    }

    res.json({ message: "Hủy tour thành công", booking });
  } catch (error) {
    try {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
    return res.status(403).json({ message: error.message });
  }
});

export default router;
