import { authService } from './authService.js';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: jest.fn((key) => store[key] || null),
        setItem: jest.fn((key, value) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        })
    };
})();

// Mock fetch
global.fetch = jest.fn();

// Mock Date.now for session expiration tests
const originalDateNow = Date.now;

describe('authService', () => {
    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();
        
        // Reset localStorage mock
        localStorageMock.clear();
        
        // Mock global objects
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
            writable: true
        });
        
        // Reset Date.now
        Date.now = originalDateNow;
    });

    afterEach(() => {
        // Restore Date.now
        Date.now = originalDateNow;
    });

    describe('login', () => {
        it('should successfully login and save session', async () => {
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue({
                    sessionId: 'test-session-123',
                    user: { id: 'user123', email: 'test@example.com', role: 'user' }
                })
            };
            
            fetch.mockResolvedValue(mockResponse);

            const result = await authService.login('test@example.com', 'password123');

            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
            });

            expect(result.sessionId).toBe('test-session-123');
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'travel_session',
                expect.stringContaining('test-session-123')
            );
        });

        it('should throw error when login fails', async () => {
            const mockResponse = {
                ok: false,
                json: jest.fn().mockResolvedValue({
                    message: 'Invalid credentials'
                })
            };
            
            fetch.mockResolvedValue(mockResponse);

            await expect(authService.login('test@example.com', 'wrongpassword'))
                .rejects.toThrow('Invalid credentials');
        });

        it('should handle network errors', async () => {
            fetch.mockRejectedValue(new Error('Network error'));

            await expect(authService.login('test@example.com', 'password123'))
                .rejects.toThrow('Network error');
        });
    });

    describe('logout', () => {
        it('should logout and clear session', async () => {
            // Set up a session first
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const mockResponse = { ok: true };
            fetch.mockResolvedValue(mockResponse);

            const result = await authService.logout();

            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users/logout', {
                method: 'POST',
                headers: {
                    'Authorization': 'test-session-123',
                    'Content-Type': 'application/json',
                },
            });

            expect(localStorage.removeItem).toHaveBeenCalledWith('travel_session');
            expect(result).toBe(true);
        });

        it('should clear session even when logout API fails', async () => {
            fetch.mockRejectedValue(new Error('Network error'));

            const result = await authService.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('travel_session');
            expect(result).toBe(true);
        });

        it('should handle logout when no session exists', async () => {
            localStorageMock.getItem.mockReturnValue(null);

            const result = await authService.logout();

            expect(localStorage.removeItem).toHaveBeenCalledWith('travel_session');
            expect(result).toBe(true);
        });
    });

    describe('getSession', () => {
        it('should return session when valid', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const session = authService.getSession();

            expect(session).toEqual(sessionData);
            expect(localStorage.getItem).toHaveBeenCalledWith('travel_session');
        });

        it('should return null when no session exists', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const session = authService.getSession();

            expect(session).toBeNull();
        });

        it('should return null when session is expired', () => {
            const expiredSessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now() - (25 * 60 * 60 * 1000) // 25 hours ago
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(expiredSessionData));

            const session = authService.getSession();

            expect(session).toBeNull();
            expect(localStorage.removeItem).toHaveBeenCalledWith('travel_session');
        });

        it('should return null when session JSON is invalid', () => {
            localStorageMock.getItem.mockReturnValue('invalid-json');

            const session = authService.getSession();

            expect(session).toBeNull();
            expect(localStorage.removeItem).toHaveBeenCalledWith('travel_session');
        });
    });

    describe('getCurrentUser', () => {
        it('should return user from valid session', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', email: 'test@example.com', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const user = authService.getCurrentUser();

            expect(user).toEqual(sessionData.user);
        });

        it('should return null when no session exists', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const user = authService.getCurrentUser();

            expect(user).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('should return true when valid session exists', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const isAuthenticated = authService.isAuthenticated();

            expect(isAuthenticated).toBe(true);
        });

        it('should return false when no session exists', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const isAuthenticated = authService.isAuthenticated();

            expect(isAuthenticated).toBe(false);
        });
    });

    describe('hasRole', () => {
        it('should return true when user has specified role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'tour_operator' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const hasRole = authService.hasRole('tour_operator');

            expect(hasRole).toBe(true);
        });

        it('should return false when user does not have specified role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const hasRole = authService.hasRole('tour_operator');

            expect(hasRole).toBe(false);
        });

        it('should return false when no user exists', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const hasRole = authService.hasRole('tour_operator');

            expect(hasRole).toBe(false);
        });
    });

    describe('isTourOperator', () => {
        it('should return true for tour_operator role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'tour_operator' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const isTourOperator = authService.isTourOperator();

            expect(isTourOperator).toBe(true);
        });

        it('should return true for admin role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'admin' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const isTourOperator = authService.isTourOperator();

            expect(isTourOperator).toBe(true);
        });

        it('should return false for user role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const isTourOperator = authService.isTourOperator();

            expect(isTourOperator).toBe(false);
        });

        it('should return false when no user exists', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const isTourOperator = authService.isTourOperator();

            expect(isTourOperator).toBe(false);
        });
    });

    describe('getAuthHeaders', () => {
        it('should include Authorization header when session exists', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const headers = authService.getAuthHeaders();

            expect(headers).toEqual({
                'Content-Type': 'application/json',
                'Authorization': 'test-session-123'
            });
        });

        it('should not include Authorization header when no session exists', () => {
            localStorageMock.getItem.mockReturnValue(null);

            const headers = authService.getAuthHeaders();

            expect(headers).toEqual({
                'Content-Type': 'application/json'
            });
        });
    });

    describe('fetchCurrentUser', () => {
        it('should fetch and update current user', async () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const updatedUser = { id: 'user123', email: 'test@example.com', role: 'tour_operator' };
            const mockResponse = {
                ok: true,
                json: jest.fn().mockResolvedValue(updatedUser)
            };
            fetch.mockResolvedValue(mockResponse);

            const result = await authService.fetchCurrentUser();

            expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/users/current', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'test-session-123'
                }
            });

            expect(result).toEqual(updatedUser);
            expect(localStorage.setItem).toHaveBeenCalledWith(
                'travel_session',
                expect.stringContaining('tour_operator')
            );
        });

        it('should return null and clear session on 401 error', async () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            const mockResponse = {
                ok: false,
                status: 401
            };
            fetch.mockResolvedValue(mockResponse);

            const result = await authService.fetchCurrentUser();

            expect(result).toBeNull();
            expect(localStorage.removeItem).toHaveBeenCalledWith('travel_session');
        });

        it('should return null on network error', async () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            fetch.mockRejectedValue(new Error('Network error'));

            const result = await authService.fetchCurrentUser();

            expect(result).toBeNull();
        });

        it('should return null when no session exists', async () => {
            localStorageMock.getItem.mockReturnValue(null);

            const result = await authService.fetchCurrentUser();

            expect(result).toBeNull();
        });
    });

    describe('Role-based access control', () => {
        it('should correctly identify tour_operator role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'operator123', role: 'tour_operator' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            expect(authService.hasRole('tour_operator')).toBe(true);
            expect(authService.hasRole('admin')).toBe(false);
            expect(authService.hasRole('user')).toBe(false);
            expect(authService.isTourOperator()).toBe(true);
        });

        it('should correctly identify admin role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'admin123', role: 'admin' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            expect(authService.hasRole('admin')).toBe(true);
            expect(authService.hasRole('tour_operator')).toBe(false);
            expect(authService.hasRole('user')).toBe(false);
            expect(authService.isTourOperator()).toBe(true); // Admin is also considered tour operator
        });

        it('should correctly identify user role', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'user123', role: 'user' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            expect(authService.hasRole('user')).toBe(true);
            expect(authService.hasRole('tour_operator')).toBe(false);
            expect(authService.hasRole('admin')).toBe(false);
            expect(authService.isTourOperator()).toBe(false);
        });

        it('should handle multiple role checks', () => {
            const sessionData = {
                sessionId: 'test-session-123',
                user: { id: 'operator123', role: 'tour_operator' },
                timestamp: Date.now()
            };
            localStorageMock.getItem.mockReturnValue(JSON.stringify(sessionData));

            // Tour operator should have access to tour_operator routes
            expect(authService.hasRole('tour_operator')).toBe(true);
            // Tour operator should not have access to admin-only routes
            expect(authService.hasRole('admin')).toBe(false);
            // Tour operator is considered a tour operator for staff routes
            expect(authService.isTourOperator()).toBe(true);
        });
    });
});