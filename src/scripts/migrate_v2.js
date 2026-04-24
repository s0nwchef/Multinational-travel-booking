/* eslint-env node */
/* global process */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'node:dns';

// Ép sử dụng Google DNS và Cloudflare DNS để tránh lỗi querySrv của nhà mạng
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Setup biến môi trường
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Import Models
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Flight from '../models/Flight.js';

// Hàm tạo Mã PNR ngẫu nhiên
const generatePNR = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let pnr = '';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
};

// Hàm sinh Sơ đồ ghế tự động (Giả lập tàu bay nhỏ 10 hàng x 6 ghế)
const generateSeatMap = () => {
    const seats = [];
    const rows = 10;
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let r = 1; r <= rows; r++) {
        for (let l of letters) {
            let seatClass = (r <= 2) ? 'business' : 'economy';
            let multiplier = (r <= 2) ? 2.5 : 1.0;
            seats.push({
                seatNumber: `${r}${l}`,
                seatClass: seatClass,
                status: 'Available',
                priceMultiplier: multiplier
            });
        }
    }
    return seats;
};

const runMigration = async () => {
  try {
    console.log('⏳ Đang kết nối tới MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB thành công!');

    // 1. Cập nhật bảng User
    console.log('🔄 Đang cập nhật bảng User...');
    const userResult = await User.updateMany(
      { role: { $exists: false } },
      { $set: { role: 'user', loyaltyPoints: 0, loyaltyTier: 'Bronze', staffId: null } }
    );
    console.log(`✅ Đã cập nhật ${userResult.modifiedCount} Users.`);

    // 2. Cập nhật bảng Flight (Tạo sơ đồ ghế)
    console.log('🔄 Đang cập nhật bảng Flight (Seat Map)...');
    const flights = await Flight.find({ seatMap: { $size: 0 } });
    let flightCount = 0;
    for (let flight of flights) {
        flight.seatMap = generateSeatMap();
        await flight.save();
        flightCount++;
    }
    console.log(`✅ Đã tạo Sơ đồ ghế cho ${flightCount} Flights.`);

    // 3. Cập nhật bảng Booking
    console.log('🔄 Đang cập nhật bảng Booking (Tax, PNR, Passengers)...');
    const bookings = await Booking.find({ bookingCode: { $exists: false } });
    let bookingCount = 0;
    for (let b of bookings) {
        b.bookingCode = generatePNR();
        
        // Giả sử tổng tiền cũ đang lưu ở trường totalPrice (hoặc bạn có thể đổi thành grandTotal)
        // Bóc tách ngược lại từ totalPrice cũ
        const oldTotal = b.totalPrice || b.grandTotal || 0;
        b.baseFare = Math.round(oldTotal / 1.1); // Gốc = Tổng / 1.1
        b.taxAmount = oldTotal - b.baseFare;     // Thuế = Tổng - Gốc
        b.baggageFee = 0;
        b.discountAmount = 0;
        b.grandTotal = oldTotal;
        b.penaltyFee = 0;
        
        // Convert status cũ sang status mới nếu cần
        if (['Confirmed', 'Confirmed'].includes(b.status)) b.status = 'paid';
        if (['Cancelled'].includes(b.status)) b.status = 'cancelled';
        
        await b.save();
        bookingCount++;
    }
    console.log(`✅ Đã cập nhật Kế toán & Mã PNR cho ${bookingCount} Bookings.`);

    console.log('🎉 QUÁ TRÌNH MIGRATION HOÀN TẤT!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi Migration:', error);
    process.exit(1);
  }
};

runMigration();
