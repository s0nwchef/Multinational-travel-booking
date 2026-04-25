import request from 'supertest';
import express from 'express';
import staffRoutes from './staffRoutes.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getStaffDashboardStats } from '../controllers/staffController.js';

// Mock the auth middleware
jest.mock('../middleware/authMiddleware.js', () => ({
    requireAuth: jest.fn()
}));

// Mock the controllers
jest.mock('../controllers/staffController.js', () => ({
    getStaffDashboardStats: jest.fn(),
    getStaffTours: jest.fn(),
    createTour: jest.fn(),
    updateTour: jest.fn(),
    deleteTour: jest.fn(),
    getStaffBookings: jest.fn(),
    updateBookingStatus: jest.fn(),
    getStaffCustomers: jest.fn()
}));

describe('Staff Routes - Role-Based Access Control', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/staff', staffRoutes);
        
        // Reset all mocks
        jest.clearAllMocks();
    });

    describe('Authentication and Authorization', () => {
        it('should apply requireAuth middleware to all staff routes', () => {
            // The requireAuth middleware should be called when setting up routes
            // We can verify this by checking that the middleware is applied
            expect(requireAuth).toHaveBeenCalledWith(['tour_operator', 'admin']);
        });

        it('should reject unauthenticated requests to staff routes', async () => {
            // Mock requireAuth to simulate unauthenticated request
            requireAuth.mockImplementation(() => (req, res, next) => {
                res.status(401).json({ message: 'Unauthorized' });
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(401);

            expect(response.body.message).toBe('Unauthorized');
        });

        it('should reject authenticated user without tour_operator or admin role', async () => {
            // Mock requireAuth to simulate authenticated but unauthorized user
            requireAuth.mockImplementation(() => (req, res, next) => {
                // Simulate user with role 'user' (not tour_operator or admin)
                req.user = { role: 'user' };
                res.status(403).json({ message: 'Forbidden' });
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(403);

            expect(response.body.message).toBe('Forbidden');
        });

        it('should allow tour_operator access to staff routes', async () => {
            // Mock requireAuth to allow tour_operator
            requireAuth.mockImplementation(() => (req, res, next) => {
                req.user = { role: 'tour_operator', id: 'operator123' };
                next();
            });

            // Mock controller to return success
            getStaffDashboardStats.mockImplementation((req, res) => {
                res.json({ message: 'Success' });
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(200);

            expect(response.body.message).toBe('Success');
        });

        it('should allow admin access to staff routes', async () => {
            // Mock requireAuth to allow admin
            requireAuth.mockImplementation(() => (req, res, next) => {
                req.user = { role: 'admin', id: 'admin123' };
                next();
            });

            // Mock controller to return success
            getStaffDashboardStats.mockImplementation((req, res) => {
                res.json({ message: 'Success' });
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(200);

            expect(response.body.message).toBe('Success');
        });
    });

    describe('Route Protection Verification', () => {
        beforeEach(() => {
            // Mock requireAuth to allow access for these tests
            requireAuth.mockImplementation(() => (req, res, next) => {
                req.user = { role: 'tour_operator', id: 'operator123' };
                next();
            });
        });

        it('should protect dashboard stats route', async () => {
            getStaffDashboardStats.mockImplementation((req, res) => {
                res.json({ stats: 'dashboard data' });
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(200);

            expect(response.body.stats).toBe('dashboard data');
            expect(getStaffDashboardStats).toHaveBeenCalled();
        });

        it('should protect tour management routes', async () => {
            const mockGetStaffTours = require('../controllers/staffController.js').getStaffTours;
            mockGetStaffTours.mockImplementation((req, res) => {
                res.json({ tours: [] });
            });

            const response = await request(app)
                .get('/api/staff/tours')
                .expect(200);

            expect(mockGetStaffTours).toHaveBeenCalled();
        });

        it('should protect booking management routes', async () => {
            const mockGetStaffBookings = require('../controllers/staffController.js').getStaffBookings;
            mockGetStaffBookings.mockImplementation((req, res) => {
                res.json({ bookings: [] });
            });

            const response = await request(app)
                .get('/api/staff/bookings')
                .expect(200);

            expect(mockGetStaffBookings).toHaveBeenCalled();
        });

        it('should protect customer management routes', async () => {
            const mockGetStaffCustomers = require('../controllers/staffController.js').getStaffCustomers;
            mockGetStaffCustomers.mockImplementation((req, res) => {
                res.json({ customers: [] });
            });

            const response = await request(app)
                .get('/api/staff/customers')
                .expect(200);

            expect(mockGetStaffCustomers).toHaveBeenCalled();
        });

        it('should protect tour creation route', async () => {
            const mockCreateTour = require('../controllers/staffController.js').createTour;
            mockCreateTour.mockImplementation((req, res) => {
                res.status(201).json({ message: 'Tour created' });
            });

            const response = await request(app)
                .post('/api/staff/tours')
                .send({ title: 'New Tour' })
                .expect(201);

            expect(mockCreateTour).toHaveBeenCalled();
        });

        it('should protect tour update route', async () => {
            const mockUpdateTour = require('../controllers/staffController.js').updateTour;
            mockUpdateTour.mockImplementation((req, res) => {
                res.json({ message: 'Tour updated' });
            });

            const response = await request(app)
                .put('/api/staff/tours/123')
                .send({ title: 'Updated Tour' })
                .expect(200);

            expect(mockUpdateTour).toHaveBeenCalled();
        });

        it('should protect tour deletion route', async () => {
            const mockDeleteTour = require('../controllers/staffController.js').deleteTour;
            mockDeleteTour.mockImplementation((req, res) => {
                res.json({ message: 'Tour deleted' });
            });

            const response = await request(app)
                .delete('/api/staff/tours/123')
                .expect(200);

            expect(mockDeleteTour).toHaveBeenCalled();
        });

        it('should protect booking status update route', async () => {
            const mockUpdateBookingStatus = require('../controllers/staffController.js').updateBookingStatus;
            mockUpdateBookingStatus.mockImplementation((req, res) => {
                res.json({ message: 'Booking status updated' });
            });

            const response = await request(app)
                .put('/api/staff/bookings/123/status')
                .send({ status: 'confirmed' })
                .expect(200);

            expect(mockUpdateBookingStatus).toHaveBeenCalled();
        });
    });

    describe('Error Handling', () => {
        beforeEach(() => {
            // Mock requireAuth to allow access for error handling tests
            requireAuth.mockImplementation(() => (req, res, next) => {
                req.user = { role: 'tour_operator', id: 'operator123' };
                next();
            });
        });

        it('should handle controller errors gracefully', async () => {
            getStaffDashboardStats.mockImplementation((req, res) => {
                res.status(500).json({ 
                    message: 'Lỗi khi lấy thống kê dashboard',
                    error: 'Database error'
                });
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(500);

            expect(response.body.message).toBe('Lỗi khi lấy thống kê dashboard');
            expect(response.body.error).toBe('Database error');
        });

        it('should handle invalid tour ID in update', async () => {
            const mockUpdateTour = require('../controllers/staffController.js').updateTour;
            mockUpdateTour.mockImplementation((req, res) => {
                res.status(404).json({ 
                    message: 'Không tìm thấy tour' 
                });
            });

            const response = await request(app)
                .put('/api/staff/tours/invalid-id')
                .send({ title: 'Updated Tour' })
                .expect(404);

            expect(response.body.message).toBe('Không tìm thấy tour');
        });

        it('should handle invalid booking status', async () => {
            const mockUpdateBookingStatus = require('../controllers/staffController.js').updateBookingStatus;
            mockUpdateBookingStatus.mockImplementation((req, res) => {
                res.status(400).json({ 
                    message: 'Trạng thái không hợp lệ' 
                });
            });

            const response = await request(app)
                .put('/api/staff/bookings/123/status')
                .send({ status: 'invalid-status' })
                .expect(400);

            expect(response.body.message).toBe('Trạng thái không hợp lệ');
        });

        it('should handle database connection errors', async () => {
            getStaffDashboardStats.mockImplementation((req, res) => {
                throw new Error('Database connection failed');
            });

            const response = await request(app)
                .get('/api/staff/dashboard/stats')
                .expect(500);

            expect(response.body.message).toBe('Lỗi khi lấy thống kê dashboard');
            expect(response.body.error).toBe('Database connection failed');
        });
    });

    describe('Request Validation', () => {
        beforeEach(() => {
            // Mock requireAuth to allow access
            requireAuth.mockImplementation(() => (req, res, next) => {
                req.user = { role: 'tour_operator', id: 'operator123' };
                next();
            });
        });

        it('should validate pagination parameters', async () => {
            const mockGetStaffTours = require('../controllers/staffController.js').getStaffTours;
            mockGetStaffTours.mockImplementation((req, res) => {
                // Check that pagination params are parsed correctly
                expect(req.query.page).toBe('2');
                expect(req.query.limit).toBe('20');
                res.json({ tours: [], pagination: {} });
            });

            await request(app)
                .get('/api/staff/tours?page=2&limit=20')
                .expect(200);

            expect(mockGetStaffTours).toHaveBeenCalled();
        });

        it('should validate search parameters', async () => {
            const mockGetStaffTours = require('../controllers/staffController.js').getStaffTours;
            mockGetStaffTours.mockImplementation((req, res) => {
                expect(req.query.search).toBe('beach');
                res.json({ tours: [], pagination: {} });
            });

            await request(app)
                .get('/api/staff/tours?search=beach')
                .expect(200);

            expect(mockGetStaffTours).toHaveBeenCalled();
        });

        it('should validate status filter parameters', async () => {
            const mockGetStaffTours = require('../controllers/staffController.js').getStaffTours;
            mockGetStaffTours.mockImplementation((req, res) => {
                expect(req.query.status).toBe('active');
                res.json({ tours: [], pagination: {} });
            });

            await request(app)
                .get('/api/staff/tours?status=active')
                .expect(200);

            expect(mockGetStaffTours).toHaveBeenCalled();
        });
    });
});