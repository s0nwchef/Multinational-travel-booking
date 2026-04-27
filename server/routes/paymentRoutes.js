import express from 'express';
import { 
    processPayment,
    getPaymentMethods,
    getPaymentHistory,
    getPaymentDetails,
    verifyPayment
} from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/methods', getPaymentMethods);

// Protected routes (require login)
router.post('/process', requireAuth(), processPayment);
router.get('/history', requireAuth(), getPaymentHistory);
router.get('/:bookingId', requireAuth(), getPaymentDetails);

// Webhook (for payment gateway callback)
router.post('/verify', verifyPayment);

export default router;