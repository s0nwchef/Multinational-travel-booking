# Database Models Documentation

Thư mục này chứa các định nghĩa Schema của Mongoose cho cơ sở dữ liệu MongoDB của ứng dụng. Dưới đây là chi tiết về các model, các trường (fields), định dạng dữ liệu và các ràng buộc.

---

## 1. User (`User.js`)
Lưu trữ thông tin người dùng, phân quyền và điểm thưởng.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `email` | String | `required`, `unique` | Địa chỉ email đăng nhập |
| `fullName` | String | | Họ và tên người dùng |
| `passwordHash` | String | | Mật khẩu đã được mã hóa |
| `phoneNumber` | String | | Số điện thoại |
| `avatarUrl` | String | | Link ảnh đại diện |
| `role` | String | `enum: ['user', 'admin', 'tour_operator']`, `default: 'user'` | Vai trò của người dùng |
| `loyaltyPoints` | Number | `default: 0` | Điểm thưởng tích lũy |
| `wishlist` | [ObjectId] | `ref: 'Tour'` | Danh sách các tour yêu thích |
| `timestamps` | Boolean | `true` | Tự động thêm `createdAt`, `updatedAt` |

---

## 2. Destination (`Destination.js`)
Lưu trữ thông tin về các điểm đến (Châu lục, Quốc gia, Thành phố).

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | `required` | Tên điểm đến |
| `type` | String | `enum: ['continent', 'country', 'city']`, `required` | Phân loại điểm đến |
| `description` | String | | Mô tả chi tiết |
| `imageUrl` | String | | Hình ảnh đại diện |
| `popularTours` | [ObjectId] | `ref: 'Tour'` | Danh sách các tour phổ biến tại đây |

---

## 3. Tour (`Tour.js`)
Lưu trữ thông tin chung về một Tour du lịch.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | String | `required` | Tên tour |
| `description` | String | | Mô tả tour |
| `destinationId` | ObjectId | `ref: 'Destination'`, `required` | Tham chiếu đến điểm đến |
| `basePrice` | Number | `required` | Giá cơ bản |
| `duration` | Number | `required` | Thời gian tour (số ngày) |
| `images` | [String] | | Danh sách link hình ảnh |
| `itinerary` | [Object] | `{ day: Number, activity: String }` | Lịch trình chi tiết từng ngày |
| `included` | [String] | | Các dịch vụ bao gồm |
| `excluded` | [String] | | Các dịch vụ không bao gồm |
| `averageRating` | Number | `default: 0` | Điểm đánh giá trung bình |
| `totalReviews` | Number | `default: 0` | Tổng số lượt đánh giá |

---

## 4. TourSchedule (`TourSchedule.js`)
Lưu trữ lịch trình cụ thể của một Tour (ngày đi, ngày về, số chỗ).

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `tourId` | ObjectId | `ref: 'Tour'`, `required` | Tham chiếu đến Tour gốc |
| `departureDate` | Date | `required` | Ngày khởi hành |
| `returnDate` | Date | | Ngày trở về |
| `actualPrice` | Number | `required` | Giá thực tế cho lịch trình này |
| `maxCapacity` | Number | `required` | Số lượng khách tối đa |
| `bookedSeats` | Number | `default: 0` | Số lượng chỗ đã đặt |
| `status` | String | `enum: ['available', 'sold_out', 'cancelled']`, `default: 'available'` | Trạng thái của lịch trình |

---

## 5. Flight (`Flight.js`)
Lưu trữ thông tin các chuyến bay.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `airline` | String | `required` | Hãng hàng không |
| `flightNumber` | String | `required` | Số hiệu chuyến bay |
| `departure` | Object | `{ airportCode: String, time: Date }` | Thông tin khởi hành |
| `arrival` | Object | `{ airportCode: String, time: Date }` | Thông tin hạ cánh |
| `price` | Number | `required` | Giá vé |
| `availableSeats` | Number | `required` | Số ghế trống |
| `seatMap` | [Object] | `{ seatNumber: String, isAvailable: Boolean, class: enum }` | Sơ đồ ghế ngồi |

---

## 6. Booking (`Booking.js`)
Lưu trữ thông tin đặt chỗ (Tour hoặc Flight) của người dùng.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `userId` | ObjectId | `ref: 'User'`, `required` | Người đặt |
| `bookingType` | String | `enum: ['tour', 'flight']`, `required` | Loại đặt chỗ |
| `itemId` | ObjectId | `required` | Tham chiếu tới TourSchedule hoặc Flight |
| `travelers` | [Object] | `{ fullName, age, documentId }` | Thông tin hành khách |
| `totalAmount` | Number | `required` | Tổng tiền |
| `couponApplied` | ObjectId | `ref: 'Coupon'` | Mã giảm giá đã áp dụng |
| `status` | String | `enum: ['pending', 'confirmed', 'cancelled', 'completed']`, `default: 'pending'` | Trạng thái đặt chỗ |
| `paymentStatus` | String | `enum: ['unpaid', 'paid', 'refunded']`, `default: 'unpaid'` | Trạng thái thanh toán |
| `bookingDate` | Date | `default: Date.now` | Ngày đặt |
| `paymentHistory`| [Object] | `{ transactionId, amount, method, status, date }` | Lịch sử thanh toán |
| `refundDetails` | Object | `{ amount, reason, status, requestDate, processedDate }` | Chi tiết hoàn tiền |

---

## 7. Review (`Review.js`)
Lưu trữ đánh giá của người dùng về các Tour.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `userId` | ObjectId | `ref: 'User'`, `required` | Người đánh giá |
| `tourId` | ObjectId | `ref: 'Tour'`, `required` | Tour được đánh giá |
| `rating` | Number | `required`, `min: 1`, `max: 5` | Điểm số (1-5 sao) |
| `content` | String | `required` | Nội dung đánh giá |
| `photos` | [String] | | Hình ảnh đính kèm |
| `timestamps` | Boolean | `true` | Tự động thêm `createdAt`, `updatedAt` |

---

## 8. Coupon (`Coupon.js`)
Lưu trữ các mã giảm giá, khuyến mãi.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `code` | String | `required`, `unique` | Mã giảm giá |
| `discountType` | String | `enum: ['percentage', 'fixed_amount']`, `required` | Loại giảm giá |
| `discountValue` | Number | `required` | Giá trị giảm |
| `minPurchaseAmount`| Number | `default: 0` | Giá trị đơn hàng tối thiểu |
| `validFrom` | Date | `required` | Ngày bắt đầu hiệu lực |
| `validUntil` | Date | `required` | Ngày hết hạn |
| `usageLimit` | Number | `required` | Giới hạn số lượt sử dụng |
| `usedCount` | Number | `default: 0` | Số lượt đã sử dụng |
| `timestamps` | Boolean | `true` | Tự động thêm `createdAt`, `updatedAt` |

---

## 9. Notification (`Notification.js`)
Lưu trữ thông báo gửi đến người dùng.

| Field | Type | Constraints/Default | Description |
| :--- | :--- | :--- | :--- |
| `userId` | ObjectId | `ref: 'User'`, `required` | Người nhận thông báo |
| `title` | String | `required` | Tiêu đề thông báo |
| `message` | String | `required` | Nội dung thông báo |
| `type` | String | `enum: ['booking', 'promotion', 'system', 'refund']`, `required` | Phân loại thông báo |
| `isRead` | Boolean | `default: false` | Trạng thái đã đọc |
| `timestamps` | Boolean | `true` | Tự động thêm `createdAt`, `updatedAt` |
