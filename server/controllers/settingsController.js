import User from '../models/User.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select('-passwordHash -wishlist');

        if (!user) {
            return res.status(404).json({ 
                message: 'Không tìm thấy người dùng' 
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

// Update user profile
export const updateProfile = async (req, res) => {
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

// Change password
export const changePassword = async (req, res) => {
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

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return res.status(400).json({ 
                message: 'Mật khẩu hiện tại không đúng' 
            });
        }

        // Update password
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

// Get notification preferences
export const getNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('notificationPreferences');

        res.json({
            preferences: user.notificationPreferences || {
                email: true,
                bookingConfirmation: true,
                bookingReminder: true,
                promotions: true,
                newsletter: false
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy cài đặt thông báo', 
            error: error.message 
        });
    }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res) => {
    try {
        const userId = req.user.id;
        const preferences = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { notificationPreferences: preferences },
            { new: true }
        ).select('notificationPreferences');

        res.json({
            message: 'Cập nhật cài đặt thông báo thành công',
            preferences: user.notificationPreferences
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật cài đặt', 
            error: error.message 
        });
    }
};

// Get loyalty points & tier
export const getLoyaltyInfo = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .select('loyaltyPoints loyaltyTier');

        // Calculate next tier requirements
        const tierInfo = {
            Bronze: { minPoints: 0, nextTier: 'Silver', nextTierPoints: 1000 },
            Silver: { minPoints: 1000, nextTier: 'Gold', nextTierPoints: 5000 },
            Gold: { minPoints: 5000, nextTier: 'Platinum', nextTierPoints: 10000 },
            Platinum: { minPoints: 10000, nextTier: null, nextTierPoints: null }
        };

        const currentTierInfo = tierInfo[user.loyaltyTier];
        const pointsToNextTier = currentTierInfo.nextTierPoints 
            ? currentTierInfo.nextTierPoints - user.loyaltyPoints 
            : 0;

        res.json({
            points: user.loyaltyPoints,
            tier: user.loyaltyTier,
            pointsToNextTier: Math.max(0, pointsToNextTier),
            nextTier: currentTierInfo.nextTier,
            tierBenefits: {
                Bronze: ['Điểm thưởng cơ bản'],
                Silver: ['Điểm thưởng cơ bản', 'Ưu tiên hỗ trợ'],
                Gold: ['Điểm thưởng cơ bản', 'Ưu tiên hỗ trợ', 'Giảm giá 5%'],
                Platinum: ['Điểm thưởng cơ bản', 'Ưu tiên hỗ trợ', 'Giảm giá 10%', 'Quà tặng đặc biệt']
            }[user.loyaltyTier]
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy thông tin loyalty', 
            error: error.message 
        });
    }
};

// Delete account
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ 
                message: 'Cần xác nhận mật khẩu' 
            });
        }

        const user = await User.findById(userId);

        if (user.passwordHash) {
            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                return res.status(400).json({ 
                    message: 'Mật khẩu không đúng' 
                });
            }
        }

        // Soft delete - just mark as deleted
        user.email = `deleted_${user._id}_${Date.now()}@deleted.com`;
        user.passwordHash = null;
        user.fullName = 'Deleted User';
        await user.save();

        res.json({ 
            message: 'Xóa tài khoản thành công' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa tài khoản', 
            error: error.message 
        });
    }
};