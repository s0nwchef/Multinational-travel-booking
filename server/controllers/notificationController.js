import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Get user's notifications
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;
        const skip = (page - 1) * limit;

        const filter = { userId };
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({ userId, isRead: false });

        res.json({
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách thông báo', 
            error: error.message 
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await Notification.countDocuments({ userId, isRead: false });

        res.json({ count });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy số thông báo chưa đọc', 
            error: error.message 
        });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông báo' 
            });
        }

        res.json({
            message: 'Đánh dấu đã đọc thành công',
            notification
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi đánh dấu đã đọc', 
            error: error.message 
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.json({
            message: 'Đánh dấu tất cả đã đọc thành công'
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi đánh dấu tất cả đã đọc', 
            error: error.message 
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({ _id: id, userId });

        if (!notification) {
            return res.status(404).json({ 
                message: 'Không tìm thấy thông báo' 
            });
        }

        res.json({ 
            message: 'Xóa thông báo thành công' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa thông báo', 
            error: error.message 
        });
    }
};

// Delete all read notifications
export const clearReadNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Notification.deleteMany({ userId, isRead: true });

        res.json({
            message: `Đã xóa ${result.deletedCount} thông báo đã đọc`
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa thông báo', 
            error: error.message 
        });
    }
};

// Create notification (internal use - for staff to send to users)
export const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type, link } = req.body;

        if (!userId || !title || !message) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc' 
            });
        }

        const notification = new Notification({
            userId,
            title,
            message,
            type: type || 'info',
            link
        });

        await notification.save();

        // Optionally emit socket event here for real-time notification

        res.status(201).json({
            message: 'Tạo thông báo thành công',
            notification
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi tạo thông báo', 
            error: error.message 
        });
    }
};

// Get notification settings
export const getNotificationSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('notificationSettings');

        res.json({
            settings: user.notificationSettings || {
                email: true,
                push: true,
                bookingUpdates: true,
                promotions: true,
                newsletter: false
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy cài đặt thông báo', 
            error: error.message 
        });
    }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const settings = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { notificationSettings: settings },
            { new: true }
        ).select('notificationSettings');

        res.json({
            message: 'Cập nhật cài đặt thông báo thành công',
            settings: user.notificationSettings
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật cài đặt', 
            error: error.message 
        });
    }
};