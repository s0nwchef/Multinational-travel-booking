import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách user', error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo user', error: error.message });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Vui lòng cung cấp email và mật khẩu' 
            });
        }
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                message: 'Email hoặc mật khẩu không chính xác' 
            });
        }
        
        // Check if user has passwordHash (users created via seed have it)
        if (!user.passwordHash) {
            return res.status(401).json({ 
                message: 'Tài khoản không có mật khẩu, vui lòng liên hệ quản trị viên' 
            });
        }
        
        // Compare password (we need to import bcrypt)
        const bcrypt = await import('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Email hoặc mật khẩu không chính xác' 
            });
        }
        
        // Create session
        const { createSession } = await import('../middleware/authMiddleware.js');
        const sessionId = createSession(user._id.toString());
        
        // Return user data (excluding passwordHash)
        const userResponse = {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            avatarUrl: user.avatarUrl,
            phoneNumber: user.phoneNumber,
            loyaltyPoints: user.loyaltyPoints,
            loyaltyTier: user.loyaltyTier,
            staffId: user.staffId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        
        res.json({
            message: 'Đăng nhập thành công',
            user: userResponse,
            sessionId
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi đăng nhập', 
            error: error.message 
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        // Get user from request (set by auth middleware)
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Không có quyền truy cập, vui lòng đăng nhập' 
            });
        }
        
        res.json(req.user);
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy thông tin người dùng', 
            error: error.message 
        });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const { destroySession } = await import('../middleware/authMiddleware.js');
        
        if (req.sessionId) {
            destroySession(req.sessionId);
        }
        
        res.json({ 
            message: 'Đăng xuất thành công' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi đăng xuất', 
            error: error.message 
        });
    }
};
