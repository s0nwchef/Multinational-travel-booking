# Kế Hoạch Phát Triển Dự Án

## Tổng Quan

Dự án **Multinational Travel Booking** là nền tảng đặt tour du lịch và chuyến bay quốc tế với:
- **Frontend**: React 19, Vite 7, React Router DOM 7, Tailwind CSS 4
- **Backend**: Express 5 (Node.js)
- **Database**: MongoDB (Mongoose 9)

---

## Trạng Thái Hiện Tại

### ✅ Hoàn Thành (6 modules)
| Module | Mô tả |
|--------|-------|
| Tours | CRUD đầy đủ (user + staff) |
| User Authentication | Login, logout, lấy thông tin |
| Staff Dashboard | Thống kê, đặt tour gần đây, tour sắp tới |
| Staff Bookings | Quản lý đặt tour (lọc, phân trang, cập nhật trạng thái) |
| Staff Customers | Danh sách khách hàng, tìm kiếm |
| Staff Analytics | Biểu đồ doanh thu, phân bố, xuất dữ liệu |

### ⚠️ Cần Kết Nối Frontend-Backend (9 modules)

| Module | Vấn đề |
|--------|--------|
| **Destinations** | Đang dùng static JSON từ data.js |
| **Flights** | Thiếu flightService.js |
| **Wishlist** | Thiếu wishlistService.js |
| **Coupons** | Thiếu couponService.js |
| **Reviews** | Thiếu reviewService.js |
| **Bookings (User)** | Đang dùng static JSON |
| **Notifications** | Thiếu notificationService.js |
| **Settings** | Thiếu settingsService.js |
| **Refunds** | Thiếu refundService.js |

### ❌ Cần Phát Triển Thêm

- PaymentPage - cần kết nối API
- TransactionPage - cần tạo API + kết nối
- CheckoutPage - cần kết nối API
- Đăng ký user (chưa có API + UI)

---

## Ưu Tiên Phát Triển

### Ưu Tiên Cao
1. **Kết nối API cho Bookings (User)** - Luồng đặt tour chính
2. **Kết nối API cho Checkout** - Hoàn thiện flow đặt tour
3. **Kết nối API cho Payments** - Xử lý thanh toán
4. **Kết nối API cho Wishlist** - Tính năng yêu thích
5. **Kết nối API cho Reviews** - Đánh giá tour

### Ưu Tiên Trung Bình
1. **Kết nối API cho Flights** - Tìm kiếm & đặt vé máy bay
2. **Kết nối API cho Coupons** - Mã giảm giá
3. **Kết nối API cho Destinations** - Điểm đến
4. **Kết nối API cho Notifications** - Thông báo
5. **Kết nối API cho Settings** - Cài đặt tài khoản

### Ưu Tiên Thấp
1. **Kết nối API cho Refunds** - Hoàn tiền
2. **Tạo UI đăng ký user**
3. **TransactionPage** - Lịch sử giao dịch

---

## Cấu Trúc Dự Án

```
src/
├── components/          # Component dùng chung
│   ├── AuthModal.jsx
│   ├── NotificationDrawer.jsx
│   ├── WishlistDrawer.jsx
│   └── ProtectedRoute.jsx
│
├── features/            # Component theo module
│   ├── home/
│   ├── tours/
│   ├── tour-detail/
│   ├── search/
│   ├── dashboard/
│   ├── booking/
│   ├── checkout/
│   ├── help/
│   ├── refund/
│   ├── write-review/
│   └── staff/
│
├── pages/               # Các trang
│   ├── LandingPage.jsx
│   ├── HomePage.jsx
│   ├── ToursPage.jsx
│   ├── TourDetailPage.jsx
│   ├── FlightsPage.jsx
│   ├── FlightSearchPage.jsx
│   ├── SeatSelectionPage.jsx
│   ├── CheckoutPage.jsx
│   ├── DashboardPage.jsx
│   ├── WishlistPage.jsx
│   ├── MyBookingPage.jsx
│   ├── WriteReviewPage.jsx
│   ├── HelpPage.jsx
│   ├── Notifications.jsx
│   ├── CouponsPage.jsx
│   ├── SettingsPage.jsx
│   ├── PaymentPage.jsx
│   ├── TransactionPage.jsx
│   ├── RefundStatusPage.jsx
│   └── staff/
│
└── layouts/
    ├── MainLayout.jsx
    └── StaffLayout.jsx
```

---

## Các Luồng Chính

### 1. Đặt Tour
```
HomePage → ToursPage → TourDetailPage → CheckoutPage → PaymentPage → MyBookingsPage
```

### 2. Đặt Chuyến Bay
```
HomePage → FlightsPage → FlightSearchPage → SeatSelectionPage → CheckoutPage → PaymentPage
```

### 3. Xem Tour Yêu Thích
```
HomePage → DashboardPage → WishlistPage → TourDetailPage → CheckoutPage
```

### 4. Viết Đánh Giá
```
MyBookingsPage → Completed Booking → WriteReviewPage → TourDetailPage
```

---

## API Endpoints Chính

### Tours
- `GET /api/tours` - Danh sách tour
- `GET /api/tours/:id` - Chi tiết tour
- `POST /api/staff/tours` - Tạo tour (staff)
- `PUT /api/staff/tours/:id` - Cập nhật tour (staff)
- `DELETE /api/staff/tours/:id` - Xóa tour (staff)

### Flights
- `GET /api/flights/search` - Tìm kiếm chuyến bay
- `GET /api/flights/:id/seats` - Xem sơ đồ ghế
- `POST /api/flights/:id/seats/reserve` - Đặt ghế

### Bookings
- `GET /api/bookings` - Danh sách booking (user)
- `POST /api/bookings` - Tạo booking mới
- `POST /api/refunds/cancel` - Hủy booking

### Wishlist
- `GET /api/wishlist` - Danh sách yêu thích
- `POST /api/wishlist` - Thêm tour
- `DELETE /api/wishlist/:tourId` - Xóa tour

### Reviews
- `GET /api/reviews/tour/:tourId` - Xem đánh giá tour
- `POST /api/reviews` - Tạo đánh giá

### Users
- `POST /api/users/login` - Đăng nhập
- `POST /api/users/logout` - Đăng xuất
- `GET /api/users/me` - Lấy thông tin user

---

## Bước Tiếp Theo

1. **Tạo các Service layer** cho frontend:
   - `src/services/bookingService.js`
   - `src/services/wishlistService.js`
   - `src/services/reviewService.js`
   - `src/services/flightService.js`
   - `src/services/couponService.js`

2. **Cập nhật các Page** để gọi API thay vì dữ liệu tĩnh

3. **Kiểm tra và test** các luồng hoàn chỉnh