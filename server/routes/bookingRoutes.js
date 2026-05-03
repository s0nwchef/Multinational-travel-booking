import express from 'express';
import Booking from '../models/Booking.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId').populate('itemId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách booking', error: error.message });
    }
});

// Create booking - require auth to ensure userId is set from session
router.post('/', requireAuth(), async (req, res) => {
    try {
        // Prefer server-side user from session
        const userId = req.user?._id || req.body.userId;
        const bookingCode = req.body.bookingCode || `BK-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

        const bookingData = {
            ...req.body,
            userId,
            bookingCode,
            bookingReference: req.body.bookingReference || bookingCode,
            itemId: req.body.itemId || req.body.tourId,
        };

        const newBooking = new Booking(bookingData);
        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo booking', error: error.message });
    }
});

export default router;
