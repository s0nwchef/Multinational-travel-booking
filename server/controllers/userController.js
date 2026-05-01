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

export const registerUser = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email và mật khẩu là bắt buộc' 
            });
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Email không hợp lệ' 
            });
        }

        // 3. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Mật khẩu phải có ít nhất 6 ký tự' 
            });
        }

        // 4. Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Email đã được sử dụng' 
            });
        }

        // 5. Hash password
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 6. Create user
        const newUser = new User({
            email: email.toLowerCase(),
            fullName: fullName || '',
            passwordHash,
            phoneNumber: phoneNumber || '',
            role: 'user',
            loyaltyPoints: 0,
            loyaltyTier: 'Bronze'
        });

        const savedUser = await newUser.save();

        // 7. Create session
        const { createSession } = await import('../middleware/authMiddleware.js');
        const sessionId = createSession(savedUser._id.toString());

        // 8. Return user data (exclude passwordHash)
        const userResponse = {
            id: savedUser._id,
            email: savedUser.email,
            fullName: savedUser.fullName,
            role: savedUser.role,
            avatarUrl: savedUser.avatarUrl,
            phoneNumber: savedUser.phoneNumber,
            loyaltyPoints: savedUser.loyaltyPoints,
            loyaltyTier: savedUser.loyaltyTier,
            createdAt: savedUser.createdAt
        };

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: userResponse,
            sessionId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi đăng ký', 
            error: error.message 
        });
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