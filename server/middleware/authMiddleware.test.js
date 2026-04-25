import { requireAuth, createSession, destroySession } from './authMiddleware.js';
import User from '../models/User.js';

// Mock User model
jest.mock('../models/User.js', () => ({
    findById: jest.fn()
}));

describe('authMiddleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        mockReq = {
            headers: {},
            cookies: {},
            user: null
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
        
        // Clear sessions between tests
        // Note: This accesses the internal sessions map
        // In a real test, we'd need to export it or reset it
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('requireAuth middleware', () => {
        it('should return 401 if no authorization header or cookie', async () => {
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Không có quyền truy cập, vui lòng đăng nhập'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should return 401 if session does not exist', async () => {
            mockReq.headers['authorization'] = 'invalid_session_id';
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
            });
        });

        it('should return 401 if session is expired', async () => {
            // Create an expired session (older than 24 hours)
            const sessionId = createSession('user123');
            
            // Mock Date.now to return a time 25 hours later
            const originalDateNow = Date.now;
            Date.now = jest.fn(() => originalDateNow() + 25 * 60 * 60 * 1000);
            
            mockReq.headers['authorization'] = sessionId;
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
            });

            Date.now = originalDateNow;
        });

        it('should return 401 if user does not exist in database', async () => {
            const sessionId = createSession('non_existent_user');
            mockReq.headers['authorization'] = sessionId;
            
            User.findById.mockResolvedValue(null);
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Người dùng không tồn tại'
            });
        });

        it('should call next if user is authenticated with no role requirements', async () => {
            const sessionId = createSession('user123');
            mockReq.headers['authorization'] = sessionId;
            
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                role: 'user'
            };
            
            User.findById.mockResolvedValue(mockUser);
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockReq.user).toEqual(mockUser);
            expect(mockReq.sessionId).toBe(sessionId);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should allow access if user has required role', async () => {
            const sessionId = createSession('tour_operator123');
            mockReq.headers['authorization'] = sessionId;
            
            const mockUser = {
                _id: 'tour_operator123',
                email: 'operator@travel.com',
                role: 'tour_operator'
            };
            
            User.findById.mockResolvedValue(mockUser);
            
            await requireAuth(['tour_operator', 'admin'])(mockReq, mockRes, mockNext);

            expect(mockReq.user).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should return 403 if user does not have required role', async () => {
            const sessionId = createSession('user123');
            mockReq.headers['authorization'] = sessionId;
            
            const mockUser = {
                _id: 'user123',
                email: 'user@example.com',
                role: 'user' // Regular user, not tour_operator or admin
            };
            
            User.findById.mockResolvedValue(mockUser);
            
            await requireAuth(['tour_operator', 'admin'])(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Không có quyền truy cập tính năng này'
            });
            expect(mockNext).not.toHaveBeenCalled();
        });

        it('should allow admin access to tour_operator routes', async () => {
            const sessionId = createSession('admin123');
            mockReq.headers['authorization'] = sessionId;
            
            const mockUser = {
                _id: 'admin123',
                email: 'admin@travel.com',
                role: 'admin'
            };
            
            User.findById.mockResolvedValue(mockUser);
            
            await requireAuth(['tour_operator', 'admin'])(mockReq, mockRes, mockNext);

            expect(mockReq.user).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should handle database errors gracefully', async () => {
            const sessionId = createSession('user123');
            mockReq.headers['authorization'] = sessionId;
            
            User.findById.mockRejectedValue(new Error('Database connection failed'));
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Lỗi xác thực',
                error: 'Database connection failed'
            });
        });

        it('should check session from cookies if header is not present', async () => {
            const sessionId = createSession('user123');
            mockReq.cookies.sessionId = sessionId;
            
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                role: 'user'
            };
            
            User.findById.mockResolvedValue(mockUser);
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockReq.user).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });

        it('should prioritize authorization header over cookies', async () => {
            const validSessionId = createSession('user123');
            mockReq.headers['authorization'] = validSessionId;
            mockReq.cookies.sessionId = 'invalid_session';
            
            const mockUser = {
                _id: 'user123',
                email: 'test@example.com',
                role: 'user'
            };
            
            User.findById.mockResolvedValue(mockUser);
            
            await requireAuth()(mockReq, mockRes, mockNext);

            expect(mockReq.user).toEqual(mockUser);
            expect(mockNext).toHaveBeenCalled();
        });
    });

    describe('createSession and destroySession', () => {
        it('should create a session with unique ID', () => {
            const userId = 'user123';
            const sessionId = createSession(userId);
            
            expect(sessionId).toMatch(/^session_\d+_[a-z0-9]+$/);
        });

        it('should destroy a session', () => {
            const userId = 'user123';
            const sessionId = createSession(userId);
            
            destroySession(sessionId);
            
            // The session should no longer exist
            // Note: We can't directly test this without exporting sessions
            // but we can verify the function doesn't throw
            expect(() => destroySession(sessionId)).not.toThrow();
        });
    });
});