# Phân Tích Chức Năng (Feature Analysis)

## Các Ký Hiệu Trạng Thái
- ✅ **Hoàn thành** = Có cả UI + API + Đã kết nối
- ⚠️ **UI có, API có** = Có cả UI và API nhưng CHƯA kết nối với nhau
- ❌ **Chỉ có UI** = Có UI nhưng chưa có API
- 🔶 **Chỉ có API** = Có API nhưng chưa có UI

---

## TỔNG HỢP BACKEND APIs

### Danh sách đầy đủ các Controller & Routes:

| Module | Controller | Routes File | Số lượng API |
|--------|------------|-------------|--------------|
| Tours | tourController.js | tourRoutes.js | 5 APIs |
| Destinations | destinationController.js | destinationRoutes.js | 3 APIs |
| Bookings | (từ bookingRoutes.js) | bookingRoutes.js | 2 APIs |
| Users | userController.js | userRoutes.js | 5 APIs |
| Staff | staffController.js | staffRoutes.js | 15+ APIs |
| Flights | flightController.js | flightRoutes.js | 9 APIs |
| Wishlist | wishlistController.js | wishlistRoutes.js | 6 APIs |
| Notifications | notificationController.js | notificationRoutes.js | 9 APIs |
| Coupons | couponController.js | couponRoutes.js | 9 APIs |
| Reviews | reviewController.js | reviewRoutes.js | 6 APIs |
| Refunds | refundController.js | refundRoutes.js | 5 APIs |
| Settings | settingsController.js | settingsRoutes.js | 7 APIs |
| Payments | paymentController.js | paymentRoutes.js | 5 APIs |
| Staff Settings | staffSettingsController.js | staffSettingsRoutes.js | 7 APIs |

---

## Phần 1: Các Chức Năng Hoàn Thành (Có Đầy Đủ)

### 1. Quản Lý Tours (Tours Management)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách tour | ✅ ToursPage | ✅ GET /api/tours | ✅ | ✅ Hoàn thành |
| Xem chi tiết tour | ✅ TourDetailPage | ✅ GET /api/tours/:id | ✅ | ✅ Hoàn thành |
| Tạo tour (staff) | ✅ TourEditorPage | ✅ POST /api/staff/tours | ✅ | ✅ Hoàn thành |
| Cập nhật tour (staff) | ✅ TourEditorPage | ✅ PUT /api/staff/tours/:id | ✅ | ✅ Hoàn thành |
| Xóa tour (staff) | ✅ TourManagementPage | ✅ DELETE /api/staff/tours/:id | ✅ | ✅ Hoàn thành |
| Lọc tour (staff) | ✅ TourFilters | ✅ GET /api/staff/tours?status= | ✅ | ✅ Hoàn thành |
| Phân trang tour (staff) | ✅ TourListTable | ✅ GET /api/staff/tours?page= | ✅ | ✅ Hoàn thành |
| Cập nhật hàng loạt | ✅ TourManagementPage | ✅ PUT /api/staff/tours/bulk-status | ✅ | ✅ Hoàn thành |

### 2. Xác Thực Người Dùng (User Authentication)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Đăng nhập | ✅ AuthModal | ✅ POST /api/users/login | ✅ | ✅ Hoàn thành |
| Đăng xuất | ✅ AuthModal | ✅ POST /api/users/logout | ✅ | ✅ Hoàn thành |
| Lấy thông tin user | ✅ ProtectedRoute | ✅ GET /api/users/current | ✅ | ✅ Hoàn thành |
| Đăng ký | ❌ | ❌ | ❌ | ❌ Chưa implement |

### 3. Dashboard Nhân Viên (Staff Dashboard)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Thống kê dashboard | ✅ StaffDashboardPage | ✅ GET /api/staff/dashboard/stats | ✅ | ✅ Hoàn thành |
| Đặt tour gần đây | ✅ RecentBookingsTable | ✅ (từ dashboard) | ✅ | ✅ Hoàn thành |
| Tour sắp tới | ✅ UpcomingToursCalendar | ✅ (từ dashboard) | ✅ | ✅ Hoàn thành |

### 4. Quản Lý Đặt Tour Staff (Staff Bookings)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách đặt | ✅ BookingManagementPage | ✅ GET /api/staff/bookings | ✅ | ✅ Hoàn thành |
| Lọc đặt tour | ✅ BookingFilters | ✅ GET /api/staff/bookings?status= | ✅ | ✅ Hoàn thành |
| Cập nhật trạng thái | ✅ BookingListTable | ✅ PUT /api/staff/bookings/:id/status | ✅ | ✅ Hoàn thành |
| Phân trang | ✅ BookingListTable | ✅ GET /api/staff/bookings?page= | ✅ | ✅ Hoàn thành |

### 5. Quản Lý Khách Hàng Staff (Staff Customers)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách khách | ✅ CustomerManagementPage | ✅ GET /api/staff/customers | ✅ | ✅ Hoàn thành |
| Tìm kiếm khách | ✅ CustomerListTable | ✅ GET /api/staff/customers?search= | ✅ | ✅ Hoàn thành |
| Thống kê khách | ✅ CustomerListTable | ✅ (từ API) | ✅ | ✅ Hoàn thành |

### 6. Phân Tích Staff (Staff Analytics)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Biểu đồ doanh thu | ✅ RevenueChart | ✅ GET /api/staff/analytics/revenue | ✅ | ✅ Hoàn thành |
| Phân bố đặt tour | ✅ BookingDistributionChart | ✅ GET /api/staff/analytics/bookings | ✅ | ✅ Hoàn thành |
| Nhân khẩu học | ✅ CustomerDemographicsChart | ✅ GET /api/staff/analytics/customers | ✅ | ✅ Hoàn thành |
| Hiệu suất tour | ✅ TourPerformanceMetrics | ✅ GET /api/staff/analytics/tour-performance | ✅ | ✅ Hoàn thành |
| Xuất dữ liệu | ✅ ExportButton | ✅ GET /api/staff/analytics/export | ✅ | ✅ Hoàn thành |
| Chọn khoảng ngày | ✅ DateRangeSelector | ✅ Query params | ✅ | ✅ Hoàn thành |

### 7. Điểm Đến (Destinations) ⚠️
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách điểm đến | ✅ Destination | ✅ GET /api/destinations | ❌ | ⚠️ Đang dùng static data từ data.js |
| Xem chi tiết khu vực | ✅ RegionDetail | ✅ GET /api/destinations/:id | ❌ | ⚠️ Đang dùng static data từ data.js |

**Vấn đề:** Destination.jsx và RegionDetail.jsx đang dùng `import { regions, countries } from "../../../data/data.js"` - chưa gọi API

---

## Phần 2: UI Có, API Có, NHƯNG CHƯA KẾT NỐI ⚠️

### 8. Chuyến Bay (Flights)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Trang chuyến bay | ✅ FlightsPage | ✅ GET /api/flights | ❌ | ⚠️ |
| Tìm kiếm chuyến bay | ✅ FlightSearchPage | ✅ GET /api/flights/search | ❌ | ⚠️ |
| Xem chi tiết + chọn ghế | ✅ SeatSelectionPage | ✅ GET /api/flights/:id/seats | ❌ | ⚠️ |
| Đặt ghế | ✅ SeatSelectionPage | ✅ POST /api/flights/:id/seats/reserve | ❌ | ⚠️ |
| Giải phóng ghế | ❌ | ✅ POST /api/flights/:id/seats/release | ❌ | 🔶 |

### 9. Danh Sách Yêu Thích (Wishlist)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách yêu thích | ✅ WishlistPage | ✅ GET /api/wishlist | ❌ | ⚠️ |
| Thêm tour vào yêu thích | ✅ TourDetailPage | ✅ POST /api/wishlist | ❌ | ⚠️ |
| Xóa tour khỏi yêu thích | ✅ WishlistPage | ✅ DELETE /api/wishlist/:tourId | ❌ | ⚠️ |
| Kiểm tra trong wishlist | ✅ TourDetailPage | ✅ GET /api/wishlist/check/:tourId | ❌ | ⚠️ |
| Ngăn kéo wishlist | ✅ WishlistDrawer | ✅ GET /api/wishlist/count | ❌ | ⚠️ |
| Xóa toàn bộ wishlist | ❌ | ✅ DELETE /api/wishlist | ❌ | 🔶 |

### 10. Mã Giảm Giá (Coupons)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách coupon | ✅ CouponsPage | ✅ GET /api/coupons/available | ❌ | ⚠️ |
| Validate coupon | ✅ CheckoutPage | ✅ POST /api/coupons/validate | ❌ | ⚠️ |
| Áp dụng coupon | ✅ CheckoutPage | ✅ POST /api/coupons/apply | ❌ | ⚠️ |
| Xóa coupon | ❌ | ✅ DELETE /api/coupons/remove | ❌ | 🔶 |
| Lịch sử coupon | ❌ | ✅ GET /api/coupons/my-coupons | ❌ | 🔶 |
| Tạo coupon (admin) | ❌ | ✅ POST /api/coupons | ❌ | 🔶 |

### 11. Đánh Giá (Reviews)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Viết đánh giá | ✅ WriteReviewPage | ✅ POST /api/reviews | ❌ | ⚠️ |
| Xem đánh giá tour | ✅ TourDetailPage (ReviewsSection) | ✅ GET /api/reviews/tour/:tourId | ❌ | ⚠️ |
| Xem đánh giá của tôi | ❌ | ✅ GET /api/reviews/my-reviews | ❌ | 🔶 |
| Cập nhật đánh giá | ❌ | ✅ PUT /api/reviews/:id | ❌ | 🔶 |
| Xóa đánh giá | ❌ | ✅ DELETE /api/reviews/:id | ❌ | 🔶 |

### 12. Đặt Tour (Bookings) - User ⚠️
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Xem danh sách đặt | ✅ MyBookingsPage | ✅ GET /api/bookings | ❌ | ⚠️ |
| Tạo đặt tour | ✅ CheckoutPage | ✅ POST /api/bookings | ❌ | ⚠️ |
| Xem chi tiết đặt | ✅ MyBookingPage | ✅ (từ GET /api/bookings) | ❌ | ⚠️ |
| Hủy đặt tour | ✅ CancelBookingModal | ✅ POST /api/refunds/cancel | ❌ | ⚠️ |

---

## Phần 3: Chỉ Có UI, Chưa Có API ❌

### 13. Thông Báo (Notifications)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Trang thông báo | ✅ Notifications | ✅ GET /api/notifications | ❌ | ⚠️ |
| Ngăn kéo thông báo | ✅ NotificationDrawer | ✅ GET /api/notifications | ❌ | ⚠️ |
| Đếm chưa đọc | ❌ | ✅ GET /api/notifications/unread-count | ❌ | 🔶 |
| Đánh dấu đã đọc | ❌ | ✅ PUT /api/notifications/:id/read | ❌ | 🔶 |
| Xóa thông báo | ❌ | ✅ DELETE /api/notifications/:id | ❌ | 🔶 |

### 14. Cài Đặt (Settings)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Trang cài đặt user | ✅ SettingsPage | ✅ GET /api/settings/profile | ❌ | ⚠️ |
| Cập nhật profile | ❌ | ✅ PUT /api/settings/profile | ❌ | 🔶 |
| Đổi mật khẩu | ❌ | ✅ PUT /api/settings/password | ❌ | 🔶 |
| Cài đặt thông báo | ❌ | ✅ PUT /api/settings/notifications | ❌ | 🔶 |
| Thông tin loyalty | ❌ | ✅ GET /api/settings/loyalty | ❌ | 🔶 |
| Xóa tài khoản | ❌ | ✅ DELETE /api/settings/account | ❌ | 🔶 |
| Cài đặt staff | ✅ StaffSettingsPage | ✅ GET /api/staff/settings | ❌ | ⚠️ |

### 15. Thanh Toán & Giao Dịch
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Trang thanh toán | ✅ PaymentPage | ✅ POST /api/payments/process | ❌ | ⚠️ |
| Phương thức thanh toán | ❌ | ✅ GET /api/payments/methods | ❌ | 🔶 |
| Lịch sử thanh toán | ❌ | ✅ GET /api/payments/history | ❌ | 🔶 |
| Chi tiết thanh toán | ❌ | ✅ GET /api/payments/:bookingId | ❌ | 🔶 |
| Xác minh thanh toán | ❌ | ✅ POST /api/payments/verify | ❌ | 🔶 |
| Trang giao dịch | ✅ TransactionPage | ❌ | ❌ | ❌ |
| Checkout | ✅ CheckoutPage | ❌ | ❌ | ❌ |

### 16. Hoàn Tiền (Refunds)
| Chức năng | Frontend UI | Backend API | Kết Nối | Trạng thái |
|-----------|-------------|-------------|---------|------------|
| Trạng thái hoàn tiền | ✅ RefundStatusPage | ✅ GET /api/refunds/status/:bookingId | ❌ | ⚠️ |
| Yêu cầu hoàn tiền | ❌ | ✅ POST /api/refunds/request | ❌ | 🔶 |
| Hủy đặt tour | ✅ CancelBookingModal | ✅ POST /api/refunds/cancel | ❌ | ⚠️ |
| Danh sách hoàn tiền (admin) | ❌ | ✅ GET /api/refunds/all | ❌ | 🔶 |
| Xử lý hoàn tiền (admin) | ❌ | ✅ PUT /api/refunds/process/:bookingId | ❌ | 🔶 |

---

## Tổng Kết

### ✅ Hoàn thành (6 modules):
- Tours (user + staff) - Đầy đủ
- User Authentication - Đầy đủ
- Staff Dashboard - Đầy đủ
- Staff Bookings - Đầy đủ
- Staff Customers - Đầy đủ
- Staff Analytics - Đầy đủ

### ⚠️ Cần kết nối Frontend với Backend (9 modules):
| Module | Frontend | Backend | Vấn đề |
|--------|----------|---------|--------|
| **Destinations** | ✅ Có | ✅ Có | Đang dùng static JSON từ data.js |
| **Flights** | ✅ Có | ✅ Có | Thiếu flightService.js |
| **Wishlist** | ✅ Có | ✅ Có | Thiếu wishlistService.js |
| **Coupons** | ✅ Có | ✅ Có | Thiếu couponService.js |
| **Reviews** | ✅ Có | ✅ Có | Thiếu reviewService.js |
| **Bookings (User)** | ✅ Có | ✅ Có | Đang dùng static JSON |
| **Notifications** | ✅ Có | ✅ Có | Thiếu notificationService.js |
| **Settings** | ✅ Có | ✅ Có | Thiếu settingsService.js |
| **Refunds** | ✅ Có | ✅ Có | Thiếu refundService.js |

### ❌ Cần tạo thêm UI:
- PaymentPage - cần kết nối với API
- TransactionPage - cần tạo API + kết nối
- CheckoutPage - cần kết nối với API
- Chi tiết khách hàng (staff)
- Lịch sử coupon
- Quản lý đánh giá (admin)