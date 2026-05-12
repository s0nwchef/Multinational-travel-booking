/**
 * OAuth Error Definitions
 * Standardized error codes and messages for OAuth authentication
 */

export const GOOGLE_OAUTH_ERRORS = {
    INVALID_CODE: {
        code: 'INVALID_AUTHORIZATION_CODE',
        message: 'Mã xác thực không hợp lệ hoặc đã hết hạn',
        httpStatus: 400
    },
    INVALID_STATE: {
        code: 'INVALID_STATE_PARAMETER',
        message: 'Yêu cầu không hợp lệ, vui lòng thử lại',
        httpStatus: 400
    },
    TOKEN_EXCHANGE_FAILED: {
        code: 'TOKEN_EXCHANGE_FAILED',
        message: 'Không thể kết nối với Google, vui lòng thử lại',
        httpStatus: 502
    },
    UNVERIFIED_EMAIL: {
        code: 'UNVERIFIED_EMAIL',
        message: 'Email Google chưa được xác thực',
        httpStatus: 400
    },
    ACCOUNT_CONFLICT: {
        code: 'ACCOUNT_CONFLICT',
        message: 'Tài khoản đã tồn tại với Google ID khác. Vui lòng liên hệ hỗ trợ.',
        httpStatus: 409
    },
    PROFILE_FETCH_FAILED: {
        code: 'PROFILE_FETCH_FAILED',
        message: 'Không thể lấy thông tin từ Google',
        httpStatus: 502
    },
    MISSING_CREDENTIALS: {
        code: 'MISSING_CREDENTIALS',
        message: 'Lỗi cấu hình máy chủ',
        httpStatus: 500
    },
    PROVIDER_IN_DEVELOPMENT: {
        code: 'PROVIDER_IN_DEVELOPMENT',
        message: 'Tính năng đang phát triển',
        httpStatus: 400
    }
};

/**
 * Create a standardized OAuth error response
 * 
 * @param {string} errorKey - Key from GOOGLE_OAUTH_ERRORS
 * @param {string} [details] - Additional error details
 * @returns {Object} Error response object
 */
export const createOAuthError = (errorKey, details = null) => {
    const errorConfig = GOOGLE_OAUTH_ERRORS[errorKey];
    
    if (!errorConfig) {
        return {
            success: false,
            message: 'Lỗi không xác định',
            error: {
                code: 'UNKNOWN_ERROR',
                details: null
            }
        };
    }
    
    return {
        success: false,
        message: errorConfig.message,
        error: {
            code: errorConfig.code,
            details
        }
    };
};

/**
 * Get HTTP status code for an OAuth error
 * 
 * @param {string} errorKey - Key from GOOGLE_OAUTH_ERRORS
 * @returns {number} HTTP status code
 */
export const getErrorHttpStatus = (errorKey) => {
    const errorConfig = GOOGLE_OAUTH_ERRORS[errorKey];
    return errorConfig?.httpStatus || 500;
};

/**
 * Map error code from googleOAuthService to error key
 * 
 * @param {string} code - Error code from service
 * @returns {string} Error key for GOOGLE_OAUTH_ERRORS
 */
export const mapServiceErrorToKey = (code) => {
    const mapping = {
        'UNVERIFIED_EMAIL': 'UNVERIFIED_EMAIL',
        'ACCOUNT_CONFLICT': 'ACCOUNT_CONFLICT',
        'EMAIL_EXISTS': 'ACCOUNT_CONFLICT',
        'INVALID_AUTHORIZATION_CODE': 'INVALID_CODE',
        'TOKEN_EXCHANGE_FAILED': 'TOKEN_EXCHANGE_FAILED',
        'PROFILE_FETCH_FAILED': 'PROFILE_FETCH_FAILED'
    };
    
    return mapping[code] || 'INVALID_CODE';
};
