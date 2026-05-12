import authService from './authService.js';

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Notification API Service Module
 * Handles all notification-related API operations
 */
export const notificationApi = {
    /**
     * Get notifications with pagination and optional filtering
     * @param {Object} params - Query parameters
     * @param {number} params.page - Page number (default: 1)
     * @param {number} params.limit - Items per page (default: 20)
     * @param {boolean} params.unreadOnly - Filter unread only (default: false)
     * @param {string} params.type - Filter by type category (bookings, promotions, account)
     * @returns {Promise<Object>} Notifications with pagination info
     */
    async getNotifications(params = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (params.page) queryParams.append('page', params.page);
            if (params.limit) queryParams.append('limit', params.limit);
            if (params.unreadOnly) queryParams.append('unreadOnly', params.unreadOnly);
            if (params.type) queryParams.append('type', params.type);

            const response = await fetch(`${API_BASE_URL}/notifications?${queryParams.toString()}`, {
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get notifications error:', error);
            throw error;
        }
    },

    /**
     * Get unread notification count
     * @returns {Promise<Object>} Object with count property
     */
    async getUnreadCount() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get unread count error:', error);
            throw error;
        }
    },

    /**
     * Mark a notification as read
     * @param {string} notificationId - The notification ID
     * @returns {Promise<Object>} Success message and updated notification
     */
    async markAsRead(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Mark as read error:', error);
            throw error;
        }
    },

    /**
     * Mark all notifications as read
     * @returns {Promise<Object>} Success message
     */
    async markAllAsRead() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Mark all as read error:', error);
            throw error;
        }
    },

    /**
     * Delete a notification
     * @param {string} notificationId - The notification ID
     * @returns {Promise<Object>} Success message
     */
    async deleteNotification(notificationId) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Delete notification error:', error);
            throw error;
        }
    },

    /**
     * Clear all read notifications
     * @returns {Promise<Object>} Success message with deleted count
     */
    async clearReadNotifications() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/clear-read`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Clear read notifications error:', error);
            throw error;
        }
    },

    /**
     * Get notification settings
     * @returns {Promise<Object>} Notification settings
     */
    async getSettings() {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
                headers: authService.getAuthHeaders(),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Get notification settings error:', error);
            throw error;
        }
    },

    /**
     * Update notification settings
     * @param {Object} settings - Notification settings object
     * @returns {Promise<Object>} Success message and updated settings
     */
    async updateSettings(settings) {
        try {
            const response = await fetch(`${API_BASE_URL}/notifications/settings`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(settings),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Update notification settings error:', error);
            throw error;
        }
    }
};

export default notificationApi;
