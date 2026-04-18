import express from 'express';
import Destination from '../models/Destination.js';

const router = express.Router();

// Lấy danh sách tất cả điểm đến
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find();
        res.json(destinations);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách điểm đến', error: error.message });
    }
});

// Lấy chi tiết một điểm đến
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id);
        if (!destination) {
            return res.status(404).json({ message: 'Không tìm thấy điểm đến' });
        }
        res.json(destination);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin điểm đến', error: error.message });
    }
});

// Tạo điểm đến mới
router.post('/', async (req, res) => {
    try {
        const newDestination = new Destination(req.body);
        const savedDestination = await newDestination.save();
        res.status(201).json(savedDestination);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo điểm đến', error: error.message });
    }
});

export default router;
