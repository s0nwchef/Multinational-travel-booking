import mongoose from 'mongoose';
import DanhGia from '../models/DanhGia.js';
import TourVi from '../models/TourVi.js';
import DatTour from '../models/DatTour.js';

// Get reviews for a tour
export const getTourReviews = async (req, res) => {
    try {
        const { tourId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(tourId)) {
            return res.status(400).json({ message: 'ID tour không hợp lệ' });
        }

        let sortOption = { ngay_tao: -1 };
        if (sort === 'oldest') sortOption = { ngay_tao: 1 };
        if (sort === 'highest') sortOption = { diem: -1 };
        if (sort === 'lowest') sortOption = { diem: 1 };

        const reviews = await DanhGia.find({ id_tour: tourId })
            .populate('id_nguoi_dung', 'ho_ten anh_dai_dien')
            .populate('phan_hoi.id_nguoi_phan_hoi', 'ho_ten anh_dai_dien')
            .skip(skip).limit(parseInt(limit)).sort(sortOption);

        const total = await DanhGia.countDocuments({ id_tour: tourId });

        const ratingStats = await DanhGia.aggregate([
            { $match: { id_tour: new mongoose.Types.ObjectId(tourId) } },
            { $group: { _id: '$diem', count: { $sum: 1 } } }
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingStats.forEach(stat => { distribution[stat._id] = stat.count; });

        res.json({
            reviews, distribution,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error: error.message });
    }
};

// Create a review
export const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tourId, rating, title, content, photos, detailedRatings } = req.body;

        if (!tourId || !rating || !content) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
        }

        // Validate tourId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(tourId)) {
            return res.status(400).json({ message: 'Tour ID không hợp lệ' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating phải từ 1 đến 5' });
        }

        // Check for existing review (user can only review once per tour)
        const existingReview = await DanhGia.findOne({ id_nguoi_dung: userId, id_tour: tourId });
        if (existingReview) {
            return res.status(400).json({ message: 'Bạn đã đánh giá tour này rồi' });
        }

        // Optional: Check for completed booking (commented out for testing - can be re-enabled later)
        // const booking = await DatTour.findOne({ id_nguoi_dung: userId, id_tour: tourId, trang_thai: 'completed' });
        // if (!booking) {
        //     return res.status(403).json({ message: 'Bạn cần hoàn thành chuyến đi để đánh giá' });
        // }

        const chiTietDiem = detailedRatings ? {
            chat_luong: detailedRatings.service || detailedRatings.chat_luong || 0,
            gia_tri: detailedRatings.value || detailedRatings.gia_tri || 0,
            huong_dan_vien: detailedRatings.guide || detailedRatings.huong_dan_vien || 0,
            phuong_tien: detailedRatings.transport || detailedRatings.phuong_tien || 0
        } : null;

        const review = new DanhGia({
            id_nguoi_dung: userId, 
            id_tour: tourId, 
            diem: rating, 
            chi_tiet_diem: chiTietDiem,
            tieu_de: title || '', 
            noi_dung: content,
            danh_sach_media: photos || [], 
            da_xac_minh: true
        });
        await review.save();

        // Update tour average rating
        const tourReviews = await DanhGia.find({ id_tour: tourId });
        const avgRating = tourReviews.reduce((sum, r) => sum + r.diem, 0) / tourReviews.length;
        await TourVi.findByIdAndUpdate(tourId, {
            diem_trung_binh: Math.round(avgRating * 10) / 10,
            so_luong_danh_gia: tourReviews.length
        });

        res.status(201).json({ message: 'Đánh giá thành công', review });
    } catch (error) {
            console.error('createReview error:', error);
            console.error('Error stack:', error.stack);

            // Handle Mongoose validation errors with field-level messages
            if (error.name === 'ValidationError' && error.errors) {
                const errors = {};
                Object.keys(error.errors).forEach((field) => {
                    errors[field] = error.errors[field].message;
                });
                return res.status(400).json({ message: 'Validation failed', errors });
            }

            res.status(500).json({ 
                message: 'Lỗi khi tạo đánh giá', 
                error: error.message,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { rating, title, content, photos, detailedRatings } = req.body;

        const review = await DanhGia.findOne({ _id: id, id_nguoi_dung: userId });
        if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });

        if (rating) review.diem = rating;
        if (title !== undefined) review.tieu_de = title;
        if (content) review.noi_dung = content;
        if (photos) review.danh_sach_media = photos;
        if (detailedRatings) {
            review.chi_tiet_diem = {
                chat_luong: detailedRatings.service || detailedRatings.chat_luong || 0,
                gia_tri: detailedRatings.value || detailedRatings.gia_tri || 0,
                huong_dan_vien: detailedRatings.guide || detailedRatings.huong_dan_vien || 0,
                phuong_tien: detailedRatings.transport || detailedRatings.phuong_tien || 0
            };
        }
        await review.save();

        const tourReviews = await DanhGia.find({ id_tour: review.id_tour });
        const avgRating = tourReviews.reduce((sum, r) => sum + r.diem, 0) / tourReviews.length;
        await TourVi.findByIdAndUpdate(review.id_tour, { diem_trung_binh: Math.round(avgRating * 10) / 10 });

        res.json({ message: 'Cập nhật đánh giá thành công', review });
    } catch (error) {
        // Mongoose validation handling for update
        if (error.name === 'ValidationError' && error.errors) {
            const errors = {};
            Object.keys(error.errors).forEach((field) => {
                errors[field] = error.errors[field].message;
            });
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        res.status(500).json({ message: 'Lỗi khi cập nhật đánh giá', error: error.message });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const review = await DanhGia.findOneAndDelete({ _id: req.params.id, id_nguoi_dung: userId });
        if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });

        const tourReviews = await DanhGia.find({ id_tour: review.id_tour });
        const avgRating = tourReviews.length > 0 ? tourReviews.reduce((sum, r) => sum + r.diem, 0) / tourReviews.length : 0;
        await TourVi.findByIdAndUpdate(review.id_tour, {
            diem_trung_binh: Math.round(avgRating * 10) / 10, so_luong_danh_gia: tourReviews.length
        });
        res.json({ message: 'Xóa đánh giá thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa đánh giá', error: error.message });
    }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const reviews = await DanhGia.find({ id_nguoi_dung: userId })
            .populate('id_tour', 'ten_tour danh_sach_anh')
            .skip(skip).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await DanhGia.countDocuments({ id_nguoi_dung: userId });
        res.json({ reviews, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá của bạn', error: error.message });
    }
};

// Reply to a review
export const replyToReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment || typeof comment !== 'string' || !comment.trim()) {
            return res.status(400).json({ message: 'Nội dung phản hồi là bắt buộc' });
        }

        const review = await DanhGia.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        review.phan_hoi = Array.isArray(review.phan_hoi) ? review.phan_hoi : review.phan_hoi ? [review.phan_hoi] : [];
        review.phan_hoi.push({
            id_nguoi_phan_hoi: userId,
            noi_dung: comment.trim(),
            ngay_phan_hoi: new Date()
        });

        await review.save();

        const savedReview = await DanhGia.findById(id)
            .populate('id_nguoi_dung', 'ho_ten anh_dai_dien')
            .populate('phan_hoi.id_nguoi_phan_hoi', 'ho_ten anh_dai_dien')
            .populate('id_tour', 'ten_tour');

        res.json({ message: 'Phản hồi đánh giá thành công', review: savedReview });
    } catch (error) {
        console.error('replyToReview error:', error);
        res.status(500).json({ message: 'Lỗi khi phản hồi đánh giá', error: error.message });
    }
};

// Get review by ID
export const getReviewById = async (req, res) => {
    try {
        const review = await DanhGia.findById(req.params.id)
            .populate('id_nguoi_dung', 'ho_ten anh_dai_dien')
            .populate('phan_hoi.id_nguoi_phan_hoi', 'ho_ten anh_dai_dien')
            .populate('id_tour', 'ten_tour');
        if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        res.json({ review });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy đánh giá', error: error.message });
    }
};