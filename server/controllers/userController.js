import NguoiDung from '../models/NguoiDung.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await NguoiDung.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách user', error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = new NguoiDung(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo user', error: error.message });
    }
};

export const registerUser = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email và mật khẩu là bắt buộc' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email không hợp lệ' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự' });
        }

        const existingUser = await NguoiDung.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'Email đã được sử dụng' });
        }

        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new NguoiDung({
            email: email.toLowerCase(),
            ho_ten: fullName || '',
            mat_khau_hash: passwordHash,
            so_dien_thoai: phoneNumber || '',
            vai_tro: 'user'
        });

        const savedUser = await newUser.save();

        const { createSession } = await import('../middleware/authMiddleware.js');
        const sessionId = createSession(savedUser._id.toString());

        const userResponse = {
            id: savedUser._id,
            email: savedUser.email,
            fullName: savedUser.ho_ten,
            ho_ten: savedUser.ho_ten,
            diem: savedUser.diem,
            role: savedUser.vai_tro,
            vai_tro: savedUser.vai_tro,
            avatarUrl: savedUser.anh_dai_dien,
            anh_dai_dien: savedUser.anh_dai_dien,
            phoneNumber: savedUser.so_dien_thoai,
            so_dien_thoai: savedUser.so_dien_thoai,
            createdAt: savedUser.ngay_tao,
            ngay_tao: savedUser.ngay_tao
        };

        res.status(201).json({ message: 'Đăng ký thành công', user: userResponse, sessionId });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký', error: error.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu' });
        }
        
        // Need to explicitly select mat_khau_hash since it's hidden by default
        const user = await NguoiDung.findOne({ email }).select('+mat_khau_hash');
        if (!user) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }
        
        if (!user.mat_khau_hash) {
            return res.status(401).json({ message: 'Tài khoản không có mật khẩu, vui lòng liên hệ quản trị viên' });
        }
        
        const bcrypt = await import('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, user.mat_khau_hash);
        
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }
        
        const { createSession } = await import('../middleware/authMiddleware.js');
        const sessionId = createSession(user._id.toString());
        
        const userResponse = {
            id: user._id,
            email: user.email,
            fullName: user.ho_ten,
            ho_ten: user.ho_ten,
            diem: user.diem,
            role: user.vai_tro,
            vai_tro: user.vai_tro,
            avatarUrl: user.anh_dai_dien,
            anh_dai_dien: user.anh_dai_dien,
            phoneNumber: user.so_dien_thoai,
            so_dien_thoai: user.so_dien_thoai,
            createdAt: user.ngay_tao,
            ngay_tao: user.ngay_tao,
            updatedAt: user.ngay_cap_nhat,
            ngay_cap_nhat: user.ngay_cap_nhat
        };
        
        res.json({ message: 'Đăng nhập thành công', user: userResponse, sessionId });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập', error: error.message });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Không có quyền truy cập, vui lòng đăng nhập' });
        }
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng', error: error.message });
    }
};

export const logoutUser = async (req, res) => {
    try {
        const { destroySession } = await import('../middleware/authMiddleware.js');
        if (req.sessionId) {
            destroySession(req.sessionId);
        }
        res.json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đăng xuất', error: error.message });
    }
};