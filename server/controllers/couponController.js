import MaGiamGia from '../models/MaGiamGia.js';
import DatTour from '../models/DatTour.js';

// Get all available coupons for user
export const getAvailableCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await MaGiamGia.find({ hieu_luc_tu: { $lte: now }, hieu_luc_den: { $gte: now }, kich_hoat: true });
        const availableCoupons = coupons.filter(c => c.da_su_dung < c.tong_so_luong);
        res.json({
            coupons: availableCoupons.map(c => ({
                code: c.ma, ma: c.ma,
                discountType: c.loai_giam, loai_giam: c.loai_giam,
                discountValue: c.gia_tri_giam, gia_tri_giam: c.gia_tri_giam,
                minPurchaseAmount: c.don_hang_toi_thieu, don_hang_toi_thieu: c.don_hang_toi_thieu,
                validUntil: c.hieu_luc_den, hieu_luc_den: c.hieu_luc_den,
                remainingUses: c.con_lai, con_lai: c.con_lai
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách coupon', error: error.message });
    }
};

// Validate coupon code
export const validateCoupon = async (req, res) => {
    try {
        const { code, totalAmount } = req.body;
        if (!code) return res.status(400).json({ message: 'Thiếu mã coupon' });

        const coupon = await MaGiamGia.findOne({ ma: code.toUpperCase() });
        if (!coupon) return res.status(404).json({ message: 'Mã coupon không tồn tại', valid: false });

        const now = new Date();
        if (now < coupon.hieu_luc_tu || now > coupon.hieu_luc_den) {
            return res.status(400).json({ message: 'Mã coupon đã hết hạn', valid: false });
        }
        if (coupon.da_su_dung >= coupon.tong_so_luong) {
            return res.status(400).json({ message: 'Mã coupon đã được sử dụng hết', valid: false });
        }
        if (totalAmount && totalAmount < coupon.don_hang_toi_thieu) {
            return res.status(400).json({ message: `Giá trị đơn hàng tối thiểu ${coupon.don_hang_toi_thieu} VND`, valid: false });
        }

        let discount = 0;
        if (coupon.loai_giam === 'phan_tram') {
            discount = (totalAmount * coupon.gia_tri_giam) / 100;
            if (coupon.giam_toi_da && discount > coupon.giam_toi_da) discount = coupon.giam_toi_da;
        } else {
            discount = coupon.gia_tri_giam;
        }
        discount = Math.min(discount, totalAmount || discount);

        res.json({
            valid: true,
            coupon: {
                code: coupon.ma,
                ma: coupon.ma,
                discountType: coupon.loai_giam,
                discountValue: coupon.gia_tri_giam,
                maxDiscount: coupon.giam_toi_da,
                minPurchaseAmount: coupon.don_hang_toi_thieu,
                discount,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi validate coupon', error: error.message });
    }
};

// Apply coupon to booking
export const applyCoupon = async (req, res) => {
    try {
        const { code, bookingId } = req.body;
        if (!code || !bookingId) return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });

        const coupon = await MaGiamGia.findOne({ ma: code.toUpperCase() });
        if (!coupon) return res.status(404).json({ message: 'Mã coupon không tồn tại' });

        const booking = await DatTour.findByIdAndUpdate(bookingId, { id_ma_giam_gia: coupon._id, ma_giam_gia_da_dung: coupon.ma }, { new: true });
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

        res.json({ message: 'Áp dụng coupon thành công', couponCode: coupon.ma });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi áp dụng coupon', error: error.message });
    }
};

// Remove coupon from booking
export const removeCoupon = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) return res.status(400).json({ message: 'Thiếu bookingId' });

        const booking = await DatTour.findByIdAndUpdate(bookingId, { id_ma_giam_gia: null, ma_giam_gia_da_dung: '' }, { new: true });
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });
        res.json({ message: 'Xóa coupon thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa coupon', error: error.message });
    }
};

// Get user's applied coupons (history)
export const getUserCoupons = async (req, res) => {
    try {
        const userId = req.user.id;
        const bookings = await DatTour.find({ id_nguoi_dung: userId, id_ma_giam_gia: { $ne: null } })
            .populate('id_ma_giam_gia').sort({ ngay_tao: -1 });
        const couponHistory = bookings.map(b => ({ bookingId: b._id, coupon: b.id_ma_giam_gia, appliedAt: b.ngay_tao }));
        res.json({ coupons: couponHistory });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy lịch sử coupon', error: error.message });
    }
};

// Create coupon (admin)
export const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minPurchaseAmount = 0, validFrom, validUntil, usageLimit, mo_ta } = req.body;
        const ma = (req.body.ma || code || '').toUpperCase();
        if (!ma || (!discountType && !req.body.loai_giam) || (!discountValue && !req.body.gia_tri_giam)) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        const existing = await MaGiamGia.findOne({ ma });
        if (existing) return res.status(400).json({ message: 'Mã coupon đã tồn tại' });

        const loaiGiam = req.body.loai_giam || (discountType === 'percentage' ? 'phan_tram' : 'so_tien');
        const coupon = new MaGiamGia({
            ma,
            mo_ta: mo_ta || `Giảm ${req.body.gia_tri_giam || discountValue}${loaiGiam === 'phan_tram' ? '%' : ' VND'}`,
            loai_giam: loaiGiam,
            gia_tri_giam: req.body.gia_tri_giam || discountValue,
            don_hang_toi_thieu: req.body.don_hang_toi_thieu || minPurchaseAmount,
            tong_so_luong: req.body.tong_so_luong || usageLimit,
            hieu_luc_tu: new Date(req.body.hieu_luc_tu || validFrom),
            hieu_luc_den: new Date(req.body.hieu_luc_den || validUntil),
            kich_hoat: true
        });
        await coupon.save();
        res.status(201).json({ message: 'Tạo coupon thành công', coupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tạo coupon', error: error.message });
    }
};

// Update coupon (admin)
export const updateCoupon = async (req, res) => {
    try {
        const coupon = await MaGiamGia.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ message: 'Không tìm thấy coupon' });
        res.json({ message: 'Cập nhật coupon thành công', coupon });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật coupon', error: error.message });
    }
};

// Delete coupon (admin)
export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await MaGiamGia.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Không tìm thấy coupon' });
        res.json({ message: 'Xóa coupon thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa coupon', error: error.message });
    }
};

// Get all coupons (admin)
export const getAllCoupons = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const coupons = await MaGiamGia.find().skip(skip).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await MaGiamGia.countDocuments();
        res.json({ coupons, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách coupon', error: error.message });
    }
};