/* eslint-env node */
/* global process */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

// Fix DNS resolution issues with some ISPs connecting to MongoDB Atlas SRV
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Lấy tham chiếu đường dẫn để giải quyết các import ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc file .env từ thư mục gốc
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import Models
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import TourSchedule from '../models/TourSchedule.js';
import Booking from '../models/Booking.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  if (!MONGODB_URI) {
    console.error('❌ Không tìm thấy MONGODB_URI trong file .env! Quá trình bị gián đoạn.');
    process.exit(1);
  }

  try {
    console.log('⏳ Đang kết nối tới Database MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    // 1. Đọc dữ liệu từ 2 file JSON
    const destPath = path.resolve(__dirname, '../data/destinations.json');
    const bookingPath = path.resolve(__dirname, '../data/bookings.json');

    const destinationsData = JSON.parse(await fs.readFile(destPath, 'utf8'));
    const bookingsData = JSON.parse(await fs.readFile(bookingPath, 'utf8'));

    // 2. Xóa các Collection mà chúng ta sẽ seed (Tránh duplicate khi chạy nhiều lần)
    console.log('⏳ Đang làm mới (Clear) dữ liệu các bộ sưu tập Destinations & Bookings...');
    await Destination.deleteMany({});
    await Booking.deleteMany({});
    // Xóa các dummy data phòng khi chạy script nhiều lần
    await User.deleteMany({ email: 'dummy_customer@example.com' });
    await Tour.deleteMany({ title: 'Tour Mẫu (Dummy)' });

    // 3. Tiến hành định dạng và thêm Dữ liệu Điểm Đến (Destinations)
    console.log('⏳ Đang import xử lý Destinations...');
    const formattedDestinations = destinationsData.map(dest => ({
      name: dest.name,
      type: 'city',
      description: `Quốc gia: ${dest.country} | Giới thiệu: ${dest.description} | Thời điểm du lịch tốt nhất: ${dest.best_time}`,
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800' // Hình ví dụ mặc định
    }));

    const savedDestinations = await Destination.insertMany(formattedDestinations);
    console.log(`✅ Đã thêm ${savedDestinations.length} bản ghi Destinations.`);

    // 4. Tạo một User tạm thời và một Tour tạm thời phục vụ cho Booking Relational DB
    // Vì bảng Booking bắt buộc phải có User(Khách) và ID tham chiếu (Tour/Flight)
    console.log('⏳ Đang thiết lập các Object Dummy (Tài khoản mẫu và Tour mẫu) để Mapping...');
    const dummyUser = new User({
      email: 'dummy_customer@example.com',
      fullName: 'Khách Hàng Báo Cáo',
      passwordHash: 'dummy_hash',
      role: 'user'
    });
    await dummyUser.save();

    const dummyDestId = savedDestinations[0]._id; // Dùng 1 địa điểm tùy ý đã tạo
    const dummyTour = new Tour({
      title: 'Tour Mẫu (Dummy)',
      description: 'Tour giả lập dành để test data bookings',
      destinationId: dummyDestId,
      basePrice: 5000000,
      duration: 3
    });
    await dummyTour.save();

    const dummySchedule = new TourSchedule({
      tourId: dummyTour._id,
      departureDate: new Date('2024-01-01'),
      actualPrice: 5000000,
      maxCapacity: 50,
      status: 'available'
    });
    await dummySchedule.save();

    // 5. Tiến hành định dạng và thêm Bookings
    console.log('⏳ Đang import Bookings...');
    const formattedBookings = bookingsData.map(b => {
      // Chuyển kiểu trạng thái sang chữ thường cho khớp model: 'pending', 'confirmed', 'cancelled', 'completed'
      let status = 'pending';
      const bStatus = (b.booking_status || '').toLowerCase();
      if (bStatus.includes('completed') || bStatus.includes('hoàn thành')) status = 'completed';
      else if (bStatus.includes('cancel') || bStatus.includes('hủy')) status = 'cancelled';
      else if (bStatus.includes('confirm')) status = 'confirmed';

      return {
        userId: dummyUser._id, // Trỏ khóa ngoại (foreign key) về người dùng mẫu
        bookingType: 'tour',
        itemId: dummySchedule._id, // Trỏ khóa ngoại về Lịch trình Tour mẫu
        travelers: [{
          fullName: `Mã khách hàng tự sinh: ${b.customer_id || 'Unknown'}`,
          age: 25 // Set cố định hoặc fake
        }],
        totalAmount: b.revenue_vnd || b.base_price_vnd || 0,
        status: status,
        paymentStatus: status === 'completed' ? 'paid' : 'unpaid',
        bookingDate: new Date(b.booking_date || new Date()), // Parse ngày từ chuỗi json
        paymentHistory: [{
          transactionId: b.booking_id || 'No_ID',
          amount: b.revenue_vnd || 0,
          method: (b.payment_method && String(b.payment_method).toLowerCase().includes('paypal')) ? 'paypal' : 'credit_card',
          status: status === 'completed' ? 'success' : 'pending',
          date: new Date(b.booking_date || new Date())
        }]
      };
    });

    await Booking.insertMany(formattedBookings);
    console.log(`✅ Đã thêm thành công ${formattedBookings.length} bản ghi Bookings.`);

    console.log('\n🎉 Hoàn tất quá trình Seed dữ liệu! CSDL MongoDB hiện đã có đầy đủ Test Data.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Có lỗi nghiêm trọng xảy ra trong quá trình seeding:', error);
    process.exit(1);
  }
}

seedDatabase();
