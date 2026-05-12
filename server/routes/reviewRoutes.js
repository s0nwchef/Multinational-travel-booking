import express from 'express';
import { 
    getTourReviews,
    createReview,
    updateReview,
    deleteReview,
    getUserReviews,
    getReviewById,
    replyToReview
} from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/tour/:tourId', getTourReviews);
router.get('/:id', getReviewById);

// Protected routes (require login)
router.get('/my-reviews', requireAuth(), getUserReviews);
router.post('/', requireAuth(), createReview);
router.post('/:id/reply', requireAuth(), replyToReview);
router.put('/:id', requireAuth(), updateReview);
router.delete('/:id', requireAuth(), deleteReview);

export default router;