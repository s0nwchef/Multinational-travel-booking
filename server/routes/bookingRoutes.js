import express from 'express';
import Booking from '../models/Booking.js';
import { sendNotification } from '../utils/notificationHelper.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find().populate('userId').populate('itemId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách booking', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        const savedBooking = await newBooking.save();

        // Gửi thông báo cho user
        if (savedBooking.userId) {
            await sendNotification(savedBooking.userId, {
                title: 'Đặt tour thành công',
                message: `Mã đặt tour: ${savedBooking.bookingCode || savedBooking._id}`,
                type: 'booking',
                link: `/my-bookings/${savedBooking._id}`
            });
        }

        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo booking', error: error.message });
    }
});

export default router;