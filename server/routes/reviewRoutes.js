import express from 'express';
import multer from 'multer';
import { 
    getTourReviews,
    createReview,
    updateReview,
    deleteReview,
    getUserReviews,
    getReviewById,
    replyToReview,
    deleteReviewReply,
    updateReviewReply
} from '../controllers/reviewController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Chỉ hỗ trợ file ảnh'));
        }
        cb(null, true);
    }
});

const handleReviewMediaUpload = (req, res, next) => {
    upload.array('photos', 10)(req, res, (error) => {
        if (error) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'Ảnh tải lên không được vượt quá 10MB' });
            }

            if (error.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({ message: 'Chỉ được tải tối đa 10 ảnh' });
            }

            return res.status(400).json({ message: error.message || 'Không thể tải ảnh đánh giá' });
        }

        next();
    });
};

// Public routes
router.get('/tour/:tourId', getTourReviews);
router.get('/my-reviews', getUserReviews);
router.get('/:id', getReviewById);

// Protected routes (require login)
router.post('/', requireAuth(), handleReviewMediaUpload, createReview);
router.post('/:id/reply', requireAuth(), replyToReview);
router.put('/:id/reply/:replyIndex', requireAuth(), updateReviewReply);
router.delete('/:id/replies/:replyIndex', requireAuth(), deleteReviewReply);
router.put('/:id', requireAuth(), handleReviewMediaUpload, updateReview);
router.delete('/:id', requireAuth(), deleteReview);

export default router;