import User from '../models/User.js';
import Tour from '../models/Tour.js';

// Get user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate({
                path: 'wishlist',
                populate: { path: 'destinationId', select: 'name' }
            })
            .select('wishlist');

        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy người dùng' 
            });
        }

        res.json({
            wishlist: user.wishlist,
            count: user.wishlist.length
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy wishlist', 
            error: error.message 
        });
    }
};

// Add tour to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tourId } = req.body;

        if (!tourId) {
            return res.status(400).json({ 
                message: 'Thiếu tourId' 
            });
        }

        // Check if tour exists
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ 
                message: 'Không tìm thấy tour' 
            });
        }

        const user = await User.findById(userId);

        // Check if already in wishlist
        if (user.wishlist.includes(tourId)) {
            return res.status(400).json({ 
                message: 'Tour đã có trong wishlist' 
            });
        }

        user.wishlist.push(tourId);
        await user.save();

        res.json({
            message: 'Thêm vào wishlist thành công',
            wishlistCount: user.wishlist.length
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi thêm vào wishlist', 
            error: error.message 
        });
    }
};

// Remove tour from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tourId } = req.params;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy người dùng' 
            });
        }

        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(id => id.toString() !== tourId);

        if (user.wishlist.length === initialLength) {
            return res.status(404).json({ 
                message: 'Tour không có trong wishlist' 
            });
        }

        await user.save();

        res.json({
            message: 'Xóa khỏi wishlist thành công',
            wishlistCount: user.wishlist.length
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa khỏi wishlist', 
            error: error.message 
        });
    }
};

// Check if tour is in wishlist
export const checkWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tourId } = req.params;

        const user = await User.findById(userId).select('wishlist');

        const isInWishlist = user.wishlist.some(id => id.toString() === tourId);

        res.json({
            tourId,
            isInWishlist
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi kiểm tra wishlist', 
            error: error.message 
        });
    }
};

// Clear entire wishlist
export const clearWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { wishlist: [] },
            { new: true }
        );

        res.json({
            message: 'Xóa toàn bộ wishlist thành công',
            wishlistCount: 0
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa wishlist', 
            error: error.message 
        });
    }
};

// Get wishlist count (for header badge)
export const getWishlistCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('wishlist');

        res.json({
            count: user.wishlist.length
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy số lượng wishlist', 
            error: error.message 
        });
    }
};