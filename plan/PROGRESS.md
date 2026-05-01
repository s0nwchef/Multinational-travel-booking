# 📋 Tiến Độ Phát Triển

## Ngày cập nhật: 2026-05-01

---

## ✅ Đã Hoàn Thành

### 1. Chức Năng Đăng Ký (Register)

**Files:**
- `server/controllers/userController.js` - Thêm hàm `registerUser`
- `server/routes/userRoutes.js` - Thêm route `POST /api/users/register`

**Tính năng:**
- Validate email/password
- Check email đã tồn tại
- Hash password với bcryptjs
- Tự động tạo session sau đăng ký

---

### 2. Chức Năng Notification (Backend)

**Files mới:**
- `server/models/Notification.js` - Thêm `link`, `readAt`
- `server/utils/notificationHelper.js` - Helper gửi notification

**Files đã tích hợp:**
- `server/routes/bookingRoutes.js` - Gửi notification khi tạo booking
- `server/controllers/refundController.js` - Gửi notification khi:
  - Yêu cầu hoàn tiền
  - Hoàn tiền thành công / bị từ chối
  - Hủy booking

**Tự động gửi notification:**
| Sự kiện | Thông báo |
|---------|-----------|
| Đặt tour | "Đặt tour thành công" |
| Yêu cầu hoàn tiền | "Yêu cầu hoàn tiền đã được gửi" |
| Admin duyệt hoàn tiền | "Hoàn tiền thành công" |
| Admin từ chối hoàn tiền | "Yêu cầu hoàn tiền bị từ chối" |
| Hủy booking | "Đặt tour đã bị hủy" |

---

## 📁 Cấu Trúc Plan

```
plan/
├── PROGRESS.md          # File này - tiến độ phát triển
├── plan.md              # Tổng quan dự án
├── plan_register.md     # Kế hoạch đăng ký
├── plan_notification.md # Kế hoạch notification
├── feature.md           # Phân tích chức năng
└── flow.md              # Luồng UI & API
```

---

## 🔜 Cần Làm Tiếp

1. **Frontend - AuthModal** - Thêm form đăng ký + gọi API
2. **Frontend - Notification** - Kết nối UI với API notification
3. **Tích hợp thêm** - Payment, Reviews, Coupons gửi notification