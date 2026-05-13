import React, { useState } from 'react';
import lock from "../img/lock.png"
import { FiLock } from 'react-icons/fi';
import SettingSection from '../components/SettingSection';
import ToggleSwitch from '../components/ToggleSwitch';
import { useCurrentUserProfile } from '../../../hooks/useCurrentUserProfile.js';
import authService from '../../../services/authService.js';
import { useNotification } from '../../../contexts/NotificationContext.jsx';

const SecuritySection = () => {
  const { user } = useCurrentUserProfile();
  const { success, error } = useNotification();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Calculate when password was last changed
  const lastUpdated = user?.ngay_cap_nhat || user?.updatedAt;
  const lastChangedText = lastUpdated 
    ? `${Math.floor((new Date() - new Date(lastUpdated)) / (1000 * 60 * 60 * 24 * 30))} months ago`
    : 'Not available';

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChangePassword = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      setLoading(true);
      const session = authService.getSession();
      if (!session?.sessionId) {
        error('Vui lòng đăng nhập để đổi mật khẩu');
        return;
      }

      const response = await fetch('http://localhost:3000/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.sessionId
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại');
      }

      success('Đổi mật khẩu thành công!');
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Change password error:', err);
      error(err.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SettingSection title="Security" icon={lock}>
        <hr/>
        <div className="mb-4 flex justify-between my-4">
          <div>
            <p className="font-medium text-black font-bold">Password</p>
            <p className="text-[#64748B]">Last changed {lastChangedText}</p>
          </div>
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="text-orange-500 hover:underline"
          >
            Change Password
          </button>
        </div>
        <hr/>


      </SettingSection>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Change Password</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter current password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter new password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Đang xử lý...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SecuritySection;
