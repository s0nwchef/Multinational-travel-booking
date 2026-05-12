import NguoiDung from "../models/NguoiDung.js";
import TourVi from "../models/TourVi.js";

export const getWishlist = async (req, res) => {
  try {
    const user = await NguoiDung.findById(req.user.id).populate({
      path: "danh_sach_yeu_thich",
      populate: { path: "id_diem_den", select: "quoc_gia thanh_pho" },
    });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    res.json({
      wishlist: user.danh_sach_yeu_thich,
      count: user.danh_sach_yeu_thich.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy wishlist", error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { tourId } = req.body;
    if (!tourId) return res.status(400).json({ message: "Thiếu tourId" });

    const tour = await TourVi.findById(tourId);
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });

    const user = await NguoiDung.findById(req.user.id);
    if (user.danh_sach_yeu_thich.some((id) => id.toString() === tourId)) {
      return res.status(400).json({ message: "Tour đã có trong wishlist" });
    }

    user.danh_sach_yeu_thich.push(tourId);
    await user.save();
    res.json({
      message: "Thêm vào wishlist thành công",
      wishlistCount: user.danh_sach_yeu_thich.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm vào wishlist", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const { tourId } = req.params;
    const user = await NguoiDung.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const initialLength = user.danh_sach_yeu_thich.length;
    user.danh_sach_yeu_thich = user.danh_sach_yeu_thich.filter(
      (id) => id.toString() !== tourId,
    );

    if (user.danh_sach_yeu_thich.length === initialLength) {
      return res.status(404).json({ message: "Tour không có trong wishlist" });
    }

    await user.save();
    res.json({
      message: "Xóa khỏi wishlist thành công",
      wishlistCount: user.danh_sach_yeu_thich.length,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa khỏi wishlist", error: error.message });
  }
};

export const checkWishlist = async (req, res) => {
  try {
    const user = await NguoiDung.findById(req.user.id).select(
      "danh_sach_yeu_thich",
    );
    const isInWishlist = user.danh_sach_yeu_thich.some(
      (id) => id.toString() === req.params.tourId,
    );
    res.json({ tourId: req.params.tourId, isInWishlist });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi kiểm tra wishlist", error: error.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    await NguoiDung.findByIdAndUpdate(req.user.id, { danh_sach_yeu_thich: [] });
    res.json({ message: "Xóa toàn bộ wishlist thành công", wishlistCount: 0 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa wishlist", error: error.message });
  }
};

export const getWishlistCount = async (req, res) => {
  try {
    const user = await NguoiDung.findById(req.user.id).select(
      "danh_sach_yeu_thich",
    );
    res.json({ count: user.danh_sach_yeu_thich.length });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy số lượng wishlist", error: error.message });
  }
};
