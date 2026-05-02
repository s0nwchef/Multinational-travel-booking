const API_BASE_URL = 'http://localhost:3000/api';

// Store session in localStorage
const SESSION_KEY = 'travel_session';

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
        return this.hasRole('tour_operator') || this.hasRole('admin');
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
            
            return user;
        } catch (error) {
            console.error('Fetch current user error:', error);
            return null;
        }
    }
};

export default authService;