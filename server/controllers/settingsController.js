import NguoiDung from '../models/NguoiDung.js';
import bcrypt from 'bcryptjs';

export const getProfile = async (req, res) => {
    try {
        const user = await NguoiDung.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        
        // Provide backwards-compatible mapping for frontend
        const userObj = user.toObject();
        userObj.fullName = userObj.ho_ten;
        userObj.phoneNumber = userObj.so_dien_thoai;
        userObj.avatarUrl = userObj.anh_dai_dien;
        userObj.role = userObj.vai_tro;
        
        res.json({ user: userObj });
    } catch (error) { res.status(500).json({ message: 'Lỗi khi lấy thông tin profile', error: error.message }); }
};

export const updateProfile = async (req, res) => {
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
        
        res.json({ message: 'Cập nhật profile thành công', user: userObj });
    } catch (error) { res.status(500).json({ message: 'Lỗi khi cập nhật profile', error: error.message }); }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'Thiếu thông tin mật khẩu' });
        if (newPassword.length < 6) return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });

        const user = await NguoiDung.findById(req.user.id).select('+mat_khau_hash');
        if (!user.mat_khau_hash) return res.status(400).json({ message: 'Tài khoản không có mật khẩu' });

        const isValid = await bcrypt.compare(currentPassword, user.mat_khau_hash);
        if (!isValid) return res.status(400).json({ message: 'Mật khẩu hiện tại không đúng' });

        const salt = await bcrypt.genSalt(10);
        user.mat_khau_hash = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi khi đổi mật khẩu', error: error.message }); }
};

export const getNotificationPreferences = async (req, res) => {
    res.json({ preferences: { email: true, bookingConfirmation: true, bookingReminder: true, promotions: true, newsletter: false } });
};

export const updateNotificationPreferences = async (req, res) => {
    res.json({ message: 'Cập nhật cài đặt thông báo thành công', preferences: req.body });
};

export const getLoyaltyInfo = async (req, res) => {
    res.json({ points: 0, tier: 'Bronze', pointsToNextTier: 1000, nextTier: 'Silver', tierBenefits: ['Điểm thưởng cơ bản'] });
};

export const deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) return res.status(400).json({ message: 'Cần xác nhận mật khẩu' });

        const user = await NguoiDung.findById(req.user.id).select('+mat_khau_hash');
        if (user.mat_khau_hash) {
            const isValid = await bcrypt.compare(password, user.mat_khau_hash);
            if (!isValid) return res.status(400).json({ message: 'Mật khẩu không đúng' });
        }

        user.email = `deleted_${user._id}_${Date.now()}@deleted.com`;
        user.mat_khau_hash = null;
        user.ho_ten = 'Deleted User';
        await user.save();
        res.json({ message: 'Xóa tài khoản thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi khi xóa tài khoản', error: error.message }); }
};