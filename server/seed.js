/**
 * Seed script - Thêm dữ liệu mẫu vào database multinational-travel-booking
 * Chạy: node server/seed.js
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import bcrypt from 'bcryptjs';
import NguoiDung from './models/NguoiDung.js';
import DiemDen from './models/DiemDen.js';
import TourVi from './models/TourVi.js';
import DatTour from './models/DatTour.js';
import DanhGia from './models/DanhGia.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

async function connectDB() {
    let MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) { console.error('❌ Chưa tìm thấy MONGODB_URI'); process.exit(1); }
    MONGODB_URI = MONGODB_URI.trim().replace(/^["']|["']$/g, '');
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: 'multinational-travel-booking',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Đã kết nối tới MongoDB Atlas (multinational-travel-booking)');
    } catch (error) {
        console.error('❌ Lỗi kết nối:', error.message);
        process.exit(1);
    }
}

async function seedData() {
    try {
        await TourVi.deleteMany({});
        await DiemDen.deleteMany({});
        await DatTour.deleteMany({});
        await DanhGia.deleteMany({});
        console.log('🗑️ Đã xóa dữ liệu cũ');

        // Tạo điểm đến
        const destinations = await DiemDen.insertMany([
            { quoc_gia: 'Italy', ma_quoc_gia: 'IT', thanh_pho: 'Rome', chau_luc: 'Châu Âu', mo_ta: 'Thủ đô cổ đại của Đế chế La Mã', pho_bien: true },
            { quoc_gia: 'Italy', ma_quoc_gia: 'IT', thanh_pho: 'Florence', chau_luc: 'Châu Âu', mo_ta: 'Trung tâm nghệ thuật Phục Hưng' },
            { quoc_gia: 'Italy', ma_quoc_gia: 'IT', thanh_pho: 'Venice', chau_luc: 'Châu Âu', mo_ta: 'Thành phố kênh đào' },
            { quoc_gia: 'France', ma_quoc_gia: 'FR', thanh_pho: 'Paris', chau_luc: 'Châu Âu', mo_ta: 'Thành phố Ánh sáng', pho_bien: true },
            { quoc_gia: 'Japan', ma_quoc_gia: 'JP', thanh_pho: 'Tokyo', chau_luc: 'Châu Á', mo_ta: 'Đô thị hiện đại của Nhật Bản', pho_bien: true }
        ]);
        console.log(`✅ Đã thêm ${destinations.length} điểm đến`);

        // Tạo người dùng mẫu
        const seedUsers = [];
        const passwordHash = await bcrypt.hash('Password123!', 10);
        const userSeeds = [
            { email: 'sarah.jenkins@example.com', ho_ten: 'Sarah Jenkins', anh_dai_dien: 'https://i.pravatar.cc/150?img=1' },
            { email: 'marcus.chen@example.com', ho_ten: 'Marcus Chen', anh_dai_dien: 'https://i.pravatar.cc/150?img=2' },
            { email: 'elena.dragan@example.com', ho_ten: 'Elena Dragan', anh_dai_dien: 'https://i.pravatar.cc/150?img=3' },
            { email: 'olivia.miller@example.com', ho_ten: 'Olivia Miller', anh_dai_dien: 'https://i.pravatar.cc/150?img=4' },
            { email: 'daniel.kim@example.com', ho_ten: 'Daniel Kim', anh_dai_dien: 'https://i.pravatar.cc/150?img=5' }
        ];

        for (const u of userSeeds) {
            const user = await NguoiDung.findOneAndUpdate(
                { email: u.email },
                { $set: { ho_ten: u.ho_ten, anh_dai_dien: u.anh_dai_dien, vai_tro: 'user', mat_khau_hash: passwordHash } },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
            seedUsers.push(user);
        }
        console.log(`✅ Đã thêm ${seedUsers.length} người dùng`);

        // Tạo tour
        const tours = await TourVi.insertMany([
            {
                ten_tour: 'Best of Italy: Rome, Florence & Venice',
                mo_ta: 'Trải nghiệm vẻ đẹp nước Ý với tour 10 ngày qua những điểm đến biểu tượng nhất.',
                id_diem_den: destinations[0]._id,
                gia_nguoi_lon: 2499, gia_tre_em: 1749, so_ngay: 10, so_dem: 9,
                danh_sach_anh: ['https://images.unsplash.com/photo-1501594907352-04cda38ebc29', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'],
                anh_dai_dien: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29',
                lich_trinh: [
                    { ngay: 1, tieu_de: 'Đến Rome', mo_ta: 'Nhận phòng khách sạn, tham quan khu trung tâm' },
                    { ngay: 2, tieu_de: 'Colosseum', mo_ta: 'Tham quan Đấu trường La Mã và Roman Forum' },
                    { ngay: 3, tieu_de: 'Vatican', mo_ta: 'Bảo tàng Vatican và Nhà thờ Thánh Peter' },
                    { ngay: 4, tieu_de: 'Di chuyển Florence', mo_ta: 'Tàu cao tốc đến Florence' },
                    { ngay: 5, tieu_de: 'Phục Hưng Florence', mo_ta: 'Nhà thờ Duomo, Ponte Vecchio' },
                    { ngay: 6, tieu_de: 'Tuscany', mo_ta: 'Nếm rượu vang vùng Tuscany' },
                    { ngay: 7, tieu_de: 'Di chuyển Venice', mo_ta: 'Tàu đến Venice' },
                    { ngay: 8, tieu_de: 'Venice', mo_ta: 'Đi thuyền Gondola, Quảng trường St. Mark' },
                    { ngay: 9, tieu_de: 'Đảo', mo_ta: 'Khám phá đảo Murano và Burano' },
                    { ngay: 10, tieu_de: 'Về nước', mo_ta: 'Trả phòng và ra sân bay' }
                ],
                bao_gom: ['Khách sạn 4 sao', 'Bữa sáng hàng ngày', 'Hướng dẫn viên', 'Vé tàu', 'Đưa đón sân bay'],
                khong_bao_gom: ['Vé máy bay quốc tế', 'Bảo hiểm du lịch', 'Chi phí cá nhân'],
                diem_trung_binh: 4.9, so_luong_danh_gia: 5, trang_thai: 'active'
            },
            {
                ten_tour: 'Paris in 5 Days',
                mo_ta: 'Khám phá sự quyến rũ và vẻ đẹp của Paris trong chuyến trải nghiệm châu Âu tinh túy.',
                id_diem_den: destinations[3]._id,
                gia_nguoi_lon: 1299, gia_tre_em: 909, so_ngay: 5, so_dem: 4,
                danh_sach_anh: ['https://images.unsplash.com/photo-1431274172911-5dff6b52884b'],
                anh_dai_dien: 'https://images.unsplash.com/photo-1431274172911-5dff6b52884b',
                lich_trinh: [
                    { ngay: 1, tieu_de: 'Đến Paris', mo_ta: 'Tham quan Tháp Eiffel' },
                    { ngay: 2, tieu_de: 'Bảo tàng Louvre', mo_ta: 'Tham quan bảo tàng nổi tiếng nhất thế giới' },
                    { ngay: 3, tieu_de: 'Notre-Dame', mo_ta: 'Nhà thờ Đức Bà và khu Latin' },
                    { ngay: 4, tieu_de: 'Versailles', mo_ta: 'Cung điện Versailles' },
                    { ngay: 5, tieu_de: 'Montmartre', mo_ta: 'Montmartre và mua sắm' }
                ],
                bao_gom: ['Khách sạn', 'Bữa sáng', 'Vé bảo tàng', 'Giao thông địa phương'],
                khong_bao_gom: ['Bữa ăn (trừ sáng)', 'Vé máy bay quốc tế'],
                diem_trung_binh: 4.8, so_luong_danh_gia: 2, trang_thai: 'active'
            },
            {
                ten_tour: 'Tokyo Cultural Experience',
                mo_ta: 'Đắm mình trong văn hóa, truyền thống và sự hiện đại của Nhật Bản.',
                id_diem_den: destinations[4]._id,
                gia_nguoi_lon: 1899, gia_tre_em: 1329, so_ngay: 7, so_dem: 6,
                danh_sach_anh: ['https://images.unsplash.com/photo-1540959375944-7049f642e9a0'],
                anh_dai_dien: 'https://images.unsplash.com/photo-1540959375944-7049f642e9a0',
                lich_trinh: [
                    { ngay: 1, tieu_de: 'Đến Tokyo', mo_ta: 'Nhận phòng khách sạn' },
                    { ngay: 2, tieu_de: 'Shibuya & Shinjuku', mo_ta: 'Tham quan các quận nổi tiếng' },
                    { ngay: 3, tieu_de: 'Đền chùa', mo_ta: 'Tham quan đền và chùa truyền thống' },
                    { ngay: 4, tieu_de: 'Núi Phú Sĩ', mo_ta: 'Chuyến đi trong ngày đến núi Phú Sĩ' },
                    { ngay: 5, tieu_de: 'Trải nghiệm truyền thống', mo_ta: 'Trà đạo, mặc Kimono' },
                    { ngay: 6, tieu_de: 'Mua sắm', mo_ta: 'Mua sắm và giải trí' },
                    { ngay: 7, tieu_de: 'Về nước', mo_ta: 'Trả phòng và ra sân bay' }
                ],
                bao_gom: ['Khách sạn', 'Bữa ăn hàng ngày', 'JR Pass', 'Hướng dẫn viên'],
                khong_bao_gom: ['Vé máy bay quốc tế', 'Bảo hiểm du lịch'],
                diem_trung_binh: 4.7, so_luong_danh_gia: 1, trang_thai: 'active'
            }
        ]);
        console.log(`✅ Đã thêm ${tours.length} tour`);

        // Tạo booking & review
        const bookingDocs = [];
        const reviewDocs = [];

        // Sarah Jenkins - booking hoàn thành cho mọi tour
        for (const tour of tours) {
            bookingDocs.push({
                ma_dat_tour: `SARAH-${tour._id.toString().slice(-6)}`,
                id_nguoi_dung: seedUsers[0]._id, id_tour: tour._id, id_lich_khoi_hanh: tour._id,
                thong_tin_lien_he: { ho_ten: 'Sarah Jenkins', email: 'sarah.jenkins@example.com', so_dien_thoai: '0900000001' },
                hanh_khach: [{ ho_ten: 'Sarah Jenkins', ngay_sinh: new Date('1994-03-15'), gioi_tinh: 'female', loai: 'nguoi_lon' }],
                so_nguoi_lon: 1, so_tre_em: 0, don_gia_nguoi_lon: tour.gia_nguoi_lon, don_gia_tre_em: 0,
                tong_tien_truoc_giam: tour.gia_nguoi_lon, tien_giam_gia: 0, tong_tien_cuoi: tour.gia_nguoi_lon,
                trang_thai: 'completed', trang_thai_thanh_toan: 'paid'
            });
        }

        const reviewsByTour = [
            { tourIdx: 0, reviews: [
                { userIdx: 1, tieu_de: 'Wonderful and well organized', diem: 5, noi_dung: 'Ba thành phố đều rất đẹp, đặc biệt Venice vào buổi tối. Dịch vụ rất chuyên nghiệp.' },
                { userIdx: 2, tieu_de: 'Great trip with a busy schedule', diem: 4, noi_dung: 'Tour có nhiều trải nghiệm tốt, chỉ hơi dày lịch trình ở ngày 4-5 nhưng vẫn đáng tiền.' }
            ]},
            { tourIdx: 1, reviews: [
                { userIdx: 3, tieu_de: 'Paris at its best', diem: 5, noi_dung: 'Paris đẹp đúng như kỳ vọng. Phần tham quan Louvre và Versailles là điểm nhấn lớn nhất.' },
                { userIdx: 4, tieu_de: 'Perfect for a family trip', diem: 5, noi_dung: 'Nhịp tour nhẹ nhàng, phù hợp cho gia đình. Hướng dẫn viên am hiểu và hỗ trợ tốt.' }
            ]},
            { tourIdx: 2, reviews: [
                { userIdx: 1, tieu_de: 'Worth every penny', diem: 4, noi_dung: 'Đáng tiền, đặc biệt là ngày đi Mount Fuji. Có thể thêm một đêm nghỉ ở khu Shibuya thì tuyệt hơn.' }
            ]}
        ];

        for (const group of reviewsByTour) {
            const tour = tours[group.tourIdx];
            for (const r of group.reviews) {
                const user = seedUsers[r.userIdx];
                // Booking for reviewer
                bookingDocs.push({
                    ma_dat_tour: `SEED-${tour._id.toString().slice(-6)}-${user._id.toString().slice(-4)}`,
                    id_nguoi_dung: user._id, id_tour: tour._id, id_lich_khoi_hanh: tour._id,
                    thong_tin_lien_he: { ho_ten: user.ho_ten, email: user.email, so_dien_thoai: '0900000000' },
                    hanh_khach: [{ ho_ten: user.ho_ten, ngay_sinh: new Date('1990-01-01'), gioi_tinh: 'other', loai: 'nguoi_lon' }],
                    so_nguoi_lon: 1, so_tre_em: 0, don_gia_nguoi_lon: tour.gia_nguoi_lon, don_gia_tre_em: 0,
                    tong_tien_truoc_giam: tour.gia_nguoi_lon, tien_giam_gia: 0, tong_tien_cuoi: tour.gia_nguoi_lon,
                    trang_thai: 'completed', trang_thai_thanh_toan: 'paid'
                });
                // Review
                reviewDocs.push({
                    id_nguoi_dung: user._id, id_tour: tour._id, id_dat_tour: tour._id,
                    diem: r.diem, tieu_de: r.tieu_de, noi_dung: r.noi_dung, da_xac_minh: true
                });
            }
        }

        await DatTour.insertMany(bookingDocs);
        await DanhGia.insertMany(reviewDocs);
        console.log(`✅ Đã thêm ${reviewDocs.length} đánh giá`);
        console.log(`✅ Đã thêm ${bookingDocs.length} đặt tour`);
        console.log('\n✨ Seed data thành công!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi seed data:', error);
        process.exit(1);
    }
}

connectDB().then(() => seedData());
