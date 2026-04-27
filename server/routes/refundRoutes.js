import express from 'express';
import { 
    requestRefund,
    getRefundStatus,
    getAllRefundRequests,
    processRefund,
    cancelBooking
} from '../controllers/refundController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes (require login)
router.post('/request', requireAuth(), requestRefund);
router.get('/status/:bookingId', requireAuth(), getRefundStatus);
router.post('/cancel', requireAuth(), cancelBooking);

// Admin routes
router.get('/all', requireAuth(['admin', 'tour_operator']), getAllRefundRequests);
router.put('/process/:bookingId', requireAuth(['admin', 'tour_operator']), processRefund);

export default router;