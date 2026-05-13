import authService from './authService.js';

const API_BASE_URL = 'http://localhost:3000/api';

// API endpoint is /api/staff/settings (not /api/staff-settings)
const SETTINGS_API_BASE = `${API_BASE_URL}/staff/settings`;

/**
 * Staff Settings Service
 * Handles API calls for staff profile and settings management
 */
export const staffSettingsService = {
    /**
     * Get staff profile information
     * @returns {Promise<Object>} Staff profile data
     */
    async getProfile() {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}/profile`, {
                method: 'GET',
                headers: authService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể lấy thông tin hồ sơ');
            }

            return data;
        } catch (error) {
            console.error('Get profile error:', error);
            throw error;
        }
    },

    /**
     * Update staff profile information
     * @param {Object} profileData - Profile data to update
     * @param {string} profileData.fullName - Full name
     * @param {string} profileData.phoneNumber - Phone number
     * @param {string} profileData.avatarUrl - Avatar URL
     * @returns {Promise<Object>} Updated profile data
     */
    async updateProfile(profileData) {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}/profile`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể cập nhật hồ sơ');
            }

            return data;
        } catch (error) {
            console.error('Update profile error:', error);
            throw error;
        }
    },

    /**
     * Change staff password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {Promise<Object>} Response message
     */
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}/password`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể đổi mật khẩu');
            }

            return data;
        } catch (error) {
            console.error('Change password error:', error);
            throw error;
        }
    },

    /**
     * Get staff settings
     * @returns {Promise<Object>} Settings data
     */
    async getSettings() {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}`, {
                method: 'GET',
                headers: authService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể lấy cài đặt');
            }

            return data;
        } catch (error) {
            console.error('Get settings error:', error);
            throw error;
        }
    },

    /**
     * Update staff settings
     * @param {Object} settings - Settings to update
     * @returns {Promise<Object>} Updated settings
     */
    async updateSettings(settings) {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể cập nhật cài đặt');
            }

            return data;
        } catch (error) {
            console.error('Update settings error:', error);
            throw error;
        }
    },

    /**
     * Get dashboard preferences
     * @returns {Promise<Object>} Dashboard preferences
     */
    async getDashboardPreferences() {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}/dashboard`, {
                method: 'GET',
                headers: authService.getAuthHeaders(),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể lấy tùy chọn dashboard');
            }

            return data;
        } catch (error) {
            console.error('Get dashboard preferences error:', error);
            throw error;
        }
    },

    /**
     * Update dashboard preferences
     * @param {Object} preferences - Dashboard preferences to update
     * @returns {Promise<Object>} Updated preferences
     */
    async updateDashboardPreferences(preferences) {
        try {
            const response = await fetch(`${SETTINGS_API_BASE}/dashboard`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(preferences),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Không thể cập nhật tùy chọn dashboard');
            }

            return data;
        } catch (error) {
            console.error('Update dashboard preferences error:', error);
            throw error;
        }
    }
};

export default staffSettingsService;
