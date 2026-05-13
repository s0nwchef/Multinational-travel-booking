import React, { useState, useRef } from 'react';
import { useCurrentUserProfile } from '../../../hooks/useCurrentUserProfile.js';
import authService from '../../../services/authService.js';
import { useNotification } from '../../../contexts/NotificationContext.jsx';

const ProfilePhotoUpload = () => {
  const { user } = useCurrentUserProfile();
  const { success, error } = useNotification();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const displayName = user?.ho_ten || user?.fullName || user?.name || "Traveler";
  const currentAvatar = previewUrl || user?.anh_dai_dien || user?.avatarUrl || user?.avatar;
  const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;
  const avatarUrl = currentAvatar || defaultAvatar;

  const handleUpdateClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Vui lòng chọn file ảnh hợp lệ');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      const session = authService.getSession();
      if (!session?.sessionId) {
        error('Vui lòng đăng nhập để cập nhật ảnh đại diện');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:3000/api/users/avatar', {
        method: 'PUT',
        headers: {
          'Authorization': session.sessionId
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Tải ảnh lên thất bại');
      }

      // Update preview
      setPreviewUrl(data.avatarUrl);

      // Update local storage
      const updatedUser = { ...user, anh_dai_dien: data.avatarUrl, avatarUrl: data.avatarUrl };
      localStorage.setItem('currentUser', JSON.stringify({
        id: updatedUser.id || updatedUser._id,
        name: updatedUser.ho_ten || updatedUser.fullName,
        email: updatedUser.email,
        avatar: data.avatarUrl,
        role: updatedUser.vai_tro || updatedUser.role,
        membership: 'Member',
        diem: updatedUser.diem ?? 1
      }));

      window.dispatchEvent(new Event('auth-change'));
      success('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      console.error('Upload avatar error:', err);
      error(err.message || 'Có lỗi xảy ra khi tải ảnh lên');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    try {
      setRemoving(true);
      const session = authService.getSession();
      if (!session?.sessionId) {
        error('Vui lòng đăng nhập để xóa ảnh đại diện');
        return;
      }

      const response = await fetch('http://localhost:3000/api/users/avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': session.sessionId
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Xóa ảnh thất bại');
      }

      // Reset to default avatar
      setPreviewUrl(null);

      // Update local storage
      const updatedUser = { ...user, anh_dai_dien: '', avatarUrl: '' };
      localStorage.setItem('currentUser', JSON.stringify({
        id: updatedUser.id || updatedUser._id,
        name: updatedUser.ho_ten || updatedUser.fullName,
        email: updatedUser.email,
        avatar: '',
        role: updatedUser.vai_tro || updatedUser.role,
        membership: 'Member',
        diem: updatedUser.diem ?? 1
      }));

      window.dispatchEvent(new Event('auth-change'));
      success('Đã xóa ảnh đại diện');
    } catch (err) {
      console.error('Remove avatar error:', err);
      error(err.message || 'Có lỗi xảy ra khi xóa ảnh');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="flex items-center mb-6">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full overflow-hidden flex items-center justify-center">
        <img
          src={avatarUrl}
          alt={displayName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = defaultAvatar;
          }}
        />
      </div>
      <div className="ml-4">
        <div>
          <h1 className="text-black font-medium">Profile Photo</h1>
          <span className="text-sm text-gray-500">This will be displayed on your profile</span>
        </div>
        <div className="mt-2 flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <button 
            onClick={handleUpdateClick}
            disabled={uploading || removing}
            className="text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Đang tải...' : 'Update'}
          </button>
          <button 
            onClick={handleRemove}
            disabled={uploading || removing || !currentAvatar}
            className="text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {removing ? 'Đang xóa...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;
