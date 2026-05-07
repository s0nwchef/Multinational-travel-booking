import ThongBao from '../models/ThongBao.js';

/**
 * Gửi thông báo cho user
 * @param {string} userId - ID của user
 * @param {object} data - { title, message, type, link }
 * @returns {Promise<ThongBao>}
 */
export const sendNotification = async (userId, { title, message, type, link = null }) => {
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
        lien_ket: link
    });
    
    await notification.save();
    return notification;
};

/**
 * Gửi thông báo cho nhiều user
 * @param {string[]} userIds - Array của user IDs
 * @param {object} data - { title, message, type, link }
 * @returns {Promise<number>} - Số thông báo đã gửi
 */
export const sendBulkNotification = async (userIds, { title, message, type, link = null }) => {
    const typeMap = { booking: 'dat_tour_thanh_cong', promotion: 'khuyen_mai', system: 'he_thong', refund: 'dat_tour_huy' };
    const notifications = userIds.map(userId => ({
        id_nguoi_dung: userId,
        tieu_de: title,
        noi_dung: message,
        loai: typeMap[type] || 'he_thong',
        lien_ket: link
    }));
    
    const result = await ThongBao.insertMany(notifications);
    return result.length;
};