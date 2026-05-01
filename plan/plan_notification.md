# Kế Hoạch Backend: Chức Năng Notification

## Tổng Quan

Tạo API quản lý thông báo cho hệ thống Multinational Travel Booking.

---

## Phân Tích Hiện Trạng

### ✅ Backend Đã Hoàn Thành

**Model (Notification.js)**
```javascript
{
  userId: ObjectId, ref: 'User', required
  title: String, required
  message: String, required
  type: String, enum: ['booking', 'promotion', 'system', 'refund'], required
  isRead: Boolean, default: false
}
```

**Controller (notificationController.js) - Đã có đầy đủ:**
| Hàm | Mô tả |
|-----|-------|
| `getNotifications` | Lấy danh sách thông báo (có phân trang, lọc) |
| `getUnreadCount` | Lấy số thông báo chưa đọc |
| `markAsRead` | Đánh dấu 1 thông báo đã đọc |
| `markAllAsRead` | Đánh dấu tất cả đã đọc |
| `deleteNotification` | Xóa 1 thông báo |
| `clearReadNotifications` | Xóa tất cả thông báo đã đọc |
| `createNotification` | Tạo thông báo mới (admin) |
| `getNotificationSettings` | Lấy cài đặt thông báo |
| `updateNotificationSettings` | Cập nhật cài đặt thông báo |

**Routes (notificationRoutes.js) - Đã có đầy đủ:**
```
GET    /api/notifications           - Lấy danh sách
GET    /api/notifications/unread-count - Số chưa đọc
GET    /api/notifications/settings  - Cài đặt
PUT    /api/notifications/:id/read  - Đánh dấu đã đọc
PUT    /api/notifications/read-all  - Đánh dấu tất cả
PUT    /api/notifications/settings  - Cập nhật cài đặt
DELETE /api/notifications/:id       - Xóa thông báo
DELETE /api/notifications/clear-read - Xóa đã đọc
POST   /api/notifications           - Tạo thông báo (admin)
```

---

## Cần Bổ Sung

### 1. Model - Thêm trường

```javascript
// Thêm vào notificationSchema
link: { type: String, default: null },      // Link điều hướng
readAt: { type: Date, default: null },      // Thời điểm đọc
```

### 2. Controller - Tạo helper gửi thông báo tự động

Tạo hàm helper để các module khác gọi khi cần:

```javascript
// utils/notificationHelper.js
export const sendNotification = async (userId, { title, message, type, link }) => {
    const notification = new Notification({
        userId, title, message, type, link
    });
    await notification.save();
    // Có thể emit socket event ở đây
    return notification;
};
```

### 3. Tích hợp vào các module

| Module | Sự kiện gửi thông báo |
|--------|----------------------|
| Bookings | Tạo booking, hủy booking, cập nhật trạng thái |
| Payments | Thanh toán thành công, thất bại |
| Refunds | Yêu cầu hoàn tiền, hoàn tiền thành công |
| Reviews | Phản hồi đánh giá mới |
| Coupons | Coupon mới, coupon sắp hết hạn |

---

## API Specification

### GET /api/notifications

**Query Params:** `page`, `limit`, `unreadOnly`

**Response:**
```json
{
  "notifications": [...],
  "unreadCount": 5,
  "pagination": { "page": 1, "limit": 20, "total": 100, "pages": 5 }
}
```

### GET /api/notifications/unread-count

**Response:** `{ "count": 5 }`

### PUT /api/notifications/:id/read

**Response:** `{ "message": "Đánh dấu đã đọc thành công", "notification": {...} }`

### PUT /api/notifications/read-all

**Response:** `{ "message": "Đánh dấu tất cả đã đọc thành công" }`

### DELETE /api/notifications/:id

**Response:** `{ "message": "Xóa thông báo thành công" }`

### POST /api/notifications (Admin)

**Request Body:**
```json
{
  "userId": "...",
  "title": "Thông báo mới",
  "message": "Nội dung",
  "type": "booking",
  "link": "/bookings/123"
}
```

---

## Files Cần Sửa Đổi

| File | Thay đổi |
|------|----------|
| `server/models/Notification.js` | Thêm `link`, `readAt` |
| Tạo `server/utils/notificationHelper.js` | Helper gửi thông báo |

---

## Frontend (Liên quan)

Frontend cần cập nhật:
- `NotificationDrawer.jsx` - Gọi API
- `Notifications.jsx` - Gọi API
- Tạo service `notificationService.js`

---

## Kết Luận

**Backend Notification đã hoàn chỉnh.** Chỉ cần bổ sung:
1. Thêm 2 trường vào model (`link`, `readAt`)
2. Tạo helper utility để các module khác dễ gửi thông báo