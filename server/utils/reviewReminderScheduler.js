import DatTour from '../models/DanhGia.js';
import DanhGia from '../models/DanhGia.js';
import ThongBao from '../models/ThongBao.js';
import { sendNotification } from './notificationHelper.js';

/**
 * Review Reminder Scheduler
 * 
 * This module handles scheduling and sending review reminder notifications
 * to users after they complete a tour.
 * 
 * Note: For a production system, consider using a proper job scheduler like:
 * - node-cron for recurring jobs
 * - Bull/Redis for queue-based job processing
 * - MongoDB TTL indexes for automatic document expiration
 */

/**
 * Check for completed bookings and send review reminders
 * Should be called by a scheduled job or cron task
 * 
 * @returns {Promise<number>} Number of reminders sent
 */
export const processReviewReminders = async () => {
    try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        
        // Find completed bookings from 24+ hours ago
        // Assuming there's a completion date or we use the tour end date
        // This is a simplified implementation - adjust based on actual data model
        const completedBookings = await DatTour.find({
            trang_thai: 'completed',
            ngay_cap_nhat: { $lte: twentyFourHoursAgo }
        }).populate('id_tour', 'ten_tour').populate('id_nguoi_dung', '_id');

        let remindersSent = 0;

        for (const booking of completedBookings) {
            // Check if user has already submitted a review
            const existingReview = await DanhGia.findOne({
                id_nguoi_dung: booking.id_nguoi_dung._id,
                id_tour: booking.id_tour._id
            });

            if (existingReview) {
                continue; // Skip if review already exists
            }

            // Check if a reminder was already sent
            const existingReminder = await ThongBao.findOne({
                id_nguoi_dung: booking.id_nguoi_dung._id,
                id_tham_chieu: booking._id,
                loai: 'nho_danh_gia'
            });

            if (existingReminder) {
                continue; // Skip if reminder already sent
            }

            // Send review reminder
            try {
                await sendNotification(booking.id_nguoi_dung._id, {
                    title: 'Chia sẻ trải nghiệm của bạn',
                    message: `Bạn đã hoàn thành tour "${booking.id_tour?.ten_tour || 'tour'}". Hãy để lại đánh giá để giúp những người khác!`,
                    type: 'nho_danh_gia',
                    link: `/tours/${booking.id_tour._id}/review`
                });
                remindersSent++;
            } catch (error) {
                console.error(`Failed to send review reminder for booking ${booking._id}:`, error.message);
            }
        }

        return remindersSent;
    } catch (error) {
        console.error('Error processing review reminders:', error.message);
        throw error;
    }
};

/**
 * Create a review reminder for a specific booking
 * To be called when a booking is marked as completed
 * 
 * @param {string} userId - User ID
 * @param {Object} booking - Booking object with populated tour data
 * @returns {Promise<void>}
 */
export const scheduleReviewReminder = async (userId, booking) => {
    try {
        // Calculate reminder time (24 hours from now)
        const reminderTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // For immediate implementation, we'll create the notification now
        // In a production system, you'd schedule this for 24 hours later
        
        // Store the scheduled reminder info (could use a separate collection in production)
        console.log(`Review reminder scheduled for user ${userId}, booking ${booking._id} at ${reminderTime.toISOString()}`);
        
        // Note: This is a simplified version. For actual scheduling:
        // 1. Store in a 'ScheduledNotifications' collection with a 'sendAt' date
        // 2. Have a cron job check and send notifications when sendAt <= now
        // 3. Or use a queue system like Bull to handle delayed jobs
    } catch (error) {
        console.error('Failed to schedule review reminder:', error.message);
    }
};

/**
 * Send review reminder immediately (for testing or manual trigger)
 * 
 * @param {string} userId - User ID
 * @param {string} tourId - Tour ID
 * @param {string} tourName - Tour name
 * @param {string} bookingId - Booking ID for reference
 * @returns {Promise<ThongBao>}
 */
export const sendReviewReminderNow = async (userId, tourId, tourName, bookingId) => {
    // Check if review already exists
    const existingReview = await DanhGia.findOne({
        id_nguoi_dung: userId,
        id_tour: tourId
    });

    if (existingReview) {
        console.log('User has already submitted a review, skipping reminder');
        return null;
    }

    // Check if reminder already sent
    const existingReminder = await ThongBao.findOne({
        id_nguoi_dung: userId,
        id_tham_chieu: bookingId,
        loai: 'nho_danh_gia'
    });

    if (existingReminder) {
        console.log('Review reminder already sent');
        return existingReminder;
    }

    return await sendNotification(userId, {
        title: 'Chia sẻ trải nghiệm của bạn',
        message: `Bạn đã hoàn thành tour "${tourName}". Hãy để lại đánh giá để giúp những người khác!`,
        type: 'nho_danh_gia',
        link: `/tours/${tourId}/review`
    });
};

export default {
    processReviewReminders,
    scheduleReviewReminder,
    sendReviewReminderNow
};
