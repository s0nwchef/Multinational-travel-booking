/* eslint-env node */
import express from 'express';
import mongoose from 'mongoose';
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

// Global connection cache for serverless (reuse connections across invocations)
let cachedConnection = null;

/**
 * Connect to MongoDB with connection pooling for serverless environment
 * Reuses existing connections on warm starts
 */
async function connectDB() {
    // Return cached connection if already connected
    if (cachedConnection && mongoose.connection.readyState === 1) {
        return cachedConnection;
    }

    let MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
        console.warn('⚠️ Cảnh báo: Chưa tìm thấy MONGODB_URI trong file .env. Vui lòng thiết lập trong Settings.');
        return null;
    }

    // Remove trailing/leading quotes if the user accidentally included them
    MONGODB_URI = MONGODB_URI.trim().replace(/^["']|["']$/g, '');
    
    if (!MONGODB_URI.startsWith('mongodb://') && !MONGODB_URI.startsWith('mongodb+srv://')) {
        console.error('Mongo connect error full: MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"');
        console.error('⚠️ Cảnh báo: MONGODB_URI không hợp lệ. Chuỗi kết nối phải bắt đầu bằng "mongodb://" hoặc "mongodb+srv://".');
        return null;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 1
        });
        cachedConnection = mongoose.connection;
        console.log('✅ Đã kết nối thành công tới MongoDB Atlas!');
        return cachedConnection;
    } catch (error) {
        console.error('Mongo connect error full:', error);
        console.error('Mongo connect error message:', error.message);
        return null;
    }
}

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON body từ request của client
app.use(express.json());

// Dynamic CORS middleware for Vercel serverless
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const vercelUrl = process.env.VERCEL_URL;
    
    // Build allowed origins list
    const allowedOrigins = [];
    
    // Add Vercel production URL if available
    if (vercelUrl) {
        allowedOrigins.push(`https://${vercelUrl}`);
    }
    
    // Add localhost for development
    if (process.env.NODE_ENV !== 'production') {
        allowedOrigins.push('http://localhost:5173');
        allowedOrigins.push('http://localhost:3000');
    }
    
    // Allow if origin is in allowed list or no origin (server-to-server)
    if (allowedOrigins.includes(origin) || !origin) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    } else if (process.env.NODE_ENV !== 'production') {
        // In development, allow any origin
        res.header('Access-Control-Allow-Origin', origin || '*');
    } else {
        // In production, only allow known origins
        res.header('Access-Control-Allow-Origin', allowedOrigins[0] || '*');
    }
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend Express đang chạy ngon lành!',
        dbConnected: mongoose.connection.readyState === 1
    });
});

// Import and mount routes
async function setupRoutes() {
    const tourRoutes = (await import('./server/routes/tourRoutes.js')).default;
    const destinationRoutes = (await import('./server/routes/destinationRoutes.js')).default;
    const bookingRoutes = (await import('./server/routes/bookingRoutes.js')).default;
    const userRoutes = (await import('./server/routes/userRoutes.js')).default;
    const staffRoutes = (await import('./server/routes/staffRoutes.js')).default;
    const flightRoutes = (await import('./server/routes/flightRoutes.js')).default;
    const wishlistRoutes = (await import('./server/routes/wishlistRoutes.js')).default;
    const notificationRoutes = (await import('./server/routes/notificationRoutes.js')).default;
    const couponRoutes = (await import('./server/routes/couponRoutes.js')).default;
    const reviewRoutes = (await import('./server/routes/reviewRoutes.js')).default;
    const refundRoutes = (await import('./server/routes/refundRoutes.js')).default;
    const settingsRoutes = (await import('./server/routes/settingsRoutes.js')).default;
    const paymentRoutes = (await import('./server/routes/paymentRoutes.js')).default;
    const staffSettingsRoutes = (await import('./server/routes/staffSettingsRoutes.js')).default;

    // Mount routes
    app.use('/api/tours', tourRoutes);
    app.use('/api/destinations', destinationRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/staff', staffRoutes);
    app.use('/api/flights', flightRoutes);
    app.use('/api/wishlist', wishlistRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/coupons', couponRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/refunds', refundRoutes);
    app.use('/api/settings', settingsRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/staff/settings', staffSettingsRoutes);
}

// Setup routes
await setupRoutes();

// Setup Vite middleware for development
if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
    });
    app.use(vite.middlewares);
} else if (process.env.VERCEL === undefined) {
    // Local production mode: serve built frontend from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.use((req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

// Connect to MongoDB (with connection pooling for serverless)
await connectDB();

// Start server (only for local development)
if (process.env.VERCEL === undefined) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
    });
}

// Vercel serverless export
export default app;
