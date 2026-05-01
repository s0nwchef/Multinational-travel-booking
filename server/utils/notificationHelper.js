import Notification from '../models/Notification.js';

/**
 * Gửi thông báo cho user
 * @param {string} userId - ID của user
 * @param {object} data - { title, message, type, link }
 * @returns {Promise<Notification>}
 */
export const sendNotification = async (userId, { title, message, type, link = null }) => {
    const notification = new Notification({
        userId,
        title,
        message,
        type,
        link
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
    const notifications = userIds.map(userId => ({
        userId,
        title,
        message,
        type,
        link
    }));
    
    const result = await Notification.insertMany(notifications);
    return result.length;
};