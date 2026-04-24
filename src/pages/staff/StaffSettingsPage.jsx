import React from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe,
  CreditCard,
  Download,
  Save
} from 'lucide-react';

const StaffSettingsPage = () => {
  const settingsSections = [
    {
      title: "Thông tin cá nhân",
      icon: User,
      description: "Quản lý thông tin cá nhân và liên hệ",
      fields: [
        { label: "Họ và tên", value: "Nguyễn Văn A", editable: true },
        { label: "Email", value: "operator@travel.com", editable: true },
        { label: "Số điện thoại", value: "+84 123 456 789", editable: true },
        { label: "Vai trò", value: "Tour Operator", editable: false },
        { label: "Ngày tham gia", value: "15/01/2024", editable: false }
      ]
    },
    {
      title: "Thông báo",
      icon: Bell,
      description: "Cài đặt thông báo và email",
      fields: [
        { label: "Thông báo booking mới", value: "Bật", editable: true, type: "toggle" },
        { label: "Thông báo hủy tour", value: "Bật", editable: true, type: "toggle" },
        { label: "Báo cáo hàng tuần", value: "Tắt", editable: true, type: "toggle" },
        { label: "Cảnh báo quan trọng", value: "Bật", editable: true, type: "toggle" }
      ]
    },
    {
      title: "Bảo mật",
      icon: Shield,
      description: "Quản lý mật khẩu và bảo mật tài khoản",
      fields: [
        { label: "Đổi mật khẩu", value: "********", editable: true, type: "password" },
        { label: "Xác thực 2 yếu tố", value: "Tắt", editable: true, type: "toggle" },
        { label: "Lịch sử đăng nhập", value: "Xem lịch sử", editable: true, type: "link" }
      ]
    },
    {
      title: "Ngôn ngữ & Vùng",
      icon: Globe,
      description: "Cài đặt ngôn ngữ và múi giờ",
      fields: [
        { label: "Ngôn ngữ", value: "Tiếng Việt", editable: true, type: "select" },
        { label: "Múi giờ", value: "GMT+7", editable: true, type: "select" },
        { label: "Định dạng ngày", value: "DD/MM/YYYY", editable: true, type: "select" }
      ]
    }
  ];

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

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-gray-500">{section.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {section.fields.map((field, fieldIndex) => (
                  <div key={fieldIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{field.label}</p>
                      <p className="text-gray-500 text-sm mt-1">{field.value}</p>
                    </div>
                    {field.editable && (
                      <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
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
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Cấu hình
              </button>
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