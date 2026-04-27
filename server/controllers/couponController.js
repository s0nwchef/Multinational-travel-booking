import Coupon from '../models/Coupon.js';
import Booking from '../models/Booking.js';

// Get all available coupons for user
export const getAvailableCoupons = async (req, res) => {
    try {
        const now = new Date();

        const coupons = await Coupon.find({
            validFrom: { $lte: now },
            validUntil: { $gte: now },
            usageLimit: { $gt: '$usedCount' } // This won't work in find, need aggregation
        });

        // Filter manually for usage limit
        const availableCoupons = coupons.filter(coupon => 
            coupon.usedCount < coupon.usageLimit
        );

        res.json({
            coupons: availableCoupons.map(c => ({
                code: c.code,
                discountType: c.discountType,
                discountValue: c.discountValue,
                minPurchaseAmount: c.minPurchaseAmount,
                validUntil: c.validUntil,
                remainingUses: c.usageLimit - c.usedCount
            }))
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách coupon', 
            error: error.message 
        });
    }
};

// Validate coupon code
export const validateCoupon = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;

        if (!code) {
            return res.status(400).json({ 
                message: 'Thiếu mã coupon' 
            });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ 
                message: 'Mã coupon không tồn tại',
                valid: false
            });
        }

        const now = new Date();

        // Check validity period
        if (now < coupon.validFrom || now > coupon.validUntil) {
            return res.status(400).json({ 
                message: 'Mã coupon đã hết hạn',
                valid: false
            });
        }

        // Check usage limit
        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ 
                message: 'Mã coupon đã được sử dụng hết',
                valid: false
            });
        }

        // Check minimum purchase
        if (totalAmount && totalAmount < coupon.minPurchaseAmount) {
            return res.status(400).json({ 
                message: `Giá trị đơn hàng tối thiểu ${coupon.minPurchaseAmount} VND`,
                valid: false,
                minPurchaseAmount: coupon.minPurchaseAmount
            });
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'percentage') {
            discount = (totalAmount * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }

        // Cap discount at total amount
        discount = Math.min(discount, totalAmount);

        res.json({
            valid: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                discount
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi validate coupon', 
            error: error.message 
        });
    }
};

// Apply coupon to booking
export const applyCoupon = async (req, res) => {
    try {
        const { code, bookingId } = req.body;

        if (!code || !bookingId) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc' 
            });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ 
                message: 'Mã coupon không tồn tại' 
            });
        }

        // Update booking with coupon
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { couponApplied: coupon._id },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        res.json({
            message: 'Áp dụng coupon thành công',
            couponCode: coupon.code
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi áp dụng coupon', 
            error: error.message 
        });
    }
};

// Remove coupon from booking
export const removeCoupon = async (req, res) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ 
                message: 'Thiếu bookingId' 
            });
        }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { couponApplied: null },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }

        res.json({
            message: 'Xóa coupon thành công'
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa coupon', 
            error: error.message 
        });
    }
};

// Get user's applied coupons (history)
export const getUserCoupons = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ 
            userId, 
            couponApplied: { $ne: null } 
        })
        .populate('couponApplied')
        .sort({ createdAt: -1 });

        const couponHistory = bookings.map(booking => ({
            bookingId: booking._id,
            coupon: booking.couponApplied,
            appliedAt: booking.createdAt
        }));

        res.json({ coupons: couponHistory });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy lịch sử coupon', 
            error: error.message 
        });
    }
};

// Create coupon (admin)
export const createCoupon = async (req, res) => {
    try {
        const { 
            code, 
            discountType, 
            discountValue, 
            minPurchaseAmount = 0,
            validFrom, 
            validUntil, 
            usageLimit 
        } = req.body;

        if (!code || !discountType || !discountValue || !validFrom || !validUntil || !usageLimit) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc' 
            });
        }

        // Check if code already exists
        const existing = await Coupon.findOne({ code: code.toUpperCase() });
        if (existing) {
            return res.status(400).json({ 
                message: 'Mã coupon đã tồn tại' 
            });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minPurchaseAmount,
            validFrom: new Date(validFrom),
            validUntil: new Date(validUntil),
            usageLimit
        });

        await coupon.save();

        res.status(201).json({
            message: 'Tạo coupon thành công',
            coupon
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi tạo coupon', 
            error: error.message 
        });
    }
};

// Update coupon (admin)
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!coupon) {
            return res.status(404).json({ 
                message: 'Không tìm thấy coupon' 
            });
        }

        res.json({
            message: 'Cập nhật coupon thành công',
            coupon
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật coupon', 
            error: error.message 
        });
    }
};

// Delete coupon (admin)
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({ 
                message: 'Không tìm thấy coupon' 
            });
        }

        res.json({ 
            message: 'Xóa coupon thành công' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa coupon', 
            error: error.message 
        });
    }
};

// Get all coupons (admin)
export const getAllCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const coupons = await Coupon.find()
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Coupon.countDocuments();

        res.json({
            coupons,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách coupon', 
            error: error.message 
        });
    }
};