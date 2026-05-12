import ThongBao from '../models/ThongBao.js';
import NguoiDung from '../models/NguoiDung.js';

/**
 * Gửi thông báo cho user
 * @param {string} userId - ID của user
 * @param {object} data - { title, message, type, link, referenceId, referenceType }
 * @returns {Promise<ThongBao>}
 */
export const sendNotification = async (userId, { title, message, type, link = null, referenceId = null, referenceType = null }) => {
    const typeMap = {
        booking: 'dat_tour_thanh_cong',
        promotion: 'khuyen_mai',
        system: 'he_thong',
        refund: 'dat_tour_huy',
        dat_tour_thanh_cong: 'dat_tour_thanh_cong',
        dat_tour_huy: 'dat_tour_huy',
        thanh_toan_thanh_cong: 'thanh_toan_thanh_cong',
        nho_danh_gia: 'nho_danh_gia',
        khuyen_mai: 'khuyen_mai',
        he_thong: 'he_thong'
    };

    const notification = new ThongBao({
        id_nguoi_dung: userId,
        tieu_de: title,
        noi_dung: message,
        loai: typeMap[type] || 'he_thong',
        lien_ket: link,
        id_tham_chieu: referenceId,
        loai_tham_chieu: referenceType
    });
    
    await notification.save();
    return notification;
};

/**
 * Gửi thông báo cho nhiều user
 * @param {string[]} userIds - Array của user IDs
 * @param {object} data - { title, message, type, link, referenceId, referenceType }
 * @returns {Promise<number>} - Số thông báo đã gửi
 */
export const sendBulkNotification = async (userIds, { title, message, type, link = null, referenceId = null, referenceType = null }) => {
    const typeMap = { 
        booking: 'dat_tour_thanh_cong', 
        promotion: 'khuyen_mai', 
        system: 'he_thong', 
        refund: 'dat_tour_huy',
        dat_tour_thanh_cong: 'dat_tour_thanh_cong',
        dat_tour_huy: 'dat_tour_huy',
        thanh_toan_thanh_cong: 'thanh_toan_thanh_cong',
        nho_danh_gia: 'nho_danh_gia',
        khuyen_mai: 'khuyen_mai',
        he_thong: 'he_thong'
    };
    
    const notifications = userIds.map(userId => ({
        id_nguoi_dung: userId,
        tieu_de: title,
        noi_dung: message,
        loai: typeMap[type] || 'he_thong',
        lien_ket: link,
        id_tham_chieu: referenceId,
        loai_tham_chieu: referenceType
    }));
    
    const result = await ThongBao.insertMany(notifications);
    return result.length;
};

/**
 * Broadcast promotional notification to all users
 * Note: Currently broadcasts to all users regardless of settings.
 * For per-user settings filtering, see docs/notification-settings-future-enhancement.md
 * 
 * @param {object} data - { title, message, link, couponCode, validUntil }
 * @returns {Promise<{ count: number, notification: ThongBao }>}
 */
export const broadcastPromotionalNotification = async ({ title, message, link = null, couponCode = null, validUntil = null }) => {
    // Build message with coupon code if provided
    let fullMessage = message;
    if (couponCode) {
        fullMessage += `\nMã giảm giá: ${couponCode}`;
        if (validUntil) {
            fullMessage += ` (Có hiệu lực đến ${new Date(validUntil).toLocaleDateString('vi-VN')})`;
        }
    }

    // Get all users
    // Note: In the future, filter by cai_dat_thong_bao.khuyen_mai === true
    const users = await NguoiDung.find({}, '_id');
    const userIds = users.map(u => u._id);

    // Create a template notification for reference
    const notification = new ThongBao({
        id_nguoi_dung: null, // Template notification
        tieu_de: title,
        noi_dung: fullMessage,
        loai: 'khuyen_mai',
        lien_ket: link
    });

    // Send bulk notifications
    const count = await sendBulkNotification(userIds, {
        title,
        message: fullMessage,
        type: 'khuyen_mai',
        link
    });

    return { count, notification };
};