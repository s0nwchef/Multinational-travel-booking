/* eslint-env node */
import express from 'express';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dns from 'node:dns';

// Ép sử dụng Google DNS và Cloudflare DNS để tránh lỗi querySrv của nhà mạng
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Load biến môi trường từ file .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
    const app = express();
    const PORT = process.env.PORT || 3000;

    // Middleware để parse JSON body từ request của client
    app.use(express.json());

    // 1. KẾT NỐI MONGODB
    let MONGODB_URI = process.env.MONGODB_URI;
    if (MONGODB_URI) {
        // Remove trailing/leading quotes if the user accidentally included them
        MONGODB_URI = MONGODB_URI.trim().replace(/^["']|["']$/g, '');
        
        if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
            console.error('Mongo connect error full: MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"');
            console.error('⚠️ Cảnh báo: MONGODB_URI không hợp lệ. Chuỗi kết nối phải bắt đầu bằng "mongodb://" hoặc "mongodb+srv://".');
        } else {
            try {
                await mongoose.connect(MONGODB_URI);
                console.log('✅ Đã kết nối thành công tới MongoDB Atlas!');
            } catch (error) {
                console.error('Mongo connect error full:', error);
                console.error('Mongo connect error message:', error.message);
            }
        }
    } else {
        console.warn('⚠️ Cảnh báo: Chưa tìm thấy MONGODB_URI trong file .env. Vui lòng thiết lập trong Settings.');
    }

    // 2. KHAI BÁO CÁC API ROUTES (Backend)
    // Import routes
    const tourRoutes = (await import('./server/routes/tourRoutes.js')).default;
    const destinationRoutes = (await import('./server/routes/destinationRoutes.js')).default;
    const bookingRoutes = (await import('./server/routes/bookingRoutes.js')).default;
    const userRoutes = (await import('./server/routes/userRoutes.js')).default;

    // API test để kiểm tra server có hoạt động không
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'ok',
            message: 'Backend Express đang chạy ngon lành!',
            dbConnected: mongoose.connection.readyState === 1
        });
    });

    // Mount routes
    app.use('/api/tours', tourRoutes);
    app.use('/api/destinations', destinationRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/users', userRoutes);

    // 3. TÍCH HỢP VITE MIDDLEWARE (Phục vụ Frontend React)
    if (process.env.NODE_ENV !== 'production') {
        // Môi trường Dev: Dùng Vite để hot-reload Frontend
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        // Môi trường Production: Phục vụ file tĩnh từ thư mục dist
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    // 4. KHỞI CHẠY SERVER
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
}

startServer();
