import express from 'express';
import { 
    getStaffProfile,
    updateStaffProfile,
    changeStaffPassword,
    getStaffSettings,
    updateStaffSettings,
    getDashboardPreferences,
    updateDashboardPreferences
} from '../controllers/staffSettingsController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require staff or admin role
router.use(requireAuth(['staff', 'admin']));

// Profile
router.get('/profile', getStaffProfile);
router.put('/profile', updateStaffProfile);

// Password
router.put('/password', changeStaffPassword);

// Settings
router.get('/', getStaffSettings);
router.put('/', updateStaffSettings);

// Dashboard preferences
router.get('/dashboard', getDashboardPreferences);
router.put('/dashboard', updateDashboardPreferences);

export default router;