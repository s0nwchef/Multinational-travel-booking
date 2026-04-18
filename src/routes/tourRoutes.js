import express from 'express';
import Tour from '../models/Tour.js';

const router = express.Router();

// Lấy danh sách tất cả các tour
router.get('/', async (req, res) => {
    try {
        const tours = await Tour.find().populate('destinationId');
        res.json(tours);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tour', error: error.message });
    }
});

// Lấy chi tiết một tour theo ID
router.get('/:id', async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id).populate('destinationId');
        if (!tour) {
            return res.status(404).json({ message: 'Không tìm thấy tour' });
        }
        res.json(tour);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin tour', error: error.message });
    }
});

// Tạo tour mới
router.post('/', async (req, res) => {
    try {
        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo tour', error: error.message });
    }
});

// Cập nhật tour
router.put('/:id', async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTour) {
            return res.status(404).json({ message: 'Không tìm thấy tour để cập nhật' });
        }
        res.json(updatedTour);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật tour', error: error.message });
    }
});

// Xóa tour
router.delete('/:id', async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) {
            return res.status(404).json({ message: 'Không tìm thấy tour để xóa' });
        }
        res.json({ message: 'Đã xóa tour thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tour', error: error.message });
    }
});

export default router;
