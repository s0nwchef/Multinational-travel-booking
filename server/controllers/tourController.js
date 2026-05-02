import Tour from '../models/Tour.js';
import mongoose from 'mongoose';

export const getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find().populate('destinationId');
        res.json(tours);
    } catch (error) {
        console.error('getAllTours error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tour', error: error.message });
    }
};

export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'ID tour không hợp lệ' });
        }
        
        const tour = await Tour.findById(id).populate('destinationId');
        if (!tour) {
            return res.status(404).json({ message: 'Không tìm thấy tour' });
        }
        res.json(tour);
    } catch (error) {
        console.error('getTourById error:', error);
        res.status(500).json({ message: 'Lỗi khi lấy thông tin tour', error: error.message });
    }
};

export const createTour = async (req, res) => {
    try {
        const newTour = new Tour(req.body);
        const savedTour = await newTour.save();
        res.status(201).json(savedTour);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi tạo tour', error: error.message });
    }
};

export const updateTour = async (req, res) => {
    try {
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTour) {
            return res.status(404).json({ message: 'Không tìm thấy tour để cập nhật' });
        }
        res.json(updatedTour);
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật tour', error: error.message });
    }
};

export const deleteTour = async (req, res) => {
    try {
        const deletedTour = await Tour.findByIdAndDelete(req.params.id);
        if (!deletedTour) {
            return res.status(404).json({ message: 'Không tìm thấy tour để xóa' });
        }
        res.json({ message: 'Đã xóa tour thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tour', error: error.message });
    }
};
