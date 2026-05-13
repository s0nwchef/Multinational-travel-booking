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
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import authService from '../../services/authService.js';
import staffSettingsService from '../../services/staffSettingsService.js';

const StaffSettingsPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Profile state
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });
  
  // Password state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    newBookingNotification: true,
    cancellationNotification: true,
    weeklyReport: false,
    importantAlerts: true
  });
  
  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    autoBackup: true
  });

  // Edit modal state
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load profile from API
      const profileResponse = await staffSettingsService.getProfile();
      if (profileResponse.user) {
        const user = profileResponse.user;
        setProfile({
          fullName: user.fullName || user.ho_ten || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || user.so_dien_thoai || ''
        });
        setCurrentUser(user);
      }
      
      // Load settings
      const settingsResponse = await staffSettingsService.getSettings();
      if (settingsResponse.settings) {
        setSettings(prev => ({
          ...prev,
          ...settingsResponse.settings
        }));
      }
      
      // Also get local user for role display
      const localUser = authService.getCurrentUser();
      if (localUser && !currentUser) {
        setCurrentUser(localUser);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback to local user
      const localUser = authService.getCurrentUser();
      if (localUser) {
        setCurrentUser(localUser);
        setProfile({
          fullName: localUser.fullName || localUser.name || '',
          email: localUser.email || '',
          phoneNumber: localUser.phoneNumber || ''
        });
      }
      setMessage({ type: 'error', text: 'Không thể tải dữ liệu từ máy chủ' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  // Handle profile field edit
  const handleEditClick = (fieldKey, currentValue) => {
    setEditingField(fieldKey);
    setEditValue(currentValue || '');
  };

  const handleSaveEdit = async () => {
    if (!editValue.trim()) {
      showMessage('error', 'Giá trị không được để trống');
      return;
    }
    
    try {
      setSaving(true);
      
      const updateData = {};
      if (editingField === 'fullName') {
        updateData.fullName = editValue;
      } else if (editingField === 'phoneNumber') {
        updateData.phoneNumber = editValue;
      }
      
      const response = await staffSettingsService.updateProfile(updateData);
      
      if (response.user) {
        setProfile(prev => ({
          ...prev,
          [editingField]: editValue
        }));
        showMessage('success', 'Cập nhật thành công');
      }
      
      setEditingField(null);
      setEditValue('');
    } catch (error) {
      showMessage('error', error.message || 'Không thể cập nhật');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue('');
  };

  // Handle settings toggle
  const handleToggleChange = async (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({
      ...prev,
      [key]: newValue
    }));
    
    try {
      await staffSettingsService.updateSettings({ [key]: newValue });
    } catch (error) {
      // Revert on error
      setSettings(prev => ({
        ...prev,
        [key]: !newValue
      }));
      showMessage('error', 'Không thể lưu cài đặt');
    }
  };

  // Handle security toggle (local only for now)
  const handleSecurityToggle = (key) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      showMessage('error', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'Mật khẩu xác nhận không khớp');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    
    try {
      setSaving(true);
      await staffSettingsService.changePassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      showMessage('success', 'Đổi mật khẩu thành công');
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      showMessage('error', error.message || 'Không thể đổi mật khẩu');
    } finally {
      setSaving(false);
    }
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
  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-orange-500' : 'bg-gray-300'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      {/* Message Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
          'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}
      
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
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    autoFocus
                    disabled={saving}
                  />
                ) : (
                  profile.fullName || 'Chưa cập nhật'
                )}
              </p>
            </div>
            {editingField === 'fullName' ? (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelEdit} 
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                  disabled={saving}
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSaveEdit} 
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  disabled={saving}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEditClick('fullName', profile.fullName)}
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Chỉnh sửa
              </button>
            )}
          </div>

          {/* Email - Read Only */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
            </div>
            <span className="text-gray-400 text-sm">Không thể chỉnh sửa</span>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Số điện thoại</p>
              <p className="text-gray-500 text-sm mt-1">
                {editingField === 'phoneNumber' ? (
                  <input
                    type="tel"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                    autoFocus
                    disabled={saving}
                  />
                ) : (
                  profile.phoneNumber || 'Chưa cập nhật'
                )}
              </p>
            </div>
            {editingField === 'phoneNumber' ? (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelEdit} 
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded"
                  disabled={saving}
                >
                  <X className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleSaveEdit} 
                  className="p-2 text-green-600 hover:bg-green-50 rounded"
                  disabled={saving}
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => handleEditClick('phoneNumber', profile.phoneNumber)}
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
              <p className="text-gray-500 text-sm mt-1 capitalize">
                {currentUser?.role === 'staff' ? 'Nhân viên' : 
                 currentUser?.role === 'admin' ? 'Quản trị viên' : 
                 currentUser?.role || 'Nhân viên'}
              </p>
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
              checked={settings.newBookingNotification} 
              onChange={() => handleToggleChange('newBookingNotification')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Thông báo hủy tour</p>
              <p className="text-gray-500 text-sm mt-1">Nhận thông báo khi tour bị hủy</p>
            </div>
            <ToggleSwitch 
              checked={settings.cancellationNotification} 
              onChange={() => handleToggleChange('cancellationNotification')}
            />
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Báo cáo hàng tuần</p>
              <p className="text-gray-500 text-sm mt-1">Nhận báo cáo tổng hợp hàng tuần qua email</p>
            </div>
            <ToggleSwitch 
              checked={settings.weeklyReport} 
              onChange={() => handleToggleChange('weeklyReport')}
            />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Cảnh báo quan trọng</p>
              <p className="text-gray-500 text-sm mt-1">Nhận các cảnh báo quan trọng về hệ thống</p>
            </div>
            <ToggleSwitch 
              checked={settings.importantAlerts} 
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
              <p className="text-gray-500 text-sm mt-1">Cập nhật mật khẩu tài khoản</p>
            </div>
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              Thay đổi
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">Xác thực 2 yếu tố</p>
              <p className="text-gray-500 text-sm mt-1">Bảo vệ tài khoản với 2FA</p>
            </div>
            <ToggleSwitch 
              checked={securitySettings.twoFactorAuth} 
              onChange={() => handleSecurityToggle('twoFactorAuth')}
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
                checked={securitySettings.autoBackup} 
                onChange={() => handleSecurityToggle('autoBackup')}
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

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Đổi mật khẩu</h3>
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl pr-10"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl pr-10"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl pr-10"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffSettingsPage;
