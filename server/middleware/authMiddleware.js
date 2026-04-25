import User from '../models/User.js';

// Simple session storage (in production, use Redis or database)
const sessions = new Map();

export const requireAuth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const sessionId = req.headers['authorization'] || req.cookies?.sessionId;
            
            if (!sessionId) {
                return res.status(401).json({ 
                    message: 'Không có quyền truy cập, vui lòng đăng nhập' 
                });
            }
            
            const session = sessions.get(sessionId);
            if (!session) {
                return res.status(401).json({ 
                    message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' 
                });
            }
            
            // Check if session is expired (24 hours)
            const now = Date.now();
            if (now - session.createdAt > 24 * 60 * 60 * 1000) {
                sessions.delete(sessionId);
                return res.status(401).json({ 
                    message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' 
                });
            }
            
            // Get user from database
            const user = await User.findById(session.userId).select('-passwordHash');
            if (!user) {
                sessions.delete(sessionId);
                return res.status(401).json({ 
                    message: 'Người dùng không tồn tại' 
                });
            }
            
            // Check role authorization if roles are specified
            if (roles.length > 0 && !roles.includes(user.role)) {
                return res.status(403).json({ 
                    message: 'Không có quyền truy cập tính năng này' 
                });
            }
            
            // Attach user to request
            req.user = user;
            req.sessionId = sessionId;
            next();
            
        } catch (error) {
            console.error('Auth middleware error:', error);
            res.status(500).json({ 
                message: 'Lỗi xác thực', 
                error: error.message 
            });
        }
    };
};

export const createSession = (userId) => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessions.set(sessionId, {
        userId,
        createdAt: Date.now()
    });
    return sessionId;
};

export const destroySession = (sessionId) => {
    sessions.delete(sessionId);
};

// Clean up expired sessions periodically
setInterval(() => {
    const now = Date.now();
    const expiredSessions = [];
    
    for (const [sessionId, session] of sessions.entries()) {
        if (now - session.createdAt > 24 * 60 * 60 * 1000) {
            expiredSessions.push(sessionId);
        }
    }
    
    expiredSessions.forEach(sessionId => {
        sessions.delete(sessionId);
    });
    
    if (expiredSessions.length > 0) {
        console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
    }
}, 60 * 60 * 1000); // Run every hour