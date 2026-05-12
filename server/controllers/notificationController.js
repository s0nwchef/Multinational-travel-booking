import ThongBao from '../models/ThongBao.js';
import { broadcastPromotionalNotification } from '../utils/notificationHelper.js';

// Type filter mapping for frontend categories
const TYPE_FILTER_MAP = {
    bookings: ['dat_tour_thanh_cong', 'dat_tour_huy', 'thanh_toan_thanh_cong'],
    promotions: ['khuyen_mai'],
    account: ['nho_danh_gia', 'he_thong']
};

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 20, unreadOnly = false, type } = req.query;
        const skip = (page - 1) * limit;
        const filter = { id_nguoi_dung: userId };
        
        if (unreadOnly === 'true') filter.da_doc = false;
        
        // Apply type filter if provided
        if (type && TYPE_FILTER_MAP[type]) {
            filter.loai = { $in: TYPE_FILTER_MAP[type] };
        }
        
        const notifications = await ThongBao.find(filter).sort({ ngay_tao: -1 }).skip(skip).limit(parseInt(limit));
        const total = await ThongBao.countDocuments(filter);
        const unreadCount = await ThongBao.countDocuments({ id_nguoi_dung: userId, da_doc: false });
        res.json({ notifications, unreadCount, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) { res.status(500).json({ message: 'Lỗi khi lấy thông báo', error: error.message }); }
};

export const getUnreadCount = async (req, res) => {
    try {
        const count = await ThongBao.countDocuments({ id_nguoi_dung: req.user.id, da_doc: false });
        res.json({ count });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const markAsRead = async (req, res) => {
    try {
        const n = await ThongBao.findOneAndUpdate({ _id: req.params.id, id_nguoi_dung: req.user.id }, { da_doc: true, ngay_doc: new Date() }, { new: true });
        if (!n) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        res.json({ message: 'Đánh dấu đã đọc thành công', notification: n });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const markAllAsRead = async (req, res) => {
    try {
        await ThongBao.updateMany({ id_nguoi_dung: req.user.id, da_doc: false }, { da_doc: true, ngay_doc: new Date() });
        res.json({ message: 'Đánh dấu tất cả đã đọc thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const deleteNotification = async (req, res) => {
    try {
        const n = await ThongBao.findOneAndDelete({ _id: req.params.id, id_nguoi_dung: req.user.id });
        if (!n) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
        res.json({ message: 'Xóa thông báo thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const clearReadNotifications = async (req, res) => {
    try {
        const result = await ThongBao.deleteMany({ id_nguoi_dung: req.user.id, da_doc: true });
        res.json({ message: `Đã xóa ${result.deletedCount} thông báo đã đọc` });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const createNotification = async (req, res) => {
    try {
        const { userId, title, message, type, link, broadcast, couponCode, validUntil } = req.body;
        
        // Handle broadcast notification
        if (broadcast) {
            if (!title || !message) {
                return res.status(400).json({ message: 'Thiếu tiêu đề hoặc nội dung' });
            }
            
            const { count, notification } = await broadcastPromotionalNotification({
                title,
                message,
                link,
                couponCode,
                validUntil
            });
            
            return res.status(201).json({ 
                message: `Đã gửi thông báo đến ${count} người dùng`, 
                count,
                notification 
            });
        }
        
        // Handle single notification
        if (!userId || !title || !message) return res.status(400).json({ message: 'Thiếu thông tin' });
        const typeMap = { booking: 'dat_tour_thanh_cong', promotion: 'khuyen_mai', system: 'he_thong', refund: 'dat_tour_huy', info: 'he_thong' };
        const n = new ThongBao({ id_nguoi_dung: userId, tieu_de: title, noi_dung: message, loai: typeMap[type] || 'he_thong', lien_ket: link });
        await n.save();
        res.status(201).json({ message: 'Tạo thông báo thành công', notification: n });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

/**
 * Get notification settings
 * Note: These are system-wide default settings. 
 * For future per-user settings implementation, see docs/notification-settings-future-enhancement.md
 */
export const getNotificationSettings = async (req, res) => {
    // Return default system settings for all users
    // In the future, this will fetch from NguoiDung.cai_dat_thong_bao
    res.json({ 
        settings: { 
            email: true, 
            push: true, 
            bookingUpdates: true, 
            promotions: true, 
            newsletter: false 
        } 
    });
};

/**
 * Update notification settings
 * Note: Currently returns success without persisting (mock behavior).
 * Settings are system-wide defaults for all users.
 * For future per-user settings implementation, see docs/notification-settings-future-enhancement.md
 */
export const updateNotificationSettings = async (req, res) => {
    // Mock behavior - return success without persisting
    // In the future, this will save to NguoiDung.cai_dat_thong_bao
    res.json({ message: 'Cập nhật cài đặt thông báo thành công', settings: req.body });
};