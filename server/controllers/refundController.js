import DatTour from '../models/DatTour.js';
import { sendNotification } from '../utils/notificationHelper.js';

export const requestRefund = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, reason } = req.body;
        if (!bookingId || !reason) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

        const booking = await DatTour.findOne({ _id: bookingId, id_nguoi_dung: userId }).populate('id_tour', 'ten_tour');
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

        if (!['confirmed'].includes(booking.trang_thai) || booking.trang_thai_thanh_toan !== 'paid') {
            return res.status(400).json({ message: 'Booking không thể hoàn tiền' });
        }

        let refundAmount = booking.tong_tien_cuoi;
        let penaltyFee = 0;
        // Simple penalty (assuming 10% if close, but we don't have departureDate immediately accessible without schedule lookup)
        penaltyFee = Math.round(booking.tong_tien_cuoi * 0.1); 
        refundAmount = booking.tong_tien_cuoi - penaltyFee;

        // Cancel the booking and set refund info
        booking.trang_thai = 'cancelled';
        booking.ngay_huy = new Date();
        booking.ly_do_huy = reason;
        booking.tien_hoan = refundAmount;
        await booking.save();

        await sendNotification(userId, {
            title: 'Yêu cầu hủy và hoàn tiền đã được gửi',
            message: `Mã đặt tour: ${booking.ma_dat_tour}. Số tiền hoàn: ${refundAmount.toLocaleString()}đ`,
            type: 'refund',
            link: `/my-bookings/${bookingId}`
        });

        res.json({
            message: 'Yêu cầu hoàn tiền đã được gửi',
            refund: { bookingId: booking._id, refundAmount, penaltyFee, status: 'pending' }
        });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getRefundStatus = async (req, res) => {
    try {
        const booking = await DatTour.findOne({ _id: req.params.bookingId, id_nguoi_dung: req.user.id }).populate('id_tour', 'ten_tour');
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });
        if (booking.trang_thai !== 'cancelled') return res.status(400).json({ message: 'Booking không có yêu cầu hoàn tiền' });

        res.json({
            bookingId: booking._id, tourName: booking.id_tour?.ten_tour,
            refundAmount: booking.tien_hoan, penaltyFee: booking.tong_tien_cuoi - booking.tien_hoan,
            reason: booking.ly_do_huy, status: booking.trang_thai_thanh_toan === 'refunded' ? 'processed' : 'pending',
            requestDate: booking.ngay_huy, processedDate: booking.trang_thai_thanh_toan === 'refunded' ? booking.ngay_cap_nhat : null
        });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getAllRefundRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const filter = { trang_thai: 'cancelled', tien_hoan: { $gt: 0 } };
        if (status === 'processed') filter.trang_thai_thanh_toan = 'refunded';
        if (status === 'pending') filter.trang_thai_thanh_toan = { $ne: 'refunded' };

        const bookings = await DatTour.find(filter).populate('id_nguoi_dung', 'ho_ten email so_dien_thoai').populate('id_tour', 'ten_tour')
            .skip(skip).limit(parseInt(limit)).sort({ ngay_huy: -1 });
        const total = await DatTour.countDocuments(filter);

        const refunds = bookings.map(b => ({
            bookingId: b._id, customerName: b.id_nguoi_dung?.ho_ten, customerEmail: b.id_nguoi_dung?.email,
            tourName: b.id_tour?.ten_tour, refundAmount: b.tien_hoan, penaltyFee: b.tong_tien_cuoi - b.tien_hoan,
            reason: b.ly_do_huy, status: b.trang_thai_thanh_toan === 'refunded' ? 'processed' : 'pending', requestDate: b.ngay_huy
        }));

        res.json({ refunds, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const processRefund = async (req, res) => {
    try {
        const { action, notes } = req.body;
        if (!['approve', 'reject'].includes(action)) return res.status(400).json({ message: 'Hành động không hợp lệ' });

        const booking = await DatTour.findById(req.params.bookingId).populate('id_nguoi_dung', 'ho_ten email');
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

        if (action === 'approve') {
            booking.trang_thai_thanh_toan = 'refunded';
            await sendNotification(booking.id_nguoi_dung._id, {
                title: 'Hoàn tiền thành công',
                message: `Hoàn tiền booking ${booking.ma_dat_tour} thành công. Số tiền: ${booking.tien_hoan.toLocaleString()}đ`,
                type: 'refund', link: `/my-bookings/${booking._id}`
            });
        } else {
            booking.tien_hoan = 0; // Rejected refund
            await sendNotification(booking.id_nguoi_dung._id, {
                title: 'Yêu cầu hoàn tiền bị từ chối',
                message: `Yêu cầu hoàn tiền booking ${booking.ma_dat_tour} bị từ chối. Lý do: ${notes || 'Không có'}`,
                type: 'refund', link: `/my-bookings/${booking._id}`
            });
        }
        await booking.save();
        res.json({ message: action === 'approve' ? 'Hoàn tiền thành công' : 'Từ chối thành công', booking: { bookingId: booking._id, status: booking.trang_thai } });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const cancelBooking = async (req, res) => {
    try {
        const { bookingId, reason } = req.body;
        const booking = await DatTour.findOne({ _id: bookingId, id_nguoi_dung: req.user.id });
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

        if (!['pending', 'confirmed'].includes(booking.trang_thai)) return res.status(400).json({ message: 'Booking không thể hủy' });

        booking.trang_thai = 'cancelled';
        booking.ngay_huy = new Date();
        booking.ly_do_huy = reason || 'User cancelled';
        booking.tien_hoan = booking.trang_thai_thanh_toan === 'paid' ? booking.tong_tien_cuoi : 0;
        await booking.save();

        await sendNotification(req.user.id, {
            title: 'Đặt tour đã bị hủy', message: `Booking ${booking.ma_dat_tour} đã hủy thành công`,
            type: 'booking', link: `/my-bookings`
        });

        res.json({ message: 'Hủy booking thành công', bookingId: booking._id });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};