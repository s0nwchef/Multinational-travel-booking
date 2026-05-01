# Cấu Trúc UI & Luồng Di Chuyển (UI Flow)

## 1. Cây Định Tuyến (Route Tree)

```
/
├── LandingPage (Trang đích - Trang chủ không cần đăng nhập)
│
├── MainLayout (Giao diện người dùng - User Layout)
│   ├── /home → HomePage (Trang chủ)
│   ├── /tours → ToursPage (Danh sách tour)
│   ├── /tour/:tourId → TourDetailPage (Chi tiết tour)
│   ├── /flights → FlightsPage (Danh sách chuyến bay)
│   ├── /flights/search → FlightSearchPage (Tìm kiếm chuyến bay)
│   ├── /flights/:flightId/seats → SeatSelectionPage (Chọn ghế)
│   ├── /checkout → CheckoutPage (Thanh toán)
│   ├── /dashboard → DashboardPage (Bảng điều khiển)
│   ├── /wishlist → WishlistPage (Danh sách yêu thích)
│   ├── /my-bookings → MyBookingsPage (Đơn đặt của tôi)
│   ├── /review/:tourId → WriteReviewPage (Viết đánh giá)
│   ├── /help → HelpPage (Trang trợ giúp)
│   ├── /notifications → Notifications (Thông báo)
│   ├── /coupons → CouponsPage (Mã giảm giá)
│   ├── /settings → SettingsPage (Cài đặt)
│   ├── /payment → PaymentPage (Thanh toán)
│   ├── /transactions → TransactionPage (Giao dịch)
│   ├── /destination → Destination (Điểm đến)
│   ├── /region/:regionName → RegionDetail (Chi tiết khu vực)
│   ├── /cancel-booking → CancelBookingModal (Hủy đặt tour)
│   └── /refund-status → RefundStatusPage (Trạng thái hoàn tiền)
│
└── StaffLayout (Giao diện nhân viên - Staff Layout - Protected: tour_operator, admin)
    ├── /staff/dashboard → StaffDashboardPage (Bảng điều khiển nhân viên)
    ├── /staff/tours → TourManagementPage (Quản lý tour)
    ├── /staff/tours/new → TourEditorPage (Tạo tour mới)
    ├── /staff/tours/:id/edit → TourEditorPage (Chỉnh sửa tour)
    ├── /staff/bookings → BookingManagementPage (Quản lý đặt tour)
    ├── /staff/customers → CustomerManagementPage (Quản lý khách hàng)
    ├── /staff/analytics → AnalyticsPage (Phân tích & Thống kê)
    └── /staff/settings → StaffSettingsPage (Cài đặt nhân viên)
```

## 2. Cây Component UI (UI Component Tree)

```
src/
├── components/ (Các component dùng chung)
│   ├── AuthModal.jsx (Đăng nhập/Đăng ký)
│   ├── NotificationDrawer.jsx (Ngăn kéo thông báo)
│   ├── ProtectedRoute.jsx (Bảo vệ tuyến đường)
│   ├── WishlistDrawer.jsx (Ngăn kéo yêu thích)
│   └── ui/
│       ├── globe.jsx
│       └── landing-page.jsx
│
├── features/ (Các tính năng theo module)
│   ├── home/ (Trang chủ)
│   │   ├── HeroSection.jsx (Phần hero - banner chính)
│   │   ├── FeaturedGrid.jsx (Lưới tour nổi bật)
│   │   ├── FavoriteChoices.jsx (Lựa chọn yêu thích)
│   │   └── WhyChooseUs.jsx (Tại sao chọn chúng tôi)
│   │
│   ├── tours/ (Danh sách tour)
│   │   ├── TourCard.jsx (Thẻ tour)
│   │   ├── TourFilters.jsx (Bộ lọc tour)
│   │   └── TourList.jsx (Danh sách tour)
│   │
│   ├── tour-detail/ (Chi tiết tour)
│   │   ├── TourHeader.jsx (Phần đầu tour)
│   │   ├── TourGallery.jsx (Thư viện ảnh tour)
│   │   ├── TourInfo.jsx (Thông tin tour)
│   │   ├── ReviewsSection.jsx (Phần đánh giá)
│   │   ├── ReviewCard.jsx (Thẻ đánh giá)
│   │   ├── RatingDistribution.jsx (Phân bố đánh giá)
│   │   ├── RecommendedTours.jsx (Tour đề xuất)
│   │   └── TravelerPhotos.jsx (Ảnh khách du lịch)
│   │
│   ├── search/ (Tìm kiếm)
│   │   ├── EmptyState.jsx (Trạng thái trống)
│   │   └── SuggestedTour.jsx (Tour gợi ý)
│   │
│   ├── dashboard/ (Bảng điều khiển)
│   │   ├── RecommendSection.jsx (Phần đề xuất)
│   │   ├── UpcomingTrip.jsx (Chuyến đi sắp tới)
│   │   └── WishlistWidget.jsx (Widget yêu thích)
│   │
│   ├── booking/ (Đặt tour)
│   │   └── BookingCard.jsx (Thẻ đặt tour)
│   │
│   ├── checkout/ (Thanh toán)
│   │   └── (các component thanh toán)
│   │
│   ├── help/ (Trợ giúp)
│   │   ├── HelpHero.jsx (Phần hero trợ giúp)
│   │   ├── HelpCategories.jsx (Danh mục trợ giúp)
│   │   └── PopularFAQs.jsx (Câu hỏi phổ biến)
│   │
│   ├── refund/ (Hoàn tiền)
│   │   ├── RefundHelp.jsx (Trợ giúp hoàn tiền)
│   │   ├── RefundSummary.jsx (Tóm tắt hoàn tiền)
│   │   └── RefundTimeline.jsx (Dòng thời gian hoàn tiền)
│   │
│   ├── write-review/ (Viết đánh giá)
│   │   ├── ExperienceRating.jsx (Đánh giá trải nghiệm)
│   │   └── DetailedRatings.jsx (Đánh giá chi tiết)
│   │
│   └── staff/ (Nhân viên)
│       ├── dashboard/ (Bảng điều khiển staff)
│       │   ├── MetricCard.jsx (Thẻ số liệu)
│       │   ├── QuickStats.jsx (Thống kê nhanh)
│       │   ├── RecentBookingsTable.jsx (Bảng đặt gần đây)
│       │   └── UpcomingToursCalendar.jsx (Lịch tour sắp tới)
│       │
│       ├── tours/ (Quản lý tour)
│       │   ├── TourListTable.jsx (Bảng danh sách tour)
│       │   ├── TourFilters.jsx (Bộ lọc tour)
│       │   └── TourStatusBadge.jsx (Badge trạng thái tour)
│       │
│       ├── bookings/ (Quản lý đặt tour)
│       │   ├── BookingListTable.jsx (Bảng danh sách đặt)
│       │   ├── BookingFilters.jsx (Bộ lọc đặt tour)
│       │   └── BookingStatusBadge.jsx (Badge trạng thái đặt)
│       │
│       ├── customers/ (Quản lý khách hàng)
│       │   ├── CustomerListTable.jsx (Bảng danh sách khách)
│       │   ├── CustomerDetailModal.jsx (Modal chi tiết khách)
│       │   ├── CustomerBadge.jsx (Badge loại khách)
│       │   └── (tests)
│       │
│       └── analytics/ (Phân tích)
│           ├── RevenueChart.jsx (Biểu đồ doanh thu)
│           ├── BookingDistributionChart.jsx (Biểu đồ phân bố đặt)
│           ├── CustomerDemographicsChart.jsx (Biểu đồ nhân khẩu)
│           ├── DateRangeSelector.jsx (Chọn khoảng ngày)
│           ├── ExportButton.jsx (Nút xuất dữ liệu)
│           └── TourPerformanceMetrics.jsx (Số liệu hiệu suất tour)
│
├── pages/ (Các trang)
│   ├── LandingPage.jsx (Trang đích)
│   ├── HomePage.jsx (Trang chủ)
│   ├── ToursPage.jsx (Danh sách tour)
│   ├── TourDetailPage.jsx (Chi tiết tour)
│   ├── FlightsPage.jsx (Danh sách chuyến bay)
│   ├── FlightSearchPage.jsx (Tìm kiếm chuyến bay)
│   ├── SeatSelectionPage.jsx (Chọn ghế)
│   ├── CheckoutPage.jsx (Thanh toán)
│   ├── DashboardPage.jsx (Bảng điều khiển)
│   ├── WishlistPage.jsx (Danh sách yêu thích)
│   ├── MyBookingPage.jsx (Đơn đặt của tôi)
│   ├── WriteReviewPage.jsx (Viết đánh giá)
│   ├── HelpPage.jsx (Trợ giúp)
│   ├── Notifications.jsx (Thông báo)
│   ├── CouponsPage.jsx (Mã giảm giá)
│   ├── SettingsPage.jsx (Cài đặt)
│   ├── PaymentPage.jsx (Thanh toán)
│   ├── TransactionPage.jsx (Giao dịch)
│   ├── RefundStatusPage.jsx (Trạng thái hoàn tiền)
│   ├── EmptyResultPage.jsx (Kết quả trống)
│   ├── Destination/ (Điểm đến)
│   ├── RegionDetail/ (Chi tiết khu vực)
│   ├── Modal/
│   │   └── CancelBookingModal.jsx (Hủy đặt tour)
│   └── staff/ (Trang nhân viên)
│       ├── StaffDashboardPage.jsx
│       ├── TourManagementPage.jsx
│       ├── BookingManagementPage.jsx
│       ├── CustomerManagementPage.jsx
│       ├── AnalyticsPage.jsx
│       ├── StaffSettingsPage.jsx
│       └── TourEditorPage.jsx
│
└── layouts/ (Bố cục)
    ├── MainLayout.jsx
    │   ├── Header (Đầu trang)
    │   └── Footer (Chân trang)
    └── StaffLayout.jsx
        ├── Sidebar (Thanh bên)
        └── Header (Đầu trang)
```

## 3. Danh Sách API Endpoints (Backend)

### API Tours
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/tours | Danh sách tất cả tour | ❌ |
| GET | /api/tours/:id | Chi tiết tour | ❌ |
| POST | /api/tours | Tạo tour mới | ✅ Staff |
| PUT | /api/tours/:id | Cập nhật tour | ✅ Staff |
| DELETE | /api/tours/:id | Xóa tour | ✅ Staff |

### API Staff Tours
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/staff/tours | Danh sách tour (có filter, phân trang) | ✅ Staff |
| GET | /api/staff/tours/:id | Chi tiết tour | ✅ Staff |
| POST | /api/staff/tours | Tạo tour mới | ✅ Staff |
| PUT | /api/staff/tours/:id | Cập nhật tour | ✅ Staff |
| DELETE | /api/staff/tours/:id | Xóa tour | ✅ Staff |
| PUT | /api/staff/tours/bulk-status | Cập nhật hàng loạt | ✅ Staff |

### API Flights (MỚI)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/flights/search | Tìm kiếm chuyến bay | ❌ |
| GET | /api/flights | Danh sách chuyến bay | ❌ |
| GET | /api/flights/:id | Chi tiết chuyến bay | ❌ |
| GET | /api/flights/:id/seats | Xem sơ đồ ghế | ❌ |
| POST | /api/flights/:id/seats/reserve | Đặt ghế | ✅ |
| POST | /api/flights/:id/seats/release | Giải phóng ghế | ✅ |
| POST | /api/flights | Tạo chuyến bay | ✅ Admin |
| PUT | /api/flights/:id | Cập nhật chuyến bay | ✅ Admin |
| DELETE | /api/flights/:id | Xóa chuyến bay | ✅ Admin |

### API Wishlist (MỚI)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/wishlist | Xem danh sách yêu thích | ✅ |
| POST | /api/wishlist | Thêm tour vào wishlist | ✅ |
| DELETE | /api/wishlist/:tourId | Xóa tour khỏi wishlist | ✅ |
| GET | /api/wishlist/check/:tourId | Kiểm tra tour trong wishlist | ✅ |
| DELETE | /api/wishlist/clear | Xóa toàn bộ wishlist | ✅ |
| GET | /api/wishlist/count | Lấy số lượng wishlist | ✅ |

### API Coupons (MỚI)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/coupons/available | Danh sách coupon khả dụng | ❌ |
| POST | /api/coupons/validate | Validate coupon | ❌ |
| POST | /api/coupons/apply | Áp dụng coupon vào booking | ✅ |
| POST | /api/coupons/remove | Xóa coupon khỏi booking | ✅ |
| GET | /api/coupons/user | Lịch sử coupon của user | ✅ |
| GET | /api/coupons | Danh sách tất cả coupon (admin) | ✅ Admin |
| POST | /api/coupons | Tạo coupon mới (admin) | ✅ Admin |
| PUT | /api/coupons/:id | Cập nhật coupon (admin) | ✅ Admin |
| DELETE | /api/coupons/:id | Xóa coupon (admin) | ✅ Admin |

### API Reviews (MỚI)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/reviews/tour/:tourId | Xem đánh giá của tour | ❌ |
| POST | /api/reviews | Tạo đánh giá mới | ✅ |
| DELETE | /api/reviews/:id | Xóa đánh giá | ✅ |

### API Bookings
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/bookings | Danh sách booking | ✅ |
| GET | /api/bookings/:id | Chi tiết booking | ✅ |
| POST | /api/bookings | Tạo booking mới | ✅ |
| PUT | /api/bookings/:id | Cập nhật booking | ✅ |

### API Staff Bookings
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/staff/bookings | Danh sách booking (có filter) | ✅ Staff |
| PUT | /api/staff/bookings/:id/status | Cập nhật trạng thái | ✅ Staff |

### API Staff Customers
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/staff/customers | Danh sách khách hàng | ✅ Staff |

### API Staff Analytics
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/staff/dashboard/stats | Thống kê dashboard | ✅ Staff |
| GET | /api/staff/analytics/revenue | Biểu đồ doanh thu | ✅ Staff |
| GET | /api/staff/analytics/bookings | Phân bố booking | ✅ Staff |
| GET | /api/staff/analytics/customers | Nhân khẩu học | ✅ Staff |
| GET | /api/staff/analytics/tour-performance | Hiệu suất tour | ✅ Staff |
| GET | /api/staff/analytics/export | Xuất dữ liệu CSV | ✅ Staff |

### API Users
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | /api/users/login | Đăng nhập | ❌ |
| POST | /api/users/logout | Đăng xuất | ✅ |
| GET | /api/users/me | Lấy thông tin user hiện tại | ✅ |

### API Destinations
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| GET | /api/destinations | Danh sách điểm đến | ❌ |
| GET | /api/destinations/:id | Chi tiết điểm đến | ❌ |

---

## 4. Luồng Di Chuyển Chi Tiết Từ Trang Chủ (HomePage)

### Sơ đồ luồng chính:

```
                                    ┌─────────────────────┐
                                    │   LandingPage       │
                                    │  (Trang đích)       │
                                    └──────────┬──────────┘
                                               │
                                    ┌──────────▼──────────┐
                                    │      HomePage       │
                                    │   (Trang chủ)       │
                                    └──────────┬──────────┘
                                               │
           ┌──────────────┬──────────────┬─────┴─────┬──────────────┬──────────────┐
           │              │              │           │              │              │
    ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼────┐ ┌───▼────┐ ┌──────▼──────┐ ┌─────▼─────┐
    │  ToursPage  │ │ Flights   │ │Dashboard │ │ Coupons│ │  Wishlist   │ │  Help     │
    │(Danh sách   │ │  Page     │ │  Page    │ │  Page  │ │   Page      │ │   Page    │
    │   tour)     │ │(Chuyến bay)│ │(Bảng điều│ │(Mã giảm│ │(Yêu thích)  │ │(Trợ giúp) │
    └──────┬──────┘ └─────┬─────┘ └────┬───��┘ │ khiá)  │ └──────┬──────┘ └─────┬─────┘
           │              │            │      │        │        │              │
           │              │            │      │        │        │              │
    ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼────┐ │        │        │              │
    │TourDetail   │ │Flight     │ │MyBookings│ │        │        │              │
    │   Page      │ │SearchPage │ │  Page    │ │        │        │              │
    │(Chi tiết    │ │(Tìm kiếm  │ │(Đơn đặt  │ │        │        │              │
    │   tour)     │ │  bay)     │ │  của tôi)│ │        │        │              │
    └──────┬──────┘ └─────┬─────┘ └────┬────┘ │        │        │              │
           │              │            │      │        │        │              │
           │        ┌─────▼─────┐      │      │        │        │              │
           │        │ Seat      │      │      │        │        │              │
           │        │Selection  │      │      │        │        │              │
           │        │  Page     │      │      │        │        │              │
           │        └─────┬─────┘      │      │        │        │              │
           │              │            │      │        │        │              │
    ┌──────▼──────────────▼────────────▼──────▼────────▼────────▼──────────────▼──────┐
    │                              CheckoutPage (Thanh toán)                          │
    └──────────────────────────────────────┬───────────────────────────────────────────┘
                                           │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
             ┌──────▼──────┐        ┌───────▼───────┐      ┌───────▼───────┐
             │  Payment    │        │  Transaction  │      │   Payment     │
             │   Page      │        │    Page       │      │   Page        │
             │(Thanh toán) │        │ (Giao dịch)   │      │(Thanh toán)   │
             └─────────────┘        └───────────────┘      └───────────────┘
```

### Chi tiết các luồng từ HomePage:

#### 🔵 Luồng 1: Đặt Tour (Book a Tour)
```
HomePage → ToursPage → TourDetailPage → CheckoutPage → PaymentPage → MyBookingsPage
     │          │              │              │              │
     │          │              │              │              └→ TransactionPage
     │          │              │              └→ Payment (thành công)
     │          │              └→ "Đặt ngay" button
     │          └→ Click tour card
     └→ "Khám phá ngay" button
```

#### 🔵 Luồng 2: Đặt Chuyến Bay (Flight Booking)
```
HomePage → FlightsPage → FlightSearchPage → SeatSelectionPage → CheckoutPage → PaymentPage
     │              │                  │                  │              │
     │              │                  │                  │              └→ TransactionPage
     │              │                  │                  └→ "Tiếp tục" button
     │              │                  └→ Select flight
     │              └→ "Tìm chuyến bay" button
     └→ "Đặt vé máy bay" button
```

#### 🔵 Luồng 3: Xem Tour Yêu Thích (Wishlist)
```
HomePage → DashboardPage → WishlistPage → TourDetailPage → CheckoutPage
     │          │              │
     │          │              └→ Remove from wishlist (DELETE /api/wishlist/:tourId)
     │          └→ "Danh sách yêu thích" button
     └→ Header → Wishlist icon
```

#### 🔵 Luồng 4: Xem Đơn Đặt (View Bookings)
```
HomePage → DashboardPage → MyBookingsPage → TourDetailPage (xem lại)
     │          │              │
     │          │              ├→ CancelBookingModal → RefundStatusPage
     │          │              └→ WriteReviewPage (nếu đã hoàn thành)
     │          └→ "Đơn đặt của tôi" button
     └→ Header → My Bookings
```

#### 🔵 Luồng 5: Viết Đánh Giá (Write Review)
```
MyBookingsPage → Completed Booking → WriteReviewPage → TourDetailPage (xem đánh giá)
     │                              │
     │                              └→ Submit → POST /api/reviews
     └→ "Viết đánh giá" button
```

#### 🔵 Luồng 6: Xem Mã Giảm Giá (View Coupons)
```
HomePage → CouponsPage → Apply to Checkout
     │          │                    │
     │          └→ Copy coupon code  └→ POST /api/coupons/validate
     └→ Header → Coupons icon
```

#### 🔵 Luồng 7: Xem Thông Báo (Notifications)
```
HomePage → Notifications → Click notification → Related Page
     │          │
     │          └→ Mark as read
     └→ Header → Bell icon → NotificationDrawer
```

#### 🔵 Luồng 8: Cài Đặt Tài Khoản (Settings)
```
HomePage → SettingsPage
     │          │
     │          ├→ Profile settings
     │          ├→ Password change
     │          └→ Notification preferences
     └→ Header → Settings icon
```

#### 🔵 Luồng 9: Trợ Giúp (Help)
```
HomePage → HelpPage
     │          │
     │          ├→ HelpCategories
     │          └→ PopularFAQs
     └→ Footer → Help link
```

#### 🔵 Luồng 10: Đăng Nhập/Đăng Ký (Authentication)
```
HomePage/LandingPage → AuthModal (Login/Register) → Dashboard
     │                        │
     │                        ├→ Login → POST /api/users/login
     │                        └→ Register → (chưa implement)
     └→ Header → Login/Register button
```

#### 🔵 Luồng 11: Xem Điểm Đến (Destinations)
```
HomePage → RegionDetail → Destination → ToursPage (filtered)
     │          │            │
     │          │            └→ Click destination
     │          └→ Click region card
     └→ "Khám phá điểm đến" section
```

---

## 5. Các Liên Kết Bị Thiếu (Missing Links)

### ⚠️ Các trang chưa được kết nối với flow:

| Trang | Đường dẫn | Vấn đề | Ưu tiên |
|-------|-----------|--------|---------|
| CancelBookingModal | /cancel-booking | Modal, cần API hủy booking | Cao |
| RefundStatusPage | /refund-status | Chưa có API hoàn tiền | Cao |
| Staff routes | /staff/* | Cần đăng nhập staff | Trung bình |

### ⚠️ Các chức năng chưa có trong flow:

| Chức năng | Mô tả | Ưu tiên |
|-----------|-------|---------|
| Payment integration | Chưa rõ flow thanh toán | Cao |
| Notification click | Chưa xử lý click vào notification | Trung bình |
| Checkout flow | Chưa kết nối API | Cao |

### ⚠️ Các button/link chưa được implement:

1. **Header Navigation:**
   - Logo click → LandingPage (✅)
   - Tours link → ToursPage (✅)
   - Flights link → FlightsPage (✅)
   - Help link → HelpPage (✅)
   - Wishlist icon → WishlistPage (❓)
   - Notification bell → Notifications (❓)
   - User avatar → Dashboard/Settings (❓)

2. **Footer Navigation:**
   - About us link (❓)
   - Contact link (❓)
   - Terms & Conditions (❓)
   - Privacy Policy (❓)

3. **Dashboard Page:**
   - Quick booking links (❓)
   - Recent activity (❓)

---

## 6. Tổng Kết (Summary)

### ✅ Đã hoàn thành:
- Route definitions trong AppRoutes.jsx
- Component structure trong features/
- Tours CRUD (user + staff)
- Flights API (search, seat selection, reserve)
- Wishlist API (add, remove, check)
- Coupons API (validate, apply)
- Reviews API (create, read)
- User authentication (login, logout)
- Staff dashboard, bookings, customers, analytics
- Destinations

### ❌ Cần bổ sung:
- Flow từ Header/Footer chưa rõ ràng
- Modal flows (Cancel, Refund)
- Notification click handling
- Payment integration
- Checkout flow
- User registration