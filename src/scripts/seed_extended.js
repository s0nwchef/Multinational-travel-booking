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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import tất cả Models
import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Tour from '../models/Tour.js';
import TourSchedule from '../models/TourSchedule.js';
import Flight from '../models/Flight.js';
import Review from '../models/Review.js';
import Coupon from '../models/Coupon.js';
import Notification from '../models/Notification.js';

const MONGODB_URI = process.env.MONGODB_URI;

async function seedExtendedData() {
  if (!MONGODB_URI) {
    console.error('❌ Không tìm thấy MONGODB_URI. Vui lòng check .env');
    process.exit(1);
  }

  try {
    console.log('⏳ Đang kết nối tới Database MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    const dataPath = path.resolve(__dirname, '../data/extended_data.json');
    const data = JSON.parse(await fs.readFile(dataPath, 'utf8'));

    // 1. Clears các collections cũ (Tuỳ chọn: bạn có thể comment lại nếu muốn giữ data cũ)
    console.log('⏳ Đang dọn dẹp các Collection cũ...');
    await User.deleteMany({ email: { $in: data.users.map(u => u.email) } });
    await Tour.deleteMany({ title: { $in: data.tours.map(t => t.title) } });
    await Flight.deleteMany({});
    await Coupon.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    
    // 2. Thêm Users
    console.log('⏳ Đang import Người dùng (Users)...');
    const savedUsers = await User.insertMany(data.users);
    console.log(`✅ Đã thêm ${savedUsers.length} Users.`);

    // 3. Thêm Chuyến bay (Flights)
    console.log('⏳ Đang import Chuyến bay (Flights)...');
    const savedFlights = await Flight.insertMany(data.flights);
    console.log(`✅ Đã thêm ${savedFlights.length} Flights.`);

    // 4. Thêm Mã giảm giá (Coupons)
    console.log('⏳ Đang import Mã giảm giá (Coupons)...');
    const savedCoupons = await Coupon.insertMany(data.coupons);
    console.log(`✅ Đã thêm ${savedCoupons.length} Coupons.`);

    // 5. Thêm Tours và Lịch trình (Schedules)
    console.log('⏳ Đang import Tours & Schedules...');
    const savedTours = [];
    for (const tourData of data.tours) {
      // Tìm điểm đến (Destination) tương ứng trong hệ thống (Hoặc tạo mới nếu chưa có)
      let dest = await Destination.findOne({ name: { $regex: new RegExp(tourData.destinationName, 'i') } });
      if (!dest) {
        dest = await Destination.create({
          name: tourData.destinationName,
          type: 'city',
          description: `Khám phá những trải nghiệm thú vị nhất tại ${tourData.destinationName}`,
          imageUrl: tourData.images[0]
        });
      }

      // Tạo Tour với khóa ngoại trỏ tới Destination đã tìm được
      const tour = await Tour.create({
        ...tourData,
        destinationId: dest._id
      });
      savedTours.push(tour);

      // Tạo 2 lịch trình (Schedules) mẫu cho mỗi tour
      await TourSchedule.insertMany([
        {
          tourId: tour._id,
          departureDate: new Date('2024-07-20'),
          actualPrice: tour.basePrice,
          maxCapacity: 30,
          bookedSeats: 5,
          status: 'available'
        },
        {
          tourId: tour._id,
          departureDate: new Date('2024-08-30'),
          actualPrice: tour.basePrice * 1.2, // Giá tăng 20% vào dịp Lễ
          maxCapacity: 25,
          bookedSeats: 25,
          status: 'sold_out'
        }
      ]);
    }
    console.log(`✅ Đã thêm ${savedTours.length} Tours cùng với Lịch Trình (Schedules).`);

    // 6. Thêm Đánh giá (Reviews) & Thông báo (Notifications)
    if (savedUsers.length > 1 && savedTours.length > 0) {
      console.log('⏳ Đang giả lập (Mocking) Review và Notification...');
      
      const customer = savedUsers[1]; // Lấy khách hàng thứ nhất trong File
      const firstTour = savedTours[0];
      
      await Review.create({
        userId: customer._id,
        tourId: firstTour._id,
        rating: 5,
        content: 'Tour được tổ chức rất chuyên nghiệp. Hướng dẫn viên chu đáo!',
        photos: ['https://images.unsplash.com/photo-1517868163143-6eb6c78ddfcf']
      });

      await Notification.create({
        userId: customer._id,
        title: 'Xác nhận đặt tour thành công',
        message: `Bạn đã thanh toán và đặt thành công: ${firstTour.title}`,
        type: 'booking'
      });
      console.log(`✅ Đã thêm Reviews và Notifications giả lập.`);
    }

    console.log('\n🎉 Hoàn tất quá trình Extend Seed Dữ liệu! Toàn bộ Models của bạn đã có dữ liệu.');
    process.exit(0);

  } catch (error) {
    console.error('❌ Lỗi Extend Seed Data:', error);
    process.exit(1);
  }
}

seedExtendedData();
