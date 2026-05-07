import NguoiDung from '../models/NguoiDung.js';
import bcrypt from 'bcryptjs';

export const getStaffProfile = async (req, res) => {
    try {
        const user = await NguoiDung.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy nhân viên' });
        
        const userObj = user.toObject();
        userObj.fullName = userObj.ho_ten;
        userObj.phoneNumber = userObj.so_dien_thoai;
        userObj.avatarUrl = userObj.anh_dai_dien;
        userObj.role = userObj.vai_tro;
        
        res.json({ user: userObj });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const updateStaffProfile = async (req, res) => {
    try {
        const { fullName, phoneNumber, avatarUrl, ho_ten, so_dien_thoai, anh_dai_dien } = req.body;
        const updateData = {};
        if (fullName || ho_ten) updateData.ho_ten = ho_ten || fullName;
        if (phoneNumber || so_dien_thoai) updateData.so_dien_thoai = so_dien_thoai || phoneNumber;
        if (avatarUrl || anh_dai_dien) updateData.anh_dai_dien = anh_dai_dien || avatarUrl;

        const user = await NguoiDung.findByIdAndUpdate(req.user.id, updateData, { new: true });
        
        const userObj = user.toObject();
        userObj.fullName = userObj.ho_ten;
        userObj.phoneNumber = userObj.so_dien_thoai;
        userObj.avatarUrl = userObj.anh_dai_dien;
        
        res.json({ message: 'Cập nhật thành công', user: userObj });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const changeStaffPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Thiếu thông tin' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'Mật khẩu phải >= 6 ký tự' });

        const user = await NguoiDung.findById(req.user.id).select('+mat_khau_hash');
        if (!user.mat_khau_hash) return res.status(400).json({ message: 'Tài khoản không có mật khẩu' });

        const isValid = await bcrypt.compare(currentPassword, user.mat_khau_hash);
        if (!isValid) return res.status(400).json({ message: 'Mật khẩu sai' });

        const salt = await bcrypt.genSalt(10);
        user.mat_khau_hash = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getStaffSettings = async (req, res) => {
    res.json({ settings: { emailNotifications: true, bookingAlerts: true, dashboardLayout: 'default', itemsPerPage: 10 } });
};

export const updateStaffSettings = async (req, res) => {
    res.json({ message: 'Cập nhật thành công', settings: req.body });
};

export const getDashboardPreferences = async (req, res) => {
    res.json({ preferences: { showRevenueChart: true, showBookingChart: true, showCustomerStats: true, defaultDateRange: '7d' } });
};

export const updateDashboardPreferences = async (req, res) => {
    res.json({ message: 'Cập nhật thành công', preferences: req.body });
};