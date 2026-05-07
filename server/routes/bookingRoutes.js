import express from 'express';
import DatTour from '../models/DatTour.js';
import TourVi from '../models/TourVi.js';
import LichKhoiHanh from '../models/LichKhoiHanh.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { sendNotification } from '../utils/notificationHelper.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await DatTour.find().populate('id_nguoi_dung', 'ho_ten email').populate('id_tour', 'ten_tour');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách booking', error: error.message });
    }
});

// Create booking - require auth to ensure userId is set from session
router.post('/', requireAuth(), async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find schedule if provided
        let scheduleId = req.body.itemId;
        if (!scheduleId && req.body.tourId) {
            // Find an available schedule for this tour
            const schedule = await LichKhoiHanh.findOne({ id_tour: req.body.tourId, trang_thai: 'available' });
            if (schedule) scheduleId = schedule._id;
        }

        const totalAmount = req.body.grandTotal || req.body.totalAmount || 0;
        const discountAmount = req.body.discountAmount || 0;
        const baseFare = req.body.baseFare || totalAmount + discountAmount;

        const bookingData = {
            id_nguoi_dung: userId,
            id_tour: req.body.tourId || req.body.itemId,
            id_lich_khoi_hanh: scheduleId || req.body.tourId,
            thong_tin_lien_he: {
                ho_ten: req.body.customerName || req.user.ho_ten || 'Unknown',
                email: req.user.email || 'unknown@example.com',
                so_dien_thoai: req.user.so_dien_thoai || '0000000000'
            },
            hanh_khach: (req.body.travelers && req.body.travelers.length > 0) ? req.body.travelers.map(t => ({
                ho_ten: t.fullName || 'N/A',
                ngay_sinh: t.dateOfBirth ? new Date(t.dateOfBirth) : new Date('2000-01-01'),
                gioi_tinh: t.gender || 'other',
                so_ho_chieu: t.documentId || '',
                loai: t.age && t.age < 12 ? 'tre_em' : 'nguoi_lon'
            })) : [{
                ho_ten: req.body.customerName || req.user.ho_ten || 'Unknown',
                ngay_sinh: new Date('2000-01-01'),
                gioi_tinh: 'other',
                so_ho_chieu: '',
                loai: 'nguoi_lon'
            }],
            so_nguoi_lon: 1,
            so_tre_em: 0,
            don_gia_nguoi_lon: baseFare,
            don_gia_tre_em: 0,
            tong_tien_truoc_giam: baseFare,
            tien_giam_gia: discountAmount,
            tong_tien_cuoi: totalAmount,
            trang_thai: 'pending',
            trang_thai_thanh_toan: 'unpaid'
        };

        const numAdults = bookingData.hanh_khach.filter(t => t.loai === 'nguoi_lon').length;
        const numChildren = bookingData.hanh_khach.filter(t => t.loai === 'tre_em').length;
        bookingData.so_nguoi_lon = Math.max(numAdults, 1);
        bookingData.so_tre_em = numChildren;

        const newBooking = new DatTour(bookingData);
        const savedBooking = await newBooking.save();

        if (scheduleId) {
            await LichKhoiHanh.findByIdAndUpdate(scheduleId, {
                $inc: { cho_da_dat: bookingData.so_nguoi_lon + bookingData.so_tre_em }
            });
        }

        await sendNotification(savedBooking.id_nguoi_dung, {
            title: 'Đặt tour thành công',
            message: `Mã đặt tour: ${savedBooking.ma_dat_tour}`,
            type: 'booking',
            link: `/my-bookings/${savedBooking._id}`
        });

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(400).json({ message: 'Lỗi khi tạo booking', error: error.message });
    }
});

export default router;