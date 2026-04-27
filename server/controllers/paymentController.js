import Booking from '../models/Booking.js';
import User from '../models/User.js';

// Process payment for a booking
export const processPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, paymentMethod } = req.body;

        if (!bookingId || !paymentMethod) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin thanh toán' 
            });
        }

        const validMethods = ['credit_card', 'paypal', 'bank_transfer'];
        if (!validMethods.includes(paymentMethod)) {
            return res.status(400).json({ 
                message: 'Phương thức thanh toán không hợp lệ' 
            });
        }

        const booking = await Booking.findOne({ _id: bookingId, userId })
            .populate('tourId', 'title');

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({ 
                message: 'Booking đã được thanh toán' 
            });
        }

        // Simulate payment processing
        // In production, integrate with payment gateway (Stripe, PayPal, etc.)
        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Update booking
        booking.paymentStatus = 'paid';
        booking.status = 'confirmed';
        booking.paymentHistory.push({
            transactionId,
            amount: booking.grandTotal,
            method: paymentMethod,
            status: 'success',
            date: new Date()
        });

        await booking.save();

        // Add loyalty points (1 point per 1000 VND)
        const pointsEarned = Math.floor(booking.grandTotal / 1000);
        await User.findByIdAndUpdate(userId, {
            $inc: { loyaltyPoints: pointsEarned }
        });

        res.json({
            message: 'Thanh toán thành công',
            payment: {
                transactionId,
                amount: booking.grandTotal,
                method: paymentMethod,
                status: 'success'
            },
            pointsEarned
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xử lý thanh toán', 
            error: error.message 
        });
    }
};

// Get payment methods
export const getPaymentMethods = async (req, res) => {
    try {
        // Return available payment methods
        res.json({
            methods: [
                { 
                    id: 'credit_card', 
                    name: 'Thẻ tín dụng/Ghi nợ', 
                    icon: 'credit-card',
                    description: 'Visa, Mastercard, JCB'
                },
                { 
                    id: 'paypal', 
                    name: 'PayPal', 
                    icon: 'paypal',
                    description: 'Thanh toán qua PayPal'
                },
                { 
                    id: 'bank_transfer', 
                    name: 'Chuyển khoản ngân hàng', 
                    icon: 'building',
                    description: 'Chuyển khoản trực tiếp'
                }
            ]
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy phương thức thanh toán', 
            error: error.message 
        });
    }
};

// Get payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const bookings = await Booking.find({ 
            userId,
            paymentStatus: { $in: ['paid', 'refunded'] }
        })
        .populate('tourId', 'title images')
        .select('bookingCode tourId grandTotal paymentStatus paymentHistory createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        const total = await Booking.countDocuments({ 
            userId,
            paymentStatus: { $in: ['paid', 'refunded'] }
        });

        const payments = bookings.map(booking => ({
            bookingId: booking._id,
            bookingCode: booking.bookingCode,
            tourName: booking.tourId?.title,
            amount: booking.grandTotal,
            status: booking.paymentStatus,
            transactions: booking.paymentHistory,
            date: booking.createdAt
        }));

        res.json({
            payments,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy lịch sử thanh toán', 
            error: error.message 
        });
    }
};

// Get payment details for a booking
export const getPaymentDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId } = req.params;

        const booking = await Booking.findOne({ _id: bookingId, userId })
            .populate('tourId', 'title images')
            .populate('couponApplied', 'code discountType discountValue');

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        res.json({
            bookingId: booking._id,
            tourName: booking.tourId?.title,
            tourImage: booking.tourId?.images?.[0],
            baseFare: booking.baseFare,
            baggageFee: booking.baggageFee,
            taxAmount: booking.taxAmount,
            discountAmount: booking.discountAmount,
            coupon: booking.couponApplied,
            grandTotal: booking.grandTotal,
            paymentStatus: booking.paymentStatus,
            paymentHistory: booking.paymentHistory
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy chi tiết thanh toán', 
            error: error.message 
        });
    }
};

// Verify payment (webhook from payment gateway)
export const verifyPayment = async (req, res) => {
    try {
        const { transactionId, status } = req.body;

        // In production, verify signature from payment gateway
        if (!transactionId || !status) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin xác minh' 
            });
        }

        // Find booking by transaction
        const booking = await Booking.findOne({
            'paymentHistory.transactionId': transactionId
        });

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy giao dịch' 
            });
        }

        if (status === 'success') {
            booking.paymentStatus = 'paid';
            booking.status = 'confirmed';
        } else if (status === 'failed') {
            booking.paymentStatus = 'unpaid';
            booking.status = 'pending';
        }

        await booking.save();

        res.json({
            message: 'Xác minh thanh toán thành công',
            bookingId: booking._id,
            paymentStatus: booking.paymentStatus
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xác minh thanh toán', 
            error: error.message 
        });
    }
};