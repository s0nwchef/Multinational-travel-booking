# Báo cáo cập nhật Sidebar, Dashboard và My Bookings

## 1. Nội dung đã thực hiện

### Sidebar

- Ảnh đại diện, họ tên và ngày tạo tài khoản được lấy từ collection `nguoi_dung` thông qua API người dùng hiện tại.
- Các field sử dụng:
  - `anh_dai_dien`
  - `ho_ten`
  - `ngay_tao`
  - `diem`
- Thẻ điểm cuối sidebar đã được thay dữ liệu tĩnh bằng dữ liệu thật từ field `diem`.
- Thêm hàm tính cấp độ điểm dùng chung với 5 mức:
  - Bronze: 0 điểm
  - Silver: 500 điểm
  - Gold: 1000 điểm
  - Platium: 1500 điểm
  - Diamond: 2000 điểm
- Sidebar hiển thị:
  - cấp độ hiện tại
  - tổng điểm hiện tại
  - thanh tiến trình tới cấp tiếp theo
  - số điểm còn thiếu để lên cấp tiếp theo

### DashboardPage

- Phần điểm và cấp độ thành viên dùng cùng hàm tính điểm với Sidebar.
- Tên người dùng được fill đúng từ `ho_ten`, có fallback về `fullName` hoặc `name`.
- Component Upcoming Trip tiếp tục lấy dữ liệu từ `dat_tour` thông qua API `/api/bookings`.
- API booking ở server đã lọc theo `id_nguoi_dung` của phiên đăng nhập, nên Dashboard chỉ hiển thị tour upcoming của đúng người dùng hiện tại.

### MyBookingPage

- Danh sách booking được lấy từ API booking đã xác thực người dùng.
- Các trạng thái được lọc theo nhóm:
  - Upcoming
  - Completed
  - Cancelled
- Tìm kiếm đã được cải thiện để hoạt động ổn định với:
  - tên tour
  - mã booking
  - trạng thái booking
  - trạng thái thanh toán
  - thành phố/quốc gia
- Khi đổi nội dung tìm kiếm, trang hiện tại tự reset về trang đầu tiên.

## 2. Cập nhật phía backend

- Model `NguoiDung` đã thêm field `diem` để đọc điểm từ collection `nguoi_dung`.
- Middleware xác thực trả thêm:
  - `diem`
  - `loyaltyPoints`
- API đăng nhập, đăng ký và OAuth trả thêm dữ liệu điểm.
- API booking populate thêm thông tin điểm đến của tour để My Bookings có thể tìm kiếm theo địa điểm.

## 3. File đã thay đổi

- `server/models/NguoiDung.js`
- `server/middleware/authMiddleware.js`
- `server/controllers/userController.js`
- `server/services/googleOAuthService.js`
- `server/routes/bookingRoutes.js`
- `src/layouts/Sidebar.jsx`
- `src/layouts/Header.jsx`
- `src/pages/DashboardPage.jsx`
- `src/pages/MyBookingPage.jsx`
- `src/services/authService.js`
- `src/services/bookings/bookingService.js`
- `src/components/AuthModal.jsx`
- `src/hooks/useCurrentUserProfile.js`
- `src/utils/loyalty.js`

## 4. Kiểm thử

- Đã chạy build frontend bằng `npm.cmd run build`.
- Kết quả: build thành công.
- Có cảnh báo dung lượng bundle lớn và cảnh báo dynamic import của Vite, nhưng không làm lỗi build.
