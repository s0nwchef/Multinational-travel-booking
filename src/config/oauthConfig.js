/**
 * OAuth Configuration
 * Cấu hình cho các nhà cung cấp OAuth (Google, Facebook, Apple)
 */

/**
 * Danh sách các nhà cung cấp OAuth
 * - Google: Hoạt động
 * - Facebook: Đang phát triển
 * - Apple: Đang phát triển
 */
export const OAUTH_PROVIDERS = {
    google: {
        name: 'Google',
        icon: 'google-icon',
        active: true
    },
    facebook: {
        name: 'Facebook',
        icon: 'facebook-icon',
        active: false,
        message: 'Tính năng đang phát triển'
    },
    apple: {
        name: 'Apple',
        icon: 'apple-icon',
        active: false,
        message: 'Tính năng đang phát triển'
    }
};

/**
 * Cấu hình Google OAuth
 * Sử dụng environment variable cho Client ID
 */
export const GOOGLE_OAUTH_CONFIG = {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: ['openid', 'email', 'profile']
};

/**
 * Kiểm tra xem Google OAuth đã được cấu hình chưa
 * @returns {boolean} True nếu Client ID đã được thiết lập
 */
export const isGoogleOAuthConfigured = () => {
    return Boolean(GOOGLE_OAUTH_CONFIG.clientId);
};

/**
 * Lấy danh sách các provider đang hoạt động
 * @returns {string[]} Mảng các tên provider đang hoạt động
 */
export const getActiveProviders = () => {
    return Object.entries(OAUTH_PROVIDERS)
        .filter(([, config]) => config.active)
        .map(([key]) => key);
};

/**
 * Lấy thông tin provider theo tên
 * @param {string} providerName - Tên provider (google, facebook, apple)
 * @returns {Object|null} Configuration của provider hoặc null nếu không tìm thấy
 */
export const getProviderConfig = (providerName) => {
    return OAUTH_PROVIDERS[providerName] || null;
};

export default {
    OAUTH_PROVIDERS,
    GOOGLE_OAUTH_CONFIG,
    isGoogleOAuthConfigured,
    getActiveProviders,
    getProviderConfig
};
