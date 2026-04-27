import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get staff profile
export const getStaffProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select('-passwordHash -wishlist');

        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy nhân viên' 
            });
        }

        res.json({ user });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy thông tin profile', 
            error: error.message 
        });
    }
};

// Update staff profile
export const updateStaffProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phoneNumber, avatarUrl } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { fullName, phoneNumber, avatarUrl },
            { new: true }
        ).select('-passwordHash -wishlist');

        res.json({
            message: 'Cập nhật profile thành công',
            user
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật profile', 
            error: error.message 
        });
    }
};

// Change staff password
export const changeStaffPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin mật khẩu' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
            });
        }

        const user = await User.findById(userId);

        if (!user.passwordHash) {
            return res.status(400).json({ 
                message: 'Tài khoản không có mật khẩu' 
            });
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return res.status(400).json({ 
                message: 'Mật khẩu hiện tại không đúng' 
            });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ 
            message: 'Đổi mật khẩu thành công' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi đổi mật khẩu', 
            error: error.message 
        });
    }
};

// Get staff settings
export const getStaffSettings = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('staffSettings');

        res.json({
            settings: user.staffSettings || {
                emailNotifications: true,
                bookingAlerts: true,
                dashboardLayout: 'default',
                itemsPerPage: 10
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy cài đặt', 
            error: error.message 
        });
    }
};

// Update staff settings
export const updateStaffSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const settings = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { staffSettings: settings },
            { new: true }
        ).select('staffSettings');

        res.json({
            message: 'Cập nhật cài đặt thành công',
            settings: user.staffSettings
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật cài đặt', 
            error: error.message 
        });
    }
};

// Get staff dashboard preferences
export const getDashboardPreferences = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('dashboardPreferences');

        res.json({
            preferences: user.dashboardPreferences || {
                showRevenueChart: true,
                showBookingChart: true,
                showCustomerStats: true,
                defaultDateRange: '7d'
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy preferences', 
            error: error.message 
        });
    }
};

// Update staff dashboard preferences
export const updateDashboardPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { dashboardPreferences: preferences },
            { new: true }
        ).select('dashboardPreferences');

        res.json({
            message: 'Cập nhật preferences thành công',
            preferences: user.dashboardPreferences
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật preferences', 
            error: error.message 
        });
    }
};