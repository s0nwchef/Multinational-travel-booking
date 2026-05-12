import express from 'express';
import {
    getAllTours,
    getTourById,
    createTour,
    updateTour,
    deleteTour,
    getTourSchedules
} from '../controllers/tourController.js';

const router = express.Router();

router.get('/', getAllTours);
router.get('/:id', getTourById);
router.get('/:tourId/schedules', getTourSchedules);
router.post('/', createTour);
router.put('/:id', updateTour);
router.delete('/:id', deleteTour);

export default router;
