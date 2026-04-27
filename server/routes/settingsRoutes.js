import express from 'express';
import { 
    getProfile,
    updateProfile,
    changePassword,
    getNotificationPreferences,
    updateNotificationPreferences,
    getLoyaltyInfo,
    deleteAccount
} from '../controllers/settingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(requireAuth());

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Password
router.put('/password', changePassword);

// Notifications
router.get('/notifications', getNotificationPreferences);
router.put('/notifications', updateNotificationPreferences);

// Loyalty
router.get('/loyalty', getLoyaltyInfo);

// Account
router.delete('/account', deleteAccount);

export default router;