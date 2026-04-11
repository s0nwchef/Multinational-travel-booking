import express from 'express';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import dns from 'node:dns';
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
    const MONGODB_URI = process.env.MONGODB_URI;
    if (MONGODB_URI) {
        try {
            await mongoose.connect(MONGODB_URI);
            console.log('Đã kết nối thành công tới MongoDB Atlas!');
        } catch (error) {
            console.error('Mongo connect error full:', error);
            console.error('Mongo connect error message:', error.message)
        }
    } else {
        console.warn('Cảnh báo: Chưa tìm thấy MONGODB_URI trong file .env');
    }

    // 2. KHAI BÁO CÁC API ROUTES (Backend)
    // API test để kiểm tra server có hoạt động không
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'ok',
            message: 'Backend Express chạy được rồi hú hú hú',
            dbConnected: mongoose.connection.readyState === 1
        });
    });

    // (Sau này bạn sẽ thêm các API như app.get('/api/tours', ...) ở đây)

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
        console.log(`Server chạy tại: http://localhost:${PORT}`);
    });
}

startServer();