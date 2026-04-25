import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe,
  CreditCard,
  Download,
  Save,
  X,
  Check
} from 'lucide-react';
import authService from '../../services/authService.js';

const StaffSettingsPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Toggle states
  const [toggles, setToggles] = useState({
    newBookingNotification: true,
    cancellationNotification: true,
    weeklyReport: false,
    importantAlerts: true,
    twoFactorAuth: false,
    autoBackup: true
  });

  // Edit modal state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    setLoading(false);
  }, []);

  const handleToggleChange = (key) => {
    setToggles(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    console.log(`Toggle ${key} changed to:`, !toggles[key]);
  };

  const handleEditClick = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    setEditValue(currentValue || '');
  };

  const handleSaveEdit = () => {
    console.log(`Saving ${editingField}:`, editValue);
    // Here you would call API to update the field
    setEditingField(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Toggle component
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-orange-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
          <p className="text-gray-500 mt-2">Quản lý cài đặt tài khoản và hệ thống</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Download className="w-4 h-4" />
            Xuất cài đặt
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 text-white hover:bg-orange-600 rounded-xl font-medium transition-colors">
            <Save className="w-4 h-4" />
            Lưu thay đổi
          </button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <User className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
            <p className="text-gray-500">Quản lý thông tin cá nhân và liên hệ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Họ và tên</p>
              <p className="text-gray-500 text-sm mt-1">
                {editingField === 'fullName' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  currentUser?.fullName || currentUser?.name || 'Nguyễn Văn A'
                )}
              </p>
            </div>
            {editingField === 'fullName' ? (
              <div className="flex gap-2">
                <button onClick={handleCancelEdit} className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEditClick('fullName', currentUser?.fullName || currentUser?.name)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-500 text-sm mt-1">
                {editingField === 'email' ? (
                  <input
                    type="email"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  currentUser?.email || 'operator@travel.com'
                )}
              </p>
            </div>
            {editingField === 'email' ? (
              <div className="flex gap-2">
                <button onClick={handleCancelEdit} className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEditClick('email', currentUser?.email)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Số điện thoại</p>
              <p className="text-gray-500 text-sm mt-1">
                {editingField === 'phone' ? (
                  <input
                    type="tel"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                    autoFocus
                  />
                ) : (
                  currentUser?.phoneNumber || '+84 123 456 789'
                )}
              </p>
            </div>
            {editingField === 'phone' ? (
              <div className="flex gap-2">
                <button onClick={handleCancelEdit} className="p-2 text-gray-500 hover:bg-gray-100 rounded">
                  <X className="w-4 h-4" />
                </button>
                <button onClick={handleSaveEdit} className="p-2 text-green-600 hover:bg-green-50 rounded">
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEditClick('phone', currentUser?.phoneNumber)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {/* Role */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Vai trò</p>
              <p className="text-gray-500 text-sm mt-1 capitalize">{currentUser?.role || 'Tour Operator'}</p>
            </div>
            <span className="text-gray-400 text-sm">Không thể chỉnh sửa</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Bell className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Thông báo</h3>
            <p className="text-gray-500">Cài đặt thông báo và email</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Thông báo booking mới</p>
              <p className="text-gray-500 text-sm mt-1">Nhận thông báo khi có booking mới</p>
            </div>
            <ToggleSwitch 
              checked={toggles.newBookingNotification} 
              onChange={() => handleToggleChange('newBookingNotification')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Thông báo hủy tour</p>
              <p className="text-gray-500 text-sm mt-1">Nhận thông báo khi tour bị hủy</p>
            </div>
            <ToggleSwitch 
              checked={toggles.cancellationNotification} 
              onChange={() => handleToggleChange('cancellationNotification')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Báo cáo hàng tuần</p>
              <p className="text-gray-500 text-sm mt-1">Nhận báo cáo tổng hợp hàng tuần qua email</p>
            </div>
            <ToggleSwitch 
              checked={toggles.weeklyReport} 
              onChange={() => handleToggleChange('weeklyReport')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Cảnh báo quan trọng</p>
              <p className="text-gray-500 text-sm mt-1">Nhận các cảnh báo quan trọng về hệ thống</p>
            </div>
            <ToggleSwitch 
              checked={toggles.importantAlerts} 
              onChange={() => handleToggleChange('importantAlerts')}
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bảo mật</h3>
            <p className="text-gray-500">Quản lý mật khẩu và bảo mật tài khoản</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Đổi mật khẩu</p>
              <p className="text-gray-500 text-sm mt-1">••••••••••••••••</p>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Thay đổi
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Xác thực 2 yếu tố</p>
              <p className="text-gray-500 text-sm mt-1">Bảo vệ tài khoản với 2FA</p>
            </div>
            <ToggleSwitch 
              checked={toggles.twoFactorAuth} 
              onChange={() => handleToggleChange('twoFactorAuth')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Lịch sử đăng nhập</p>
              <p className="text-gray-500 text-sm mt-1">Xem lịch sử đăng nhập của bạn</p>
            </div>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
              Xem lịch sử
            </button>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
            <Globe className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ngôn ngữ & Vùng</h3>
            <p className="text-gray-500">Cài đặt ngôn ngữ và múi giờ</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-medium text-gray-900 mb-2">Ngôn ngữ</p>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none">
              <option>Tiếng Việt</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">Múi giờ</p>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none">
              <option>GMT+7 (Việt Nam)</option>
              <option>GMT+8 (Singapore)</option>
              <option>GMT+9 (Nhật Bản)</option>
            </select>
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-2">Định dạng ngày</p>
            <select className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none">
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt hệ thống</h3>
            <p className="text-gray-500">Cấu hình hệ thống và tích hợp</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">API Key</p>
                <p className="text-gray-500 text-sm mt-1">••••••••••••••••</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Tạo mới
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Webhook URL</p>
                <p className="text-gray-500 text-sm mt-1">https://api.travel.com/webhook</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Cập nhật
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Backup tự động</p>
                <p className="text-gray-500 text-sm mt-1">Hàng ngày lúc 02:00</p>
              </div>
              <ToggleSwitch 
                checked={toggles.autoBackup} 
                onChange={() => handleToggleChange('autoBackup')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Giới hạn API</p>
                <p className="text-gray-500 text-sm mt-1">1000 requests/giờ</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Điều chỉnh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-900">Khu vực nguy hiểm</h3>
            <p className="text-red-700">Các hành động này không thể hoàn tác</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-100 rounded-xl font-medium transition-colors">
              Xóa dữ liệu demo
            </button>
            <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-xl font-medium transition-colors">
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffSettingsPage;