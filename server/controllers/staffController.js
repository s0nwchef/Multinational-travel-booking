import TourVi from '../models/TourVi.js';
import DatTour from '../models/DatTour.js';
import NguoiDung from '../models/NguoiDung.js';
import DiemDen from '../models/DiemDen.js';

// Get all tours for staff (with filtering)
export const getStaffTours = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (status && status !== 'all') filter.trang_thai = status;
        if (search) filter.ten_tour = { $regex: search, $options: 'i' };

        const tours = await TourVi.find(filter)
            .populate('id_diem_den', 'quoc_gia thanh_pho')
            .skip(skip).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await TourVi.countDocuments(filter);

        res.json({
            tours,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách tour', error: error.message });
    }
};

// Create a new tour
export const createTour = async (req, res) => {
    try {
        const tourData = {
            ten_tour: req.body.ten_tour || req.body.title || '',
            mo_ta: req.body.mo_ta || req.body.description || '',
            so_ngay: req.body.so_ngay || req.body.duration || 1,
            so_dem: req.body.so_dem || Math.max((req.body.so_ngay || req.body.duration || 1) - 1, 0),
            gia_nguoi_lon: req.body.gia_nguoi_lon || req.body.basePrice || 0,
            gia_tre_em: req.body.gia_tre_em || Math.round((req.body.gia_nguoi_lon || req.body.basePrice || 0) * 0.7),
            trang_thai: 'inactive',
            danh_sach_anh: req.body.danh_sach_anh || req.body.images || [],
            anh_dai_dien: req.body.anh_dai_dien || (req.body.images && req.body.images[0]) || '',
            lich_trinh: req.body.lich_trinh || (req.body.itinerary || []).map((item, i) => ({
                ngay: item.day || i + 1, tieu_de: item.activity || `Ngày ${i + 1}`,
                mo_ta: item.activity || '', bua_an: [], khach_san: ''
            })),
            bao_gom: req.body.bao_gom || req.body.included || [],
            khong_bao_gom: req.body.khong_bao_gom || req.body.excluded || [],
            chinh_sach_huy: req.body.chinh_sach_huy || ''
        };

        // Handle destination
        if (req.body.id_diem_den) {
            tourData.id_diem_den = req.body.id_diem_den;
        } else if (req.body.destinationName) {
            let dest = await DiemDen.findOne({ quoc_gia: { $regex: new RegExp(`^${req.body.destinationName}$`, 'i') } });
            if (!dest) {
                dest = await DiemDen.create({
                    quoc_gia: req.body.destinationName, ma_quoc_gia: req.body.destinationName.substring(0, 2).toUpperCase(),
                    chau_luc: 'Khác'
                });
            }
            tourData.id_diem_den = dest._id;
        }

        const newTour = new TourVi(tourData);
        const savedTour = await newTour.save();
        res.status(201).json({ message: 'Tạo tour thành công', tour: savedTour });
    } catch (error) {
        console.error('Create tour error:', error);
        res.status(400).json({ message: 'Lỗi khi tạo tour', error: error.message });
    }
};

// Update a tour
export const updateTour = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Map English field names to Vietnamese if sent from frontend
        if (updateData.title && !updateData.ten_tour) updateData.ten_tour = updateData.title;
        if (updateData.description && !updateData.mo_ta) updateData.mo_ta = updateData.description;
        if (updateData.basePrice && !updateData.gia_nguoi_lon) updateData.gia_nguoi_lon = updateData.basePrice;
        if (updateData.duration && !updateData.so_ngay) updateData.so_ngay = updateData.duration;
        if (updateData.status && !updateData.trang_thai) updateData.trang_thai = updateData.status;
        // Clean English keys
        delete updateData.title; delete updateData.description; delete updateData.basePrice;
        delete updateData.duration; delete updateData.status;

        if (updateData.destinationName) {
            let dest = await DiemDen.findOne({ quoc_gia: updateData.destinationName });
            if (!dest) {
                dest = await DiemDen.create({
                    quoc_gia: updateData.destinationName, ma_quoc_gia: updateData.destinationName.substring(0, 2).toUpperCase(),
                    chau_luc: 'Khác'
                });
            }
            updateData.id_diem_den = dest._id;
            delete updateData.destinationName;
        }

        const updatedTour = await TourVi.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
            .populate('id_diem_den', 'quoc_gia thanh_pho');
        if (!updatedTour) return res.status(404).json({ message: 'Không tìm thấy tour' });
        res.json({ message: 'Cập nhật tour thành công', tour: updatedTour });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật tour', error: error.message });
    }
};

// Delete a tour
export const deleteTour = async (req, res) => {
    try {
        const deletedTour = await TourVi.findByIdAndDelete(req.params.id);
        if (!deletedTour) return res.status(404).json({ message: 'Không tìm thấy tour' });
        res.json({ message: 'Xóa tour thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xóa tour', error: error.message });
    }
};

// Get staff bookings
export const getStaffBookings = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const filter = {};
        if (status && status !== 'all') filter.trang_thai = status;
        if (search) {
            filter.$or = [
                { 'thong_tin_lien_he.ho_ten': { $regex: search, $options: 'i' } },
                { ma_dat_tour: { $regex: search, $options: 'i' } }
            ];
        }

        const bookings = await DatTour.find(filter)
            .populate('id_tour', 'ten_tour')
            .populate('id_nguoi_dung', 'ho_ten email')
            .skip(skip).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await DatTour.countDocuments(filter);

        res.json({
            bookings,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách booking', error: error.message });
    }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !['confirmed', 'pending', 'cancelled', 'completed'].includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }
        const updatedBooking = await DatTour.findByIdAndUpdate(id, { trang_thai: status }, { new: true })
            .populate('id_tour', 'ten_tour').populate('id_nguoi_dung', 'ho_ten email');
        if (!updatedBooking) return res.status(404).json({ message: 'Không tìm thấy booking' });
        res.json({ message: 'Cập nhật trạng thái booking thành công', booking: updatedBooking });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi khi cập nhật booking', error: error.message });
    }
};

// Get staff customers
export const getStaffCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;
        const filter = { vai_tro: 'user' };
        if (search) {
            filter.$or = [
                { ho_ten: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const customers = await NguoiDung.find(filter)
            .skip(skip).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await NguoiDung.countDocuments(filter);

        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const bookings = await DatTour.find({ id_nguoi_dung: customer._id });
                const totalSpent = bookings.reduce((sum, b) => sum + (b.tong_tien_cuoi || 0), 0);
                const lastBooking = bookings.length > 0
                    ? bookings.sort((a, b) => new Date(b.ngay_tao) - new Date(a.ngay_tao))[0] : null;
                return {
                    ...customer.toObject(),
                    fullName: customer.ho_ten,
                    role: customer.vai_tro,
                    totalBookings: bookings.length,
                    totalSpent,
                    lastBookingDate: lastBooking ? lastBooking.ngay_tao : null,
                    customerType: bookings.length >= 3 ? 'regular' : bookings.length > 0 ? 'new' : 'prospect'
                };
            })
        );

        res.json({
            customers: customersWithStats,
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: error.message });
    }
};

// Get staff dashboard statistics
export const getStaffDashboardStats = async (req, res) => {
    try {
        const tourStats = await TourVi.aggregate([{ $group: { _id: '$trang_thai', count: { $sum: 1 } } }]);
        const bookingStats = await DatTour.aggregate([
            { $group: { _id: '$trang_thai', count: { $sum: 1 }, totalAmount: { $sum: '$tong_tien_cuoi' } } }
        ]);
        const totalCustomers = await NguoiDung.countDocuments({ vai_tro: 'user' });
        const recentBookings = await DatTour.find()
            .populate('id_tour', 'ten_tour').populate('id_nguoi_dung', 'ho_ten')
            .sort({ ngay_tao: -1 }).limit(5);
        const upcomingTours = await TourVi.find({ trang_thai: 'active' })
            .populate('id_diem_den', 'quoc_gia').sort({ ngay_tao: -1 }).limit(5);
        const totalRevenue = bookingStats.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0);

        res.json({
            tourStats: tourStats.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
            bookingStats: bookingStats.reduce((acc, s) => { acc[s._id] = { count: s.count, revenue: s.totalAmount || 0 }; return acc; }, {}),
            totalCustomers, totalRevenue, recentBookings, upcomingTours
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thống kê dashboard', error: error.message });
    }
};

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        if (!startDate || !endDate) return res.status(400).json({ message: 'startDate và endDate là bắt buộc' });

        let dateFormat;
        switch (groupBy) {
            case 'week': dateFormat = { $dateToString: { format: '%Y-W%V', date: '$ngay_tao' } }; break;
            case 'month': dateFormat = { $dateToString: { format: '%Y-%m', date: '$ngay_tao' } }; break;
            default: dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$ngay_tao' } };
        }

        const revenueData = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
            { $group: { _id: dateFormat, revenue: { $sum: '$tong_tien_cuoi' } } },
            { $sort: { _id: 1 } }
        ]);
        const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
        const averageRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;

        res.json({
            data: revenueData.map(item => ({ date: item._id, revenue: item.revenue })),
            totalRevenue, averageRevenue: Math.round(averageRevenue * 100) / 100
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu doanh thu', error: error.message });
    }
};

// Get booking distribution analytics
export const getBookingDistribution = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        if (!startDate || !endDate) return res.status(400).json({ message: 'startDate và endDate là bắt buộc' });

        const bookingData = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
            { $group: { _id: '$id_tour', bookings: { $sum: 1 }, revenue: { $sum: '$tong_tien_cuoi' } } },
            { $sort: { bookings: -1 } }, { $limit: parseInt(limit) },
            { $lookup: { from: 'tour', localField: '_id', foreignField: '_id', as: 'tour' } },
            { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
            { $project: { tourId: '$_id', tourName: { $ifNull: ['$tour.ten_tour', 'Unknown Tour'] }, bookings: 1, revenue: 1 } }
        ]);
        res.json({ data: bookingData });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu phân phối booking', error: error.message });
    }
};

// Get customer demographics analytics
export const getCustomerDemographics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) return res.status(400).json({ message: 'startDate và endDate là bắt buộc' });

        const customersWithBookings = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
            { $lookup: { from: 'nguoi_dung', localField: 'id_nguoi_dung', foreignField: '_id', as: 'user' } },
            { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
            { $group: { _id: '$id_nguoi_dung', ngay_sinh: { $first: '$user.ngay_sinh' }, count: { $sum: 1 } } }
        ]);

        const ageGroups = { '18-24': 0, '25-34': 0, '35-44': 0, '45-54': 0, '55+': 0 };
        const now = new Date();
        customersWithBookings.forEach(c => {
            if (c.ngay_sinh) {
                const age = Math.floor((now - new Date(c.ngay_sinh)) / (365.25 * 24 * 60 * 60 * 1000));
                if (age >= 18 && age <= 24) ageGroups['18-24']++;
                else if (age >= 25 && age <= 34) ageGroups['25-34']++;
                else if (age >= 35 && age <= 44) ageGroups['35-44']++;
                else if (age >= 45 && age <= 54) ageGroups['45-54']++;
                else if (age >= 55) ageGroups['55+']++;
            }
        });
        const totalCustomers = Object.values(ageGroups).reduce((a, b) => a + b, 0);
        const data = Object.entries(ageGroups).map(([ageGroup, count]) => ({
            ageGroup, count, percentage: totalCustomers > 0 ? Math.round((count / totalCustomers) * 1000) / 10 : 0
        }));
        res.json({ data, totalCustomers });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu nhân khẩu học', error: error.message });
    }
};

// Get tour performance analytics
export const getTourPerformance = async (req, res) => {
    try {
        const { startDate, endDate, limit = 10 } = req.query;
        if (!startDate || !endDate) return res.status(400).json({ message: 'startDate và endDate là bắt buộc' });

        const performanceData = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
            { $group: { _id: '$id_tour', revenue: { $sum: '$tong_tien_cuoi' }, bookings: { $sum: 1 }, avgPrice: { $avg: '$tong_tien_cuoi' } } },
            { $sort: { revenue: -1 } }, { $limit: parseInt(limit) },
            { $lookup: { from: 'tour', localField: '_id', foreignField: '_id', as: 'tour' } },
            { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
            { $lookup: { from: 'danh_gia', localField: '_id', foreignField: 'id_tour', as: 'reviews' } },
            { $project: {
                tourId: '$_id', tourName: { $ifNull: ['$tour.ten_tour', 'Unknown Tour'] },
                revenue: 1, bookings: 1, avgPrice: { $round: ['$avgPrice', 2] },
                rating: { $ifNull: [{ $avg: '$reviews.diem' }, 0] }
            }}
        ]);
        res.json({ data: performanceData });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy dữ liệu hiệu suất tour', error: error.message });
    }
};

// Export analytics data
export const exportAnalytics = async (req, res) => {
    try {
        const { type, startDate, endDate } = req.query;
        if (!type || !startDate || !endDate) return res.status(400).json({ message: 'type, startDate và endDate là bắt buộc' });
        const validTypes = ['revenue', 'bookings', 'customers', 'performance'];
        if (!validTypes.includes(type)) return res.status(400).json({ message: 'Loại báo cáo không hợp lệ' });

        let csvContent = '', filename = '';
        switch (type) {
            case 'revenue': {
                const data = await DatTour.aggregate([
                    { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
                    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$ngay_tao' } }, revenue: { $sum: '$tong_tien_cuoi' } } },
                    { $sort: { _id: 1 } }
                ]);
                csvContent = 'date,revenue\n' + data.map(i => `${i._id},${i.revenue}`).join('\n');
                filename = `revenue_report_${startDate}_${endDate}.csv`;
                break;
            }
            case 'bookings': {
                const data = await DatTour.aggregate([
                    { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) } } },
                    { $group: { _id: '$id_tour', bookings: { $sum: 1 }, revenue: { $sum: '$tong_tien_cuoi' } } },
                    { $sort: { bookings: -1 } }, { $limit: 50 },
                    { $lookup: { from: 'tour', localField: '_id', foreignField: '_id', as: 'tour' } },
                    { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } }
                ]);
                csvContent = 'tourId,tourName,bookings,revenue\n' + data.map(i =>
                    `${i._id},"${i.tour?.ten_tour || 'Unknown'}",${i.bookings},${i.revenue}`).join('\n');
                filename = `bookings_report_${startDate}_${endDate}.csv`;
                break;
            }
            case 'customers': {
                const data = await NguoiDung.find({ vai_tro: 'user' }).limit(100);
                csvContent = 'name,email,joinDate\n' + data.map(i =>
                    `"${i.ho_ten}",${i.email},${i.ngay_tao?.toISOString().split('T')[0] || ''}`).join('\n');
                filename = `customers_report_${startDate}_${endDate}.csv`;
                break;
            }
            case 'performance': {
                const data = await DatTour.aggregate([
                    { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
                    { $group: { _id: '$id_tour', revenue: { $sum: '$tong_tien_cuoi' }, bookings: { $sum: 1 } } },
                    { $sort: { revenue: -1 } }, { $limit: 50 },
                    { $lookup: { from: 'tour', localField: '_id', foreignField: '_id', as: 'tour' } },
                    { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } }
                ]);
                csvContent = 'tourId,tourName,revenue,bookings\n' + data.map(i =>
                    `${i._id},"${i.tour?.ten_tour || 'Unknown'}",${i.revenue},${i.bookings}`).join('\n');
                filename = `performance_report_${startDate}_${endDate}.csv`;
                break;
            }
        }
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi xuất dữ liệu', error: error.message });
    }
};

// Get single tour by ID
export const getTourById = async (req, res) => {
    try {
        const tour = await TourVi.findById(req.params.id).populate('id_diem_den', 'quoc_gia thanh_pho');
        if (!tour) return res.status(404).json({ message: 'Không tìm thấy tour' });
        res.json({ tour });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy chi tiết tour', error: error.message });
    }
};

// Bulk update tour status
export const bulkUpdateTourStatus = async (req, res) => {
    try {
        const { tourIds, status } = req.body;
        if (!tourIds || !Array.isArray(tourIds) || tourIds.length === 0) {
            return res.status(400).json({ message: 'Danh sách tourIds không hợp lệ' });
        }
        const validStatuses = ['active', 'inactive', 'soldout'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }
        const errors = [];
        let successCount = 0;
        for (const tourId of tourIds) {
            try {
                const tour = await TourVi.findByIdAndUpdate(tourId, { trang_thai: status }, { new: true });
                if (tour) successCount++;
                else errors.push({ tourId, error: 'Tour not found' });
            } catch (err) {
                errors.push({ tourId, error: err.message });
            }
        }
        res.json({ success: successCount, failed: errors.length, errors });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái hàng loạt', error: error.message });
    }
};