import Booking from '../models/Booking.js';
import { sendNotification } from '../utils/notificationHelper.js';

// Request a refund
export const requestRefund = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, reason } = req.body;

        if (!bookingId || !reason) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc' 
            });
        }

        const booking = await Booking.findOne({ _id: bookingId, userId });

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        // Check if booking can be refunded
        const refundableStatuses = ['confirmed', 'paid', 'ticketed'];
        if (!refundableStatuses.includes(booking.status)) {
            return res.status(400).json({ 
                message: 'Booking không thể hoàn tiền' 
            });
        }

        // Calculate refund amount based on cancellation policy
        let refundAmount = booking.grandTotal;
        let penaltyFee = 0;

        // Simple policy: 10% penalty if cancelled within 3 days of departure
        const departureDate = booking.tourId?.departureDate || new Date();
        const daysUntilDeparture = Math.ceil((new Date(departureDate) - new Date()) / (1000 * 60 * 60 * 24));

        if (daysUntilDeparture < 3) {
            penaltyFee = Math.round(booking.grandTotal * 0.1); // 10% penalty
            refundAmount = booking.grandTotal - penaltyFee;
        }

        // Update booking with refund request
        booking.status = 'refund_pending';
        booking.refundDetails = {
            amount: refundAmount,
            reason,
            status: 'pending',
            requestDate: new Date()
        };
        booking.penaltyFee = penaltyFee;

        await booking.save();

        // Gửi thông báo
        await sendNotification(userId, {
            title: 'Yêu cầu hoàn tiền đã được gửi',
            message: `Mã đặt tour: ${booking.bookingCode || booking._id}. Số tiền hoàn: ${refundAmount.toLocaleString()}đ`,
            type: 'refund',
            link: `/refund-status?bookingId=${bookingId}`
        });

        res.json({
            message: 'Yêu cầu hoàn tiền đã được gửi',
            refund: {
                bookingId: booking._id,
                refundAmount,
                penaltyFee,
                status: 'pending'
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi yêu cầu hoàn tiền', 
            error: error.message 
        });
    }
};

// Get refund status
export const getRefundStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;

        const booking = await Booking.findOne({ _id: bookingId, userId })
            .populate('tourId', 'title');

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        if (!booking.refundDetails) {
            return res.status(400).json({ 
                message: 'Booking không có yêu cầu hoàn tiền' 
            });
        }

        res.json({
            bookingId: booking._id,
            tourName: booking.tourId?.title,
            refundAmount: booking.refundDetails.amount,
            penaltyFee: booking.penaltyFee,
            reason: booking.refundDetails.reason,
            status: booking.refundDetails.status,
            requestDate: booking.refundDetails.requestDate,
            processedDate: booking.refundDetails.processedDate
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy trạng thái hoàn tiền', 
            error: error.message 
        });
    }
};

// Get all refund requests (admin)
export const getAllRefundRequests = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const filter = { 
            status: 'refund_pending',
            'refundDetails.status': { $ne: null }
        };

        if (status && status !== 'all') {
            filter['refundDetails.status'] = status;
        }

        const bookings = await Booking.find(filter)
            .populate('userId', 'fullName email phoneNumber')
            .populate('tourId', 'title')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ 'refundDetails.requestDate': -1 });

        const total = await Booking.countDocuments(filter);

        const refunds = bookings.map(booking => ({
            bookingId: booking._id,
            customerName: booking.userId.fullName,
            customerEmail: booking.userId.email,
            tourName: booking.tourId?.title,
            refundAmount: booking.refundDetails.amount,
            penaltyFee: booking.penaltyFee,
            reason: booking.refundDetails.reason,
            status: booking.refundDetails.status,
            requestDate: booking.refundDetails.requestDate
        }));

        res.json({
            refunds,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách hoàn tiền', 
            error: error.message 
        });
    }
};

// Process refund (admin)
export const processRefund = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { action, notes } = req.body; // action: 'approve' | 'reject'

        if (!action || !['approve', 'reject'].includes(action)) {
            return res.status(400).json({ 
                message: 'Hành động không hợp lệ' 
            });
        }

        const booking = await Booking.findById(bookingId)
            .populate('userId', 'fullName email');

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        if (booking.status !== 'refund_pending') {
            return res.status(400).json({ 
                message: 'Booking không trong trạng thái chờ hoàn tiền' 
            });
        }

        if (action === 'approve') {
            // Approve refund
            booking.status = 'refunded';
            booking.paymentStatus = 'refunded';
            booking.refundDetails.status = 'processed';
            booking.refundDetails.processedDate = new Date();
            
            // Add to payment history
            booking.paymentHistory.push({
                transactionId: `REF-${Date.now()}`,
                amount: -booking.refundDetails.amount,
                method: 'system',
                status: 'success',
                date: new Date()
            });

            // Gửi thông báo hoàn tiền thành công
            await sendNotification(booking.userId._id, {
                title: 'Hoàn tiền thành công',
                message: `Yêu cầu hoàn tiền cho booking ${booking.bookingCode || booking._id} đã được xử lý. Số tiền hoàn: ${booking.refundDetails.amount.toLocaleString()}đ`,
                type: 'refund',
                link: `/my-bookings/${bookingId}`
            });
        } else {
            // Reject refund - restore original status
            booking.status = 'confirmed';
            booking.refundDetails.status = 'rejected';
            booking.refundDetails.processedDate = new Date();

            // Gửi thông báo từ chối hoàn tiền
            await sendNotification(booking.userId._id, {
                title: 'Yêu cầu hoàn tiền bị từ chối',
                message: `Yêu cầu hoàn tiền cho booking ${booking.bookingCode || booking._id} đã bị từ chối. Lý do: ${notes || 'Không có'}`,
                type: 'refund',
                link: `/my-bookings/${bookingId}`
            });
        }

        await booking.save();

        res.json({
            message: action === 'approve' ? 'Hoàn tiền thành công' : 'Từ chối hoàn tiền thành công',
            booking: {
                bookingId: booking._id,
                status: booking.status,
                refundStatus: booking.refundDetails.status
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xử lý hoàn tiền', 
            error: error.message 
        });
    }
};

// Cancel booking (user)
export const cancelBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, reason } = req.body;

        const booking = await Booking.findOne({ _id: bookingId, userId });

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        // Check if booking can be cancelled
        const cancellableStatuses = ['pending', 'confirmed', 'paid'];
        if (!cancellableStatuses.includes(booking.status)) {
            return res.status(400).json({ 
                message: 'Booking không thể hủy' 
            });
        }

        booking.status = 'cancelled';
        booking.refundDetails = {
            amount: 0,
            reason: reason || 'User cancelled',
            status: 'rejected',
            requestDate: new Date()
        };

        await booking.save();

        // Gửi thông báo hủy booking
        await sendNotification(userId, {
            title: 'Đặt tour đã bị hủy',
            message: `Booking ${booking.bookingCode || booking._id} đã được hủy thành công`,
            type: 'booking',
            link: `/my-bookings`
        });

        res.json({
            message: 'Hủy booking thành công',
            bookingId: booking._id
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi hủy booking', 
            error: error.message 
        });
    }
};