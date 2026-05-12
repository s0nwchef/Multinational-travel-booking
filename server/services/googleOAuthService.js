import crypto from 'crypto';
import NguoiDung from '../models/NguoiDung.js';
import TaiKhoanOAuth from '../models/TaiKhoanOAuth.js';
import { createSession } from '../middleware/authMiddleware.js';

/**
 * Google OAuth Service
 * Handles Google OAuth 2.0 authentication flow
 */

// Google OAuth endpoints
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_PROFILE_URL = 'https://www.googleapis.com/oauth2/v2/userinfo';

// Environment variables
const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID;
const getGoogleClientSecret = () => process.env.GOOGLE_CLIENT_SECRET;
const getGoogleRedirectUri = () => process.env.GOOGLE_REDIRECT_URI;

/**
 * Generate a cryptographically secure state parameter
 * Used to prevent CSRF attacks during OAuth flow
 * 
 * @returns {string} A random 32-byte hex string
 */
export const generateState = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Validate state parameter against stored state
 * 
 * @param {string} state - The state parameter from OAuth callback
 * @param {string} storedState - The state parameter stored during OAuth initiation
 * @returns {boolean} True if states match, false otherwise
 */
export const validateState = (state, storedState) => {
    if (!state || !storedState) {
        return false;
    }
    
    // Use timing-safe comparison to prevent timing attacks
    try {
        return crypto.timingSafeEqual(
            Buffer.from(state, 'utf8'),
            Buffer.from(storedState, 'utf8')
        );
    } catch (error) {
        // If buffers have different lengths or invalid encoding, return false
        return false;
    }
};

/**
 * Exchange authorization code for tokens
 * 
 * @param {string} code - The authorization code from Google
 * @param {string} redirectUri - The redirect URI used in the authorization request (must match exactly)
 * @returns {Promise<TokenResponse>} Token response containing access_token, id_token, etc.
 * @throws {Error} If token exchange fails
 */
export const exchangeCodeForTokens = async (code, redirectUri) => {
    const clientId = getGoogleClientId();
    const clientSecret = getGoogleClientSecret();

    if (!clientId || !clientSecret) {
        throw new Error('Missing Google OAuth configuration. Please check environment variables.');
    }

    if (!redirectUri) {
        throw new Error('Redirect URI is required for token exchange.');
    }

    console.log('[OAuth] Exchanging code for tokens...');
    console.log('[OAuth] Client ID:', clientId?.substring(0, 20) + '...');
    console.log('[OAuth] Redirect URI:', redirectUri);
    console.log('[OAuth] Code:', code?.substring(0, 20) + '...');

    const requestBody = new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
    }).toString();

    console.log('[OAuth] Request body prepared');

    const response = await fetch(GOOGLE_TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[OAuth] Token exchange failed:', JSON.stringify(errorData, null, 2));
        const errorMessage = errorData.error_description || errorData.error || 'Token exchange failed';
        throw new Error(errorMessage);
    }

    console.log('[OAuth] Token exchange successful');
    return response.json();
};

/**
 * Fetch user profile from Google API using access token
 * 
 * @param {string} accessToken - The access token from Google
 * @returns {Promise<GoogleProfile>} User profile from Google
 * @throws {Error} If profile fetch fails
 */
export const getUserProfile = async (accessToken) => {
    const response = await fetch(GOOGLE_PROFILE_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || 'Failed to fetch user profile';
        throw new Error(errorMessage);
    }

    return response.json();
};

/**
 * Transform Google profile to internal format
 * Extracts relevant fields from Google profile response
 * 
 * @param {Object} googleProfile - The raw profile from Google API
 * @param {string} googleProfile.id - Google's unique user ID
 * @param {string} googleProfile.email - User's email address
 * @param {boolean} googleProfile.verified_email - Whether email is verified
 * @param {string} googleProfile.name - User's full name
 * @param {string} [googleProfile.given_name] - User's first name
 * @param {string} [googleProfile.family_name] - User's last name
 * @param {string} [googleProfile.picture] - URL to user's avatar
 * @param {string} [googleProfile.locale] - User's locale
 * @returns {Object} Internal profile format
 */
export const extractProfile = (googleProfile) => {
    return {
        googleId: googleProfile.id,
        email: googleProfile.email,
        verifiedEmail: googleProfile.verified_email || false,
        fullName: googleProfile.name,
        givenName: googleProfile.given_name || '',
        familyName: googleProfile.family_name || '',
        avatarUrl: googleProfile.picture || '',
        locale: googleProfile.locale || '',
    };
};

/**
 * Verify Google ID token
 * Validates the ID token signature and extracts claims
 * 
 * @param {string} idToken - The ID token from Google
 * @returns {Promise<Object>} Decoded ID token with user claims
 * @throws {Error} If token verification fails
 */
export const verifyIdToken = async (idToken) => {
    const clientId = getGoogleClientId();
    
    if (!clientId) {
        throw new Error('Missing Google Client ID configuration');
    }

    // Use Google's tokeninfo endpoint to verify the token
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_description || 'ID token verification failed');
    }

    const tokenInfo = await response.json();

    // Verify the token is for our client
    if (tokenInfo.aud !== clientId) {
        throw new Error('ID token audience mismatch');
    }

    return tokenInfo;
};

/**
 * Build user response object
 * 
 * @param {Object} user - User document from database
 * @returns {Object} Formatted user response
 */
const buildUserResponse = (user) => {
    return {
        id: user._id,
        email: user.email,
        fullName: user.ho_ten,
        ho_ten: user.ho_ten,
        role: user.vai_tro,
        vai_tro: user.vai_tro,
        avatarUrl: user.anh_dai_dien,
        anh_dai_dien: user.anh_dai_dien,
        diem: user.diem ?? 1,
        loyaltyPoints: user.diem ?? 1,
        phoneNumber: user.so_dien_thoai,
        so_dien_thoai: user.so_dien_thoai,
        createdAt: user.ngay_tao,
        ngay_tao: user.ngay_tao
    };
};

/**
 * Process complete OAuth login flow
 * Handles new user registration, existing user login, account linking, and conflicts
 * 
 * @param {string} code - The authorization code from Google
 * @param {string} redirectUri - The redirect URI used in the authorization request (must match exactly)
 * @returns {Promise<Object>} OAuth result with user, session, and message
 * @throws {Error} If OAuth flow fails
 */
export const processOAuthLogin = async (code, redirectUri) => {
    // Exchange code for tokens
    const tokenResponse = await exchangeCodeForTokens(code, redirectUri);
    
    // Get user profile
    const googleProfile = await getUserProfile(tokenResponse.access_token);
    
    // Extract to internal format
    const profile = extractProfile(googleProfile);
    
    // Validate: Check if email is verified
    if (!profile.verifiedEmail) {
        const error = new Error('Email Google chưa được xác thực');
        error.code = 'UNVERIFIED_EMAIL';
        error.httpStatus = 400;
        throw error;
    }
    
    // Find existing OAuth record by provider and provider_id
    const existingOAuth = await TaiKhoanOAuth.findOne({
        provider: 'google',
        provider_id: profile.googleId
    });
    
    // Case 2: Existing user login (OAuth already linked)
    if (existingOAuth) {
        const user = await NguoiDung.findById(existingOAuth.user_id);
        
        if (!user) {
            // Orphaned OAuth record - clean up and treat as new user
            await TaiKhoanOAuth.deleteOne({ _id: existingOAuth._id });
        } else {
            // Update avatar if changed
            if (profile.avatarUrl && user.anh_dai_dien !== profile.avatarUrl) {
                user.anh_dai_dien = profile.avatarUrl;
                await user.save();
            }
            
            // Create session
            const sessionId = createSession(user._id.toString());
            
            return {
                success: true,
                user: buildUserResponse(user),
                sessionId,
                message: 'Đăng nhập thành công',
                isNewUser: false,
                isLinked: false
            };
        }
    }
    
    // Find existing user by email
    const existingUser = await NguoiDung.findOne({ email: profile.email.toLowerCase() });
    
    if (existingUser) {
        // Check if user has any Google OAuth record
        const existingGoogleOAuth = await TaiKhoanOAuth.findOne({
            user_id: existingUser._id,
            provider: 'google'
        });
        
        // Case 4: Account conflict (email exists with different Google ID)
        // This can happen if user has a Google OAuth record but with different provider_id
        // Since we already checked for matching provider_id above, if we find a Google OAuth
        // record here, it must have a different provider_id
        if (existingGoogleOAuth) {
            const error = new Error('Tài khoản đã tồn tại với Google ID khác. Vui lòng liên hệ hỗ trợ.');
            error.code = 'ACCOUNT_CONFLICT';
            error.httpStatus = 409;
            throw error;
        }
        
        // Case 3: Account linking (email exists but no OAuth record)
        // Create OAuth record linked to existing user
        await TaiKhoanOAuth.create({
            user_id: existingUser._id,
            provider: 'google',
            provider_id: profile.googleId,
            email: profile.email,
            trang_thai: 'hoat_dong',
            provider_metadata: {
                name: profile.fullName,
                picture: profile.avatarUrl,
                locale: profile.locale
            }
        });
        
        // Update avatar if empty and Google has one
        if (!existingUser.anh_dai_dien && profile.avatarUrl) {
            existingUser.anh_dai_dien = profile.avatarUrl;
            await existingUser.save();
        }
        
        // Create session
        const sessionId = createSession(existingUser._id.toString());
        
        return {
            success: true,
            user: buildUserResponse(existingUser),
            sessionId,
            message: 'Tài khoản đã được liên kết',
            isNewUser: false,
            isLinked: true
        };
    }
    
    // Case 1: New user creation with OAuth record
    // Create new user
    const newUser = new NguoiDung({
        email: profile.email.toLowerCase(),
        ho_ten: profile.fullName,
        anh_dai_dien: profile.avatarUrl,
        vai_tro: 'user',
        so_dien_thoai: '',
        // mat_khau_hash is intentionally left empty for OAuth users
        // Pre-save validation in NguoiDung model handles this via OAuth check
    });
    
    // Save user first (this might fail if OAuth record doesn't exist yet,
    // but the pre-save validation should handle this - let's save anyway)
    // We need to create OAuth record first to pass pre-save validation
    // But OAuth record needs user_id... 
    // Solution: Save user first, then create OAuth, or use a different approach
    
    // Actually, looking at the pre-save validation in NguoiDung, it checks for OAuth record
    // using user_id. But we don't have user_id until we save the user.
    // This is a chicken-and-egg problem. Let's save the user without password first.
    // The pre-save validation only runs on isNew, so we need to handle this.
    
    // The pre-save in NguoiDung checks: if this.isNew && !this.mat_khau_hash
    // Then looks for TaiKhoanOAuth with user_id = this._id
    // But we haven't created the OAuth record yet!
    // 
    // Solution: We need to modify the order or skip validation for OAuth flow
    // For now, let's save user and catch the validation error, then create OAuth
    // and retry. OR we can use validateBeforeSave: false option.
    
    // Let's use a transaction-like approach:
    // 1. Create user with validateBeforeSave: false to skip the password validation
    // 2. Create OAuth record
    // 3. Both succeed = success
    
    try {
        // Save user without validation to bypass password requirement
        // The OAuth record will provide authentication
        await newUser.save({ validateBeforeSave: false });
    } catch (error) {
        // Handle duplicate email error (race condition)
        if (error.code === 11000) {
            const conflictError = new Error('Email đã được sử dụng');
            conflictError.code = 'EMAIL_EXISTS';
            conflictError.httpStatus = 409;
            throw conflictError;
        }
        throw error;
    }
    
    // Create OAuth record linked to new user
    try {
        await TaiKhoanOAuth.create({
            user_id: newUser._id,
            provider: 'google',
            provider_id: profile.googleId,
            email: profile.email,
            trang_thai: 'hoat_dong',
            provider_metadata: {
                name: profile.fullName,
                picture: profile.avatarUrl,
                locale: profile.locale
            }
        });
    } catch (error) {
        // If OAuth creation fails, clean up the user we just created
        await NguoiDung.deleteOne({ _id: newUser._id });
        
        // Handle duplicate OAuth record error
        if (error.code === 11000) {
            const conflictError = new Error('Tài khoản đã tồn tại với Google ID khác. Vui lòng liên hệ hỗ trợ.');
            conflictError.code = 'ACCOUNT_CONFLICT';
            conflictError.httpStatus = 409;
            throw conflictError;
        }
        throw error;
    }
    
    // Create session
    const sessionId = createSession(newUser._id.toString());
    
    return {
        success: true,
        user: buildUserResponse(newUser),
        sessionId,
        message: 'Đăng ký thành công',
        isNewUser: true,
        isLinked: false,
        tokens: {
            accessToken: tokenResponse.access_token,
            idToken: tokenResponse.id_token,
            expiresIn: tokenResponse.expires_in,
            tokenType: tokenResponse.token_type,
        },
        profile,
    };
};

export default {
    generateState,
    validateState,
    exchangeCodeForTokens,
    getUserProfile,
    extractProfile,
    verifyIdToken,
    processOAuthLogin,
};
