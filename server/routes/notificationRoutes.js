import express from 'express';
import { 
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearReadNotifications,
    createNotification,
    getNotificationSettings,
    updateNotificationSettings
} from '../controllers/notificationController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All notification routes require authentication
router.use(requireAuth());

// Get user's notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Get notification settings
router.get('/settings', getNotificationSettings);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all as read
router.put('/read-all', markAllAsRead);

// Update notification settings
router.put('/settings', updateNotificationSettings);

// Delete notification
router.delete('/:id', deleteNotification);

// Clear all read notifications
router.delete('/clear-read', clearReadNotifications);

// Create notification (admin only)
router.post('/', requireAuth(['admin']), createNotification);

export default router;