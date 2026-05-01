# Kế Hoạch Backend: Chức Năng Đăng Ký

## Tổng Quan

Tạo API đăng ký user mới cho hệ thống Multinational Travel Booking.

---

## Phân Tích Hiện Trạng

### Model User (Đã có)
```javascript
{
  email: String, required, unique
  fullName: String
  passwordHash: String
  phoneNumber: String
  avatarUrl: String
  role: String, enum: ['user', 'staff', 'admin', 'tour_operator'], default: 'user'
  loyaltyPoints: Number, default: 0
  loyaltyTier: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze'
  staffId: String, default: null
  wishlist: [ObjectId ref: 'Tour']
}
```

### Controller (userController.js - Đã có)
- `createUser` - Tạo user mới (chưa hash password, chưa validate đầy đủ)
- `loginUser` - Đăng nhập (đã hash password với bcryptjs)

### Routes (userRoutes.js - Đã có)
- `POST /` - Tạo user (dùng cho cả seed data và registration)
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất (cần auth)
- `GET /current` - Lấy thông tin user hiện tại (cần auth)

---

## Kế Hoạch Triển Khai

### Bước 1: Cập Nhật Controller - `createUser`

Thêm logic đăng ký vào hàm `createUser`:

```javascript
export const registerUser = async (req, res) => {
    try {
        const { email, password, fullName, phoneNumber } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email và mật khẩu là bắt buộc' 
            });
        }

        // 2. Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: 'Email không hợp lệ' 
            });
        }

        // 3. Validate password length
        if (password.length < 6) {
            return res.status(400).json({ 
                message: 'Mật khẩu phải có ít nhất 6 ký tự' 
            });
        }

        // 4. Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ 
                message: 'Email đã được sử dụng' 
            });
        }

        // 5. Hash password
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // 6. Create user
        const newUser = new User({
            email: email.toLowerCase(),
            fullName: fullName || '',
            passwordHash,
            phoneNumber: phoneNumber || '',
            role: 'user',
            loyaltyPoints: 0,
            loyaltyTier: 'Bronze'
        });

        const savedUser = await newUser.save();

        // 7. Create session
        const { createSession } = await import('../middleware/authMiddleware.js');
        const sessionId = createSession(savedUser._id.toString());

        // 8. Return user data (exclude passwordHash)
        const userResponse = {
            id: savedUser._id,
            email: savedUser.email,
            fullName: savedUser.fullName,
            role: savedUser.role,
            avatarUrl: savedUser.avatarUrl,
            phoneNumber: savedUser.phoneNumber,
            loyaltyPoints: savedUser.loyaltyPoints,
            loyaltyTier: savedUser.loyaltyTier,
            createdAt: savedUser.createdAt
        };

        res.status(201).json({
            message: 'Đăng ký thành công',
            user: userResponse,
            sessionId
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            message: 'Lỗi server khi đăng ký', 
            error: error.message 
        });
    }
};
```

### Bước 2: Cập Nhật Routes - `userRoutes.js`

Thêm route đăng ký:

```javascript
import { registerUser } from '../controllers/userController.js';

// Thêm route mới
router.post('/register', registerUser);
```

---

## API Specification

### POST /api/users/register

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "123456",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789"
}
```

**Response (201 - Thành công):**
```json
{
  "message": "Đăng ký thành công",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "fullName": "Nguyễn Văn A",
    "role": "user",
    "avatarUrl": null,
    "phoneNumber": "0123456789",
    "loyaltyPoints": 0,
    "loyaltyTier": "Bronze",
    "createdAt": "2026-05-01T12:00:00.000Z"
  },
  "sessionId": "..."
}
```

**Error Responses:**
- `400` - Email và mật khẩu là bắt buộc
- `400` - Email không hợp lệ
- `400` - Mật khẩu phải có ít nhất 6 ký tự
- `409` - Email đã được sử dụng
- `500` - Lỗi server

---

## Files Cần Sửa Đổi

| File | Thay đổi |
|------|----------|
| `server/controllers/userController.js` | Thêm hàm `registerUser` |
| `server/routes/userRoutes.js` | Thêm route `POST /register` |

---

## Frontend (Liên quan)

Frontend cần cập nhật:
- `AuthModal.jsx` - Thêm form đăng ký
- Tạo service gọi API `POST /api/users/register`
- Xử lý redirect sau đăng ký thành công

---

## Test Cases

1. ✅ Đăng ký thành công với email mới
2. ✅ Đăng ký thất bại với email đã tồn tại
3. ✅ Đăng ký thất bại với email không hợp lệ
4. ✅ Đăng ký thất bại với password < 6 ký tự
5. ✅ Đăng ký thất bại khi thiếu email hoặc password