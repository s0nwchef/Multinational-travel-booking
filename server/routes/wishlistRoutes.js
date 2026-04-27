import express from 'express';
import { 
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist,
    clearWishlist,
    getWishlistCount
} from '../controllers/wishlistController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All wishlist routes require authentication
router.use(requireAuth());

// Get user's wishlist
router.get('/', getWishlist);

// Get wishlist count (for header badge)
router.get('/count', getWishlistCount);

// Check if a tour is in wishlist
router.get('/check/:tourId', checkWishlist);

// Add tour to wishlist
router.post('/', addToWishlist);

// Remove tour from wishlist
router.delete('/:tourId', removeFromWishlist);

// Clear entire wishlist
router.delete('/', clearWishlist);

export default router;