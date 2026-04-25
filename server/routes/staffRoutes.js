import express from 'express'; 
import { 
    getStaffTours, 
    createTour, 
    updateTour, 
    deleteTour,
    getStaffBookings,
    updateBookingStatus,
    getStaffCustomers,
    getStaffDashboardStats,
    getRevenueAnalytics,
    getBookingDistribution,
    getCustomerDemographics,
    getTourPerformance,
    exportAnalytics,
    getTourById,
    bulkUpdateTourStatus
} from '../controllers/staffController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// All staff routes require tour_operator role
router.use(requireAuth(['tour_operator', 'admin']));

// Dashboard stats
router.get('/dashboard/stats', getStaffDashboardStats);

// Tour management
router.get('/tours', getStaffTours);
router.get('/tours/:id', getTourById);
router.post('/tours', createTour);
router.put('/tours/:id', updateTour);
router.put('/tours/bulk-status', bulkUpdateTourStatus);
router.delete('/tours/:id', deleteTour);

// Booking management
router.get('/bookings', getStaffBookings);
router.put('/bookings/:id/status', updateBookingStatus);

// Customer management
router.get('/customers', getStaffCustomers);

// Analytics
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/bookings', getBookingDistribution);
router.get('/analytics/customers', getCustomerDemographics);
router.get('/analytics/tour-performance', getTourPerformance);
router.get('/analytics/export', exportAnalytics);

export default router;