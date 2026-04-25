import Tour from '../models/Tour.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

// Get all tours for staff (with filtering)
export const getStaffTours = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        // Build filter
        const filter = {};
        
        // Filter by status
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        // Search by title
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }
        
        // Get tours with pagination
        const tours = await Tour.find(filter)
            .populate('destinationId', 'name')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        
        // Get total count for pagination
        const total = await Tour.countDocuments(filter);
        
        res.json({
            tours,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách tour', 
            error: error.message 
        });
    }
};

// Create a new tour
export const createTour = async (req, res) => {
    try {
        const tourData = {
            ...req.body,
            createdBy: req.user.id,
            status: 'draft'
        };
        
        const newTour = new Tour(tourData);
        const savedTour = await newTour.save();
        
        res.status(201).json({
            message: 'Tạo tour thành công',
            tour: savedTour
        });
        
    } catch (error) {
        res.status(400).json({ 
            message: 'Lỗi khi tạo tour', 
            error: error.message 
        });
    }
};

// Update a tour
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const updatedTour = await Tour.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('destinationId', 'name');
        
        if (!updatedTour) {
            return res.status(404).json({ 
                message: 'Không tìm thấy tour' 
            });
        }
        
        res.json({
            message: 'Cập nhật tour thành công',
            tour: updatedTour
        });
        
    } catch (error) {
        res.status(400).json({ 
            message: 'Lỗi khi cập nhật tour', 
            error: error.message 
        });
    }
};

// Delete a tour
export const deleteTour = async (req, res) => {
    try {
        const { id } = req.params;
        
        const deletedTour = await Tour.findByIdAndDelete(id);
        
        if (!deletedTour) {
            return res.status(404).json({ 
                message: 'Không tìm thấy tour' 
            });
        }
        
        res.json({ 
            message: 'Xóa tour thành công' 
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa tour', 
            error: error.message 
        });
    }
};

// Get staff bookings
export const getStaffBookings = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        // Build filter
        const filter = {};
        
        // Filter by status
        if (status && status !== 'all') {
            filter.status = status;
        }
        
        // Search by customer name or booking reference
        if (search) {
            filter.$or = [
                { 'customerName': { $regex: search, $options: 'i' } },
                { 'bookingReference': { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get bookings with pagination
        const bookings = await Booking.find(filter)
            .populate('tourId', 'title')
            .populate('userId', 'fullName email')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        
        // Get total count for pagination
        const total = await Booking.countDocuments(filter);
        
        res.json({
            bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách booking', 
            error: error.message 
        });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status || !['confirmed', 'pending', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ 
                message: 'Trạng thái không hợp lệ' 
            });
        }
        
        const updatedBooking = await Booking.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('tourId', 'title')
         .populate('userId', 'fullName email');
        
        if (!updatedBooking) {
            return res.status(404).json({ 
                message: 'Không tìm thấy booking' 
            });
        }
        
        res.json({
            message: 'Cập nhật trạng thái booking thành công',
            booking: updatedBooking
        });
        
    } catch (error) {
        res.status(400).json({ 
            message: 'Lỗi khi cập nhật booking', 
            error: error.message 
        });
    }
};

// Get staff customers
export const getStaffCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        
        // Build filter
        const filter = { role: 'user' };
        
        // Search by name or email
        if (search) {
            filter.$or = [
                { 'fullName': { $regex: search, $options: 'i' } },
                { 'email': { $regex: search, $options: 'i' } }
            ];
        }
        
        // Get customers with pagination
        const customers = await User.find(filter)
            .select('-passwordHash -wishlist')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });
        
        // Get total count for pagination
        const total = await User.countDocuments(filter);
        
        // Get booking stats for each customer
        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const bookings = await Booking.find({ userId: customer._id });
                const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
                const lastBooking = bookings.length > 0 
                    ? bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
                    : null;
                
                return {
                    ...customer.toObject(),
                    totalBookings: bookings.length,
                    totalSpent,
                    lastBookingDate: lastBooking ? lastBooking.createdAt : null,
                    customerType: bookings.length >= 3 ? 'regular' : bookings.length > 0 ? 'new' : 'prospect'
                };
            })
        );
        
        res.json({
            customers: customersWithStats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách khách hàng', 
            error: error.message 
        });
    }
};

// Get staff dashboard statistics
export const getStaffDashboardStats = async (req, res) => {
    try {
        // Get total tours by status
        const tourStats = await Tour.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get total bookings by status
        const bookingStats = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);
        
        // Get total customers
        const totalCustomers = await User.countDocuments({ role: 'user' });
        
        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('tourId', 'title')
            .populate('userId', 'fullName')
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Get upcoming tours (active tours)
        const upcomingTours = await Tour.find({ status: 'active' })
            .populate('destinationId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);
        
        // Calculate total revenue
        const totalRevenue = bookingStats.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0);
        
        res.json({
            tourStats: tourStats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {}),
            bookingStats: bookingStats.reduce((acc, stat) => {
                acc[stat._id] = {
                    count: stat.count,
                    revenue: stat.totalAmount || 0
                };
                return acc;
            }, {}),
            totalCustomers,
            totalRevenue,
            recentBookings,
            upcomingTours
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy thống kê dashboard', 
            error: error.message 
        });
    }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                message: 'startDate và endDate là bắt buộc' 
            });
        }
        
        let dateFormat;
        switch (groupBy) {
            case 'week':
                dateFormat = { $dateToString: { format: '%Y-W%V', date: '$createdAt' } };
                break;
            case 'month':
                dateFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            default:
                dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        }
        
        const revenueData = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    status: { $nin: ['cancelled'] }
                }
            },
            {
                $group: {
                    _id: dateFormat,
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
        const averageRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;
        
        res.json({
            data: revenueData.map(item => ({
                date: item._id,
                revenue: item.revenue
            })),
            totalRevenue,
            averageRevenue: Math.round(averageRevenue * 100) / 100
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy dữ liệu doanh thu', 
            error: error.message 
        });
    }
};

// Get booking distribution analytics
export const getBookingDistribution = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                message: 'startDate và endDate là bắt buộc' 
            });
        }
        
        const bookingData = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    status: { $nin: ['cancelled'] }
                }
            },
            {
                $group: {
                    _id: '$tourId',
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { bookings: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'tours',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'tour'
                }
            },
            { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    tourId: '$_id',
                    tourName: { $ifNull: ['$tour.title', 'Unknown Tour'] },
                    bookings: 1,
                    revenue: 1
                }
            }
        ]);
        
        res.json({ data: bookingData });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy dữ liệu phân phối booking', 
            error: error.message 
        });
    }
};

// Get customer demographics analytics
export const getCustomerDemographics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                message: 'startDate và endDate là bắt buộc' 
            });
        }
        
        // Get customers who made bookings in the date range
        const customersWithBookings = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: '$userId',
                    age: { $first: '$user.age' },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Group by age ranges
        const ageGroups = {
            '18-24': 0,
            '25-34': 0,
            '35-44': 0,
            '45-54': 0,
            '55+': 0
        };
        
        customersWithBookings.forEach(customer => {
            if (customer.age) {
                if (customer.age >= 18 && customer.age <= 24) ageGroups['18-24']++;
                else if (customer.age >= 25 && customer.age <= 34) ageGroups['25-34']++;
                else if (customer.age >= 35 && customer.age <= 44) ageGroups['35-44']++;
                else if (customer.age >= 45 && customer.age <= 54) ageGroups['45-54']++;
                else if (customer.age >= 55) ageGroups['55+']++;
            }
        });
        
        const totalCustomers = Object.values(ageGroups).reduce((a, b) => a + b, 0);
        
        const data = Object.entries(ageGroups).map(([ageGroup, count]) => ({
            ageGroup,
            count,
            percentage: totalCustomers > 0 ? Math.round((count / totalCustomers) * 1000) / 10 : 0
        }));
        
        res.json({ data, totalCustomers });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy dữ liệu nhân khẩu học', 
            error: error.message 
        });
    }
};

// Get tour performance analytics
export const getTourPerformance = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        
        if (!startDate || !endDate) {
            return res.status(400).json({ 
                message: 'startDate và endDate là bắt buộc' 
            });
        }
        
        const performanceData = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    status: { $nin: ['cancelled'] }
                }
            },
            {
                $group: {
                    _id: '$tourId',
                    revenue: { $sum: '$totalAmount' },
                    bookings: { $sum: 1 },
                    avgPrice: { $avg: '$totalAmount' }
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'tours',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'tour'
                }
            },
            { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'reviews',
                    localField: '_id',
                    foreignField: 'tourId',
                    as: 'reviews'
                }
            },
            {
                $project: {
                    tourId: '$_id',
                    tourName: { $ifNull: ['$tour.title', 'Unknown Tour'] },
                    revenue: 1,
                    bookings: 1,
                    avgPrice: { $round: ['$avgPrice', 2] },
                    rating: { 
                        $ifNull: [
                            { $avg: '$reviews.rating' },
                            0
                        ]
                    }
                }
            }
        ]);
        
        res.json({ data: performanceData });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy dữ liệu hiệu suất tour', 
            error: error.message 
        });
    }
};

// Export analytics data
export const exportAnalytics = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        
        if (!type || !startDate || !endDate) {
            return res.status(400).json({ 
                message: 'type, startDate và endDate là bắt buộc' 
            });
        }
        
        const validTypes = ['revenue', 'bookings', 'customers', 'performance'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ 
                message: 'Loại báo cáo không hợp lệ' 
            });
        }
        
        let csvContent = '';
        let filename = '';
        
        switch (type) {
            case 'revenue': {
                const revenueData = await Booking.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },
                            status: { $nin: ['cancelled'] }
                        }
                    },
                    {
                        $group: {
                            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                            revenue: { $sum: '$totalAmount' }
                        }
                    },
                    { $sort: { _id: 1 } }
                ]);
                csvContent = 'date,revenue\n';
                csvContent += revenueData.map(item => `${item._id},${item.revenue}`).join('\n');
                filename = `revenue_report_${startDate}_${endDate}.csv`;
                break;
            }
            case 'bookings': {
                const bookingData = await Booking.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$tourId',
                            bookings: { $sum: 1 },
                            revenue: { $sum: '$totalAmount' }
                        }
                    },
                    { $sort: { bookings: -1 } },
                    { $limit: 50 },
                    {
                        $lookup: {
                            from: 'tours',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'tour'
                        }
                    },
                    { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } }
                ]);
                csvContent = 'tourId,tourName,bookings,revenue\n';
                csvContent += bookingData.map(item => 
                    `${item._id},"${item.tour?.title || 'Unknown'}",${item.bookings},${item.revenue}`
                ).join('\n');
                filename = `bookings_report_${startDate}_${endDate}.csv`;
                break;
            }
            case 'customers': {
                const customerData = await User.find({ role: 'user' })
                    .select('fullName email createdAt')
                    .limit(100);
                csvContent = 'name,email,joinDate\n';
                csvContent += customerData.map(item => 
                    `"${item.fullName}",${item.email},${item.createdAt.toISOString().split('T')[0]}`
                ).join('\n');
                filename = `customers_report_${startDate}_${endDate}.csv`;
                break;
            }
            case 'performance': {
                const perfData = await Booking.aggregate([
                    {
                        $match: {
                            createdAt: {
                                $gte: new Date(startDate),
                                $lte: new Date(endDate)
                            },
                            status: { $nin: ['cancelled'] }
                        }
                    },
                    {
                        $group: {
                            _id: '$tourId',
                            revenue: { $sum: '$totalAmount' },
                            bookings: { $sum: 1 }
                        }
                    },
                    { $sort: { revenue: -1 } },
                    { $limit: 50 },
                    {
                        $lookup: {
                            from: 'tours',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'tour'
                        }
                    },
                    { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } }
                ]);
                csvContent = 'tourId,tourName,revenue,bookings\n';
                csvContent += perfData.map(item => 
                    `${item._id},"${item.tour?.title || 'Unknown'}",${item.revenue},${item.bookings}`
                ).join('\n');
                filename = `performance_report_${startDate}_${endDate}.csv`;
                break;
            }
        }
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csvContent);
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xuất dữ liệu', 
            error: error.message 
        });
    }
};

// Get single tour by ID
export const getTourById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const tour = await Tour.findById(id).populate('destinationId', 'name');
        
        if (!tour) {
            return res.status(404).json({ 
                message: 'Không tìm thấy tour' 
            });
        }
        
        res.json({ tour });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy chi tiết tour', 
            error: error.message 
        });
    }
};

// Bulk update tour status
export const bulkUpdateTourStatus = async (req, res) => {
    try {
        const { tourIds, status } = req.body;
        
        if (!tourIds || !Array.isArray(tourIds) || tourIds.length === 0) {
            return res.status(400).json({ 
                message: 'Danh sách tourIds không hợp lệ' 
            });
        }
        
        const validStatuses = ['draft', 'active', 'archived'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Trạng thái không hợp lệ' 
            });
        }
        
        const errors = [];
        let successCount = 0;
        
        for (const tourId of tourIds) {
            try {
                const tour = await Tour.findByIdAndUpdate(
                    tourId,
                    { status },
                    { new: true }
                );
                
                if (tour) {
                    successCount++;
                } else {
                    errors.push({
                        tourId,
                        error: 'Tour not found'
                    });
                }
            } catch (err) {
                errors.push({
                    tourId,
                    error: err.message
                });
            }
        }
        
        res.json({
            success: successCount,
            failed: errors.length,
            errors
        });
        
    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi cập nhật trạng thái hàng loạt', 
            error: error.message 
        });
    }
};