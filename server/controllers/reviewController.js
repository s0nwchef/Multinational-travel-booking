import Review from '../models/Review.js';
import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';

// Get reviews for a tour
export const getTourReviews = async (req, res) => {
    try {
        const { tourId } = req.params;
        const { page = 1, limit = 10, sort = 'newest' } = req.query;
        const skip = (page - 1) * limit;

        let sortOption = { createdAt: -1 }; // newest first
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'highest') sortOption = { rating: -1 };
        if (sort === 'lowest') sortOption = { rating: 1 };

        const reviews = await Review.find({ tourId })
            .populate('userId', 'fullName avatarUrl')
            .skip(skip)
            .limit(parseInt(limit))
            .sort(sortOption);

        const total = await Review.countDocuments({ tourId });

        // Get rating distribution
        const ratingStats = await Review.aggregate([
            { $match: { tourId: require('mongoose').Types.ObjectId.createFromHexString(tourId) } },
            { $group: { _id: '$rating', count: { $sum: 1 } } }
        ]);

        const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        ratingStats.forEach(stat => {
            distribution[stat._id] = stat.count;
        });

        res.json({
            reviews,
            distribution,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy đánh giá', 
            error: error.message 
        });
    }
};

// Create a review
export const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tourId, rating, content, photos } = req.body;

        if (!tourId || !rating || !content) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc' 
            });
        }

        // Check if rating is valid
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ 
                message: 'Rating phải từ 1 đến 5' 
            });
        }

        // Check if user has completed booking for this tour
        const booking = await Booking.findOne({
            userId,
            tourId,
            status: 'completed'
        });

        if (!booking) {
            return res.status(403).json({ 
                message: 'Bạn cần hoàn thành chuyến đi để đánh giá' 
            });
        }

        // Check if user already reviewed this tour
        const existingReview = await Review.findOne({ userId, tourId });
        if (existingReview) {
            return res.status(400).json({ 
                message: 'Bạn đã đánh giá tour này rồi' 
            });
        }

        const review = new Review({
            userId,
            tourId,
            rating,
            content,
            photos: photos || []
        });

        await review.save();

        // Update tour's average rating
        const tourReviews = await Review.find({ tourId });
        const avgRating = tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length;
        
        await Tour.findByIdAndUpdate(tourId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: tourReviews.length
        });

        res.status(201).json({
            message: 'Đánh giá thành công',
            review
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi tạo đánh giá', 
            error: error.message 
        });
    }
};

// Update a review
export const updateReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { rating, content, photos } = req.body;

        const review = await Review.findOne({ _id: id, userId });

        if (!review) {
            return res.status(404).json({ 
                message: 'Không tìm thấy đánh giá' 
            });
        }

        // Update fields
        if (rating) review.rating = rating;
        if (content) review.content = content;
        if (photos) review.photos = photos;

        await review.save();

        // Update tour's average rating
        const tourReviews = await Review.find({ tourId: review.tourId });
        const avgRating = tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length;
        
        await Tour.findByIdAndUpdate(review.tourId, {
            averageRating: Math.round(avgRating * 10) / 10
        });

        res.json({
            message: 'Cập nhật đánh giá thành công',
            review
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật đánh giá', 
            error: error.message 
        });
    }
};

// Delete a review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const review = await Review.findOneAndDelete({ _id: id, userId });

        if (!review) {
            return res.status(404).json({ 
                message: 'Không tìm thấy đánh giá' 
            });
        }

        // Update tour's average rating
        const tourReviews = await Review.find({ tourId: review.tourId });
        const avgRating = tourReviews.length > 0 
            ? tourReviews.reduce((sum, r) => sum + r.rating, 0) / tourReviews.length 
            : 0;
        
        await Tour.findByIdAndUpdate(review.tourId, {
            averageRating: Math.round(avgRating * 10) / 10,
            totalReviews: tourReviews.length
        });

        res.json({ 
            message: 'Xóa đánh giá thành công' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa đánh giá', 
            error: error.message 
        });
    }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ userId })
            .populate('tourId', 'title images')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Review.countDocuments({ userId });

        res.json({
            reviews,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy đánh giá của bạn', 
            error: error.message 
        });
    }
};

// Get review by ID
export const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findById(id)
            .populate('userId', 'fullName avatarUrl')
            .populate('tourId', 'title');

        if (!review) {
            return res.status(404).json({ 
                message: 'Không tìm thấy đánh giá' 
            });
        }

        res.json({ review });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi l��y đánh giá', 
            error: error.message 
        });
    }
};