import express from 'express';
import { 
    searchFlights,
    getFlightById,
    getFlightSeatMap,
    reserveSeats,
    releaseSeats,
    getAllFlights,
    createFlight,
    updateFlight,
    deleteFlight
} from '../controllers/flightController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (anyone can search flights)
router.get('/search', searchFlights);
router.get('/', getAllFlights);
router.get('/:id', getFlightById);
router.get('/:id/seats', getFlightSeatMap);

// Protected routes (require login for booking)
router.post('/:id/seats/reserve', requireAuth(), reserveSeats);
router.post('/:id/seats/release', requireAuth(), releaseSeats);

// Admin routes (require admin role)
router.post('/', requireAuth(['admin']), createFlight);
router.put('/:id', requireAuth(['admin']), updateFlight);
router.delete('/:id', requireAuth(['admin']), deleteFlight);

export default router;