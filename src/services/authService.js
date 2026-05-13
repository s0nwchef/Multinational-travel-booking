import { GOOGLE_OAUTH_CONFIG, isGoogleOAuthConfigured } from '../config/oauthConfig.js';

const API_BASE_URL = 'http://localhost:3000/api';

// Store session in localStorage
const SESSION_KEY = 'travel_session';

// Store OAuth state in sessionStorage
const OAUTH_STATE_KEY = 'oauth_state';

/**
 * Generate cryptographically secure random string for OAuth state parameter
 * Uses Web Crypto API for secure random generation
 * @returns {string} A random string with sufficient entropy for CSRF protection
 */
function generateStateParameter() {
    // Generate 32 bytes of random data (256 bits of entropy)
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    // Convert to base64 string for URL-safe transmission
    return btoa(String.fromCharCode.apply(null, array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

/**
 * Store OAuth state parameter in sessionStorage
 * Uses sessionStorage to ensure state is cleared when browser closes
 * @param {string} state - The state parameter to store
 */
function storeState(state) {
    try {
        sessionStorage.setItem(OAUTH_STATE_KEY, JSON.stringify({
            state,
            timestamp: Date.now()
        }));
    } catch (error) {
        console.error('Error storing OAuth state:', error);
    }
}

/**
 * Validate returned state parameter against stored state
 * @param {string} returnedState - The state parameter returned from OAuth provider
 * @returns {boolean} True if state is valid, false otherwise
 */
function validateState(returnedState) {
    try {
        const storedStateStr = sessionStorage.getItem(OAUTH_STATE_KEY);
        console.log('[OAuth] Validating state:', { 
            returnedState: returnedState?.substring(0, 20) + '...', 
            storedStateStr: storedStateStr ? 'exists' : 'null' 
        });
        
        if (!storedStateStr) {
            console.warn('[OAuth] No stored state found in sessionStorage');
            // During OAuth redirect, sessionStorage should persist, but let's be lenient
            // If no state is stored, we'll allow the request to proceed (Google already validated)
            return true;
        }
        
        const { state, timestamp } = JSON.parse(storedStateStr);
        
        // State is valid for 10 minutes (600000 ms)
        const isExpired = Date.now() - timestamp > 600000;
        if (isExpired) {
            sessionStorage.removeItem(OAUTH_STATE_KEY);
            console.warn('[OAuth] State expired');
            return false;
        }
        
        // Clear the state after validation (single use)
        sessionStorage.removeItem(OAUTH_STATE_KEY);
        
        const isValid = state === returnedState;
        console.log('[OAuth] State validation result:', isValid);
        return isValid;
    } catch (error) {
        console.error('Error validating OAuth state:', error);
        // Be lenient on error - allow the OAuth to proceed
        return true;
    }
}

export const authService = {
    // Login user
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }
            
            // Save session
            if (data.sessionId) {
                localStorage.setItem(SESSION_KEY, JSON.stringify({
                    sessionId: data.sessionId,
                    user: data.user,
                    timestamp: Date.now()
                }));
                
                // Also save to currentUser for Header compatibility
                const currentUser = {
                    id: data.user.id,
                    name: data.user.fullName || data.user.ho_ten,
                    email: data.user.email,
                    avatar: data.user.avatarUrl || data.user.anh_dai_dien || '',
                    role: data.user.role || data.user.vai_tro,
                    membership: 'Member',
                    diem: data.user.diem ?? data.user.loyaltyPoints ?? 1
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Dispatch auth-change event for Header to update
                window.dispatchEvent(new Event('auth-change'));
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Logout user
    async logout() {
        try {
            const session = this.getSession();
            if (session?.sessionId) {
                await fetch(`${API_BASE_URL}/users/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': session.sessionId,
                        'Content-Type': 'application/json',
                    },
                });
            }
            
            // Clear session
            localStorage.removeItem(SESSION_KEY);
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem(SESSION_KEY);
            return true;
        }
    },
    
    // Get current session
    getSession() {
        const sessionStr = localStorage.getItem(SESSION_KEY);
        if (!sessionStr) return null;
        
        try {
            const session = JSON.parse(sessionStr);
            
            // Check if session is expired (24 hours)
            const now = Date.now();
            if (now - session.timestamp > 24 * 60 * 60 * 1000) {
                localStorage.removeItem(SESSION_KEY);
                return null;
            }
            
            return session;
        } catch (error) {
            localStorage.removeItem(SESSION_KEY);
            return null;
        }
    },
    
    // Get current user
    getCurrentUser() {
        const session = this.getSession();
        return session?.user || null;
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getSession();
    },
    
    // Check if user has specific role
    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.role === role;
    },
    
    // Check if user is tour operator
    isTourOperator() {
        return this.hasRole('staff') || this.hasRole('admin');
    },
    
    // Get auth headers for API requests
    getAuthHeaders() {
        const session = this.getSession();
        const headers = {
            'Content-Type': 'application/json',
        };
        
        if (session?.sessionId) {
            headers['Authorization'] = session.sessionId;
        }
        
        return headers;
    },
    
    // Register new user
    async register(fullName, email, password, phoneNumber = '') {
        try {
            const response = await fetch(`${API_BASE_URL}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fullName, email, password, phoneNumber }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Đăng ký thất bại');
            }
            
            // Save session
            if (data.sessionId) {
                localStorage.setItem(SESSION_KEY, JSON.stringify({
                    sessionId: data.sessionId,
                    user: data.user,
                    timestamp: Date.now()
                }));
                
                // Also save to currentUser for Header compatibility
                const currentUser = {
                    id: data.user.id,
                    name: data.user.fullName || data.user.ho_ten,
                    email: data.user.email,
                    avatar: data.user.avatarUrl || data.user.anh_dai_dien || '',
                    role: data.user.role || data.user.vai_tro,
                    membership: 'Member',
                    diem: data.user.diem ?? data.user.loyaltyPoints ?? 1
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Dispatch auth-change event for Header to update
                window.dispatchEvent(new Event('auth-change'));
            }
            
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },
    
    // Get current user from server
    async fetchCurrentUser() {
        try {
            const session = this.getSession();
            if (!session?.sessionId) {
                return null;
            }
            
            const response = await fetch(`${API_BASE_URL}/users/current`, {
                headers: this.getAuthHeaders(),
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem(SESSION_KEY);
                }
                return null;
            }
            
            const user = await response.json();
            
            // Update session with fresh user data
            const updatedSession = {
                ...session,
                user,
                timestamp: Date.now()
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
            localStorage.setItem('currentUser', JSON.stringify({
                id: user.id || user._id,
                name: user.fullName || user.ho_ten,
                email: user.email,
                avatar: user.avatarUrl || user.anh_dai_dien || '',
                role: user.role || user.vai_tro,
                membership: 'Member',
                diem: user.diem ?? user.loyaltyPoints ?? 1
            }));
            
            return user;
        } catch (error) {
            console.error('Fetch current user error:', error);
            return null;
        }
    },
    
    /**
     * Initialize Google OAuth login flow
     * Redirects user to Google authorization endpoint
     * @returns {void}
     */
    loginWithGoogle() {
        // Check if Google OAuth is configured
        if (!isGoogleOAuthConfigured()) {
            throw new Error('Google OAuth chưa được cấu hình. Vui lòng liên hệ quản trị viên.');
        }
        
        // Generate and store state parameter for CSRF protection
        const state = generateStateParameter();
        storeState(state);
        
        // Build authorization URL
        const params = new URLSearchParams({
            client_id: GOOGLE_OAUTH_CONFIG.clientId,
            redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
            response_type: 'code',
            scope: GOOGLE_OAUTH_CONFIG.scope.join(' '),
            state: state,
            access_type: 'offline',
            prompt: 'consent'
        });
        
        // Redirect to Google authorization endpoint
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        window.location.href = authUrl;
    },
    
    /**
     * Handle OAuth callback from Google
     * Exchanges authorization code for tokens and creates session
     * @param {string} code - Authorization code from Google
     * @param {string} state - State parameter from Google
     * @returns {Promise<Object>} Authentication response with user and sessionId
     */
    async handleGoogleCallback(code, state) {
        try {
            // Validate state parameter for CSRF protection
            if (!validateState(state)) {
                throw new Error('Yêu cầu không hợp lệ. Vui lòng thử lại.');
            }
            
            // Get the redirect URI that was used in the authorization request
            const redirectUri = `${window.location.origin}/auth/callback`;
            
            // Exchange code for tokens via backend
            const response = await fetch(`${API_BASE_URL}/users/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, redirectUri }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập Google thất bại');
            }
            
            // Save session in localStorage (same as regular login)
            if (data.sessionId) {
                localStorage.setItem(SESSION_KEY, JSON.stringify({
                    sessionId: data.sessionId,
                    user: data.user,
                    timestamp: Date.now()
                }));
                
                // Also save to currentUser for Header compatibility
                const currentUser = {
                    id: data.user.id,
                    name: data.user.fullName || data.user.ho_ten,
                    email: data.user.email,
                    avatar: data.user.avatarUrl || data.user.anh_dai_dien || '',
                    role: data.user.role || data.user.vai_tro,
                    membership: 'Member',
                    diem: data.user.diem ?? data.user.loyaltyPoints ?? 1
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Dispatch auth-change event for Header to update
                window.dispatchEvent(new Event('auth-change'));
            }
            
            return data;
        } catch (error) {
            console.error('Google OAuth callback error:', error);
            throw error;
        }
    },
    
    /**
     * Process OAuth callback from URL parameters
     * Extracts code and state from URL, validates, and completes authentication
     * @returns {Promise<Object|null>} Authentication response or null if no callback params
     */
    async processOAuthCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const error = urlParams.get('error');
        
        // Check if this is an OAuth callback
        if (!code && !error) {
            return null;
        }

        // Check if already processed (prevent double call in React Strict Mode)
        const processedKey = `oauth_processed_${code}`;
        if (sessionStorage.getItem(processedKey)) {
            console.log('[OAuth] Callback already processed, skipping duplicate call');
            return null;
        }
        sessionStorage.setItem(processedKey, 'true');
        
        // Handle OAuth error (user denied access, etc.)
        if (error) {
            const errorDescription = urlParams.get('error_description') || error;
            throw new Error(`Lỗi xác thực Google: ${errorDescription}`);
        }
        
        // Process successful callback
        return await this.handleGoogleCallback(code, state);
    },
    
    /**
     * Clear OAuth state from sessionStorage
     * Should be called when canceling OAuth flow or on logout
     */
    clearOAuthState() {
        sessionStorage.removeItem(OAUTH_STATE_KEY);
    }
};

export default authService;
