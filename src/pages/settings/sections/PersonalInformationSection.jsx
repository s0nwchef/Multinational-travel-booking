import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';
import SettingSection from '../components/SettingSection';
import ProfilePhotoUpload from '../components/ProfilePhotoUpload';
import InputField from '../components/InputField';
import profile from "../img/profile.png"
import { useCurrentUserProfile } from '../../../hooks/useCurrentUserProfile.js';
import authService from '../../../services/authService.js';
import { useNotification } from '../../../contexts/NotificationContext.jsx';

const PersonalInformationSection = () => {
  const { user, loading: userLoading } = useCurrentUserProfile();
  const { success, error } = useNotification();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);

  // Load user data when user is available
  useEffect(() => {
    if (user) {
      const fullName = user.ho_ten || user.fullName || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : fullName;
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

      setFormData({
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        phoneNumber: user.so_dien_thoai || user.phoneNumber || ''
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setLoading(true);
      const session = authService.getSession();
      if (!session?.sessionId) {
        error('Vui lòng đăng nhập để cập nhật thông tin');
        return;
      }

      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': session.sessionId
        },
        body: JSON.stringify({
          ho_ten: fullName,
          so_dien_thoai: formData.phoneNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thất bại');
      }

      // Update local storage
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('currentUser', JSON.stringify({
        id: updatedUser.id || updatedUser._id,
        name: updatedUser.ho_ten || updatedUser.fullName,
        email: updatedUser.email,
        avatar: updatedUser.anh_dai_dien || updatedUser.avatarUrl || '',
        role: updatedUser.vai_tro || updatedUser.role,
        membership: 'Member',
        diem: updatedUser.diem ?? 1
      }));

      window.dispatchEvent(new Event('auth-change'));
      success('Cập nhật thông tin thành công!');
    } catch (err) {
      console.error('Save changes error:', err);
      error(err.message || 'Có lỗi xảy ra khi cập nhật');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingSection title="Personal Information" icon={profile}>
      <ProfilePhotoUpload />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField 
          label="First Name" 
          placeholder="John" 
          icon={FiUser} 
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
        />
        <InputField 
          label="Last Name" 
          placeholder="Doe" 
          icon={FiUser} 
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
        />
        <InputField 
          label="Email Address" 
          placeholder="john@example.com" 
          icon={FiMail} 
          type="email"
          value={formData.email}
          disabled={true}
        />
        <InputField 
          label="Phone Number" 
          placeholder="+1 234 567 890" 
          icon={FiPhone} 
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
        />
      </div>
      <button 
        onClick={handleSaveChanges}
        disabled={loading}
        className="bg-orange-500 text-white rounded-full px-4 py-2 mt-4 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Đang lưu...' : 'Save Changes'}
      </button>
    </SettingSection>
  );
};

export default PersonalInformationSection;
