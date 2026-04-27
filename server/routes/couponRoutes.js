import express from 'express';
import { 
    getAvailableCoupons,
    validateCoupon,
    applyCoupon,
    removeCoupon,
    getUserCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons
} from '../controllers/couponController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/available', getAvailableCoupons);

// User routes (require login)
router.get('/my-coupons', requireAuth(), getUserCoupons);
router.post('/validate', requireAuth(), validateCoupon);
router.post('/apply', requireAuth(), applyCoupon);
router.delete('/remove', requireAuth(), removeCoupon);

// Admin routes
router.get('/', requireAuth(['admin']), getAllCoupons);
router.post('/', requireAuth(['admin']), createCoupon);
router.put('/:id', requireAuth(['admin']), updateCoupon);
router.delete('/:id', requireAuth(['admin']), deleteCoupon);

export default router;