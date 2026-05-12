import TourVi from '../models/TourVi.js';
import DatTour from '../models/DatTour.js';
import NguoiDung from '../models/NguoiDung.js';
import DiemDen from '../models/DiemDen.js';

const mapTour = (tour) => {
    const obj = tour.toObject ? tour.toObject() : tour;
    return {
        ...obj,
        id: obj._id,
        title: obj.ten_tour,
        description: obj.mo_ta,
        basePrice: obj.gia_nguoi_lon,
        duration: obj.so_ngay,
        status: obj.trang_thai,
        images: obj.danh_sach_anh,
        averageRating: obj.diem_trung_binh,
        createdAt: obj.ngay_tao,
        destinationId: obj.id_diem_den ? {
            _id: obj.id_diem_den._id,
            name: obj.id_diem_den.thanh_pho || obj.id_diem_den.quoc_gia
        } : null,
        destination: obj.id_diem_den ? (obj.id_diem_den.thanh_pho || obj.id_diem_den.quoc_gia) : '-'
    };
};

const mapBooking = (booking) => {
    const obj = booking.toObject ? booking.toObject() : booking;
    return {
        ...obj,
        id: obj._id,
        bookingNumber: obj.ma_dat_tour,
        bookingCode: obj.ma_dat_tour,
        status: obj.trang_thai,
        paymentStatus: obj.trang_thai_thanh_toan,
        totalAmount: obj.tong_tien_cuoi,
        grandTotal: obj.tong_tien_cuoi,
        createdAt: obj.ngay_tao,
        bookingDate: obj.ngay_tao,
        customerName: obj.thong_tin_lien_he?.ho_ten || obj.id_nguoi_dung?.ho_ten || 'Unknown',
        customerEmail: obj.thong_tin_lien_he?.email || obj.id_nguoi_dung?.email || '-',
        tourName: obj.id_tour?.ten_tour || 'Unknown Tour',
        numberOfTravelers: (obj.so_nguoi_lon || 0) + (obj.so_tre_em || 0),
        userId: obj.id_nguoi_dung ? {
            _id: obj.id_nguoi_dung._id,
            email: obj.id_nguoi_dung.email,
            fullName: obj.id_nguoi_dung.ho_ten
        } : null,
        tourId: obj.id_tour ? {
            _id: obj.id_tour._id,
            title: obj.id_tour.ten_tour
        } : null
    };
};

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
            tours: tours.map(mapTour),
            pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi', error: error.message });
    }
};

export const createTour = async (req, res) => {
    try {
        const tourData = {
            ten_tour: req.body.title || req.body.ten_tour || '',
            mo_ta: req.body.description || req.body.mo_ta || '',
            so_ngay: req.body.duration || req.body.so_ngay || 1,
            so_dem: Math.max((req.body.duration || req.body.so_ngay || 1) - 1, 0),
            gia_nguoi_lon: req.body.basePrice || req.body.gia_nguoi_lon || 0,
            gia_tre_em: Math.round((req.body.basePrice || 0) * 0.7),
            trang_thai: req.body.status || 'inactive',
            danh_sach_anh: req.body.images || [],
            anh_dai_dien: (req.body.images && req.body.images[0]) || '',
            lich_trinh: (req.body.itinerary || []).map((item, i) => ({
                ngay: item.day || i + 1, tieu_de: item.activity || `Ngày ${i + 1}`, mo_ta: item.activity || ''
            })),
            bao_gom: req.body.included || [],
            khong_bao_gom: req.body.excluded || []
        };

        if (req.body.destinationId) {
            tourData.id_diem_den = req.body.destinationId;
        } else if (req.body.destinationName) {
            let dest = await DiemDen.findOne({ quoc_gia: { $regex: new RegExp(`^${req.body.destinationName}$`, 'i') } });
            if (!dest) {
                dest = await DiemDen.create({ quoc_gia: req.body.destinationName, ma_quoc_gia: 'XX', chau_luc: 'Khác' });
            }
            tourData.id_diem_den = dest._id;
        }

        const newTour = new TourVi(tourData);
        await newTour.save();
        res.status(201).json({ message: 'Thành công', tour: mapTour(newTour) });
    } catch (error) {
        res.status(400).json({ message: 'Lỗi', error: error.message });
    }
};

export const updateTour = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (updateData.title) updateData.ten_tour = updateData.title;
        if (updateData.description) updateData.mo_ta = updateData.description;
        if (updateData.basePrice) updateData.gia_nguoi_lon = updateData.basePrice;
        if (updateData.duration) updateData.so_ngay = updateData.duration;
        if (updateData.status) updateData.trang_thai = updateData.status;

        const updatedTour = await TourVi.findByIdAndUpdate(req.params.id, updateData, { new: true })
            .populate('id_diem_den', 'quoc_gia thanh_pho');
        if (!updatedTour) return res.status(404).json({ message: 'Không tìm thấy tour' });
        res.json({ message: 'Cập nhật thành công', tour: mapTour(updatedTour) });
    } catch (error) { res.status(400).json({ message: 'Lỗi', error: error.message }); }
};

export const deleteTour = async (req, res) => {
    try {
        const deletedTour = await TourVi.findByIdAndDelete(req.params.id);
        if (!deletedTour) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getStaffBookings = async (req, res) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (status && status !== 'all') filter.trang_thai = status;
        if (search) filter.$or = [{ 'thong_tin_lien_he.ho_ten': { $regex: search, $options: 'i' } }, { ma_dat_tour: { $regex: search, $options: 'i' } }];

        const bookings = await DatTour.find(filter).populate('id_tour', 'ten_tour').populate('id_nguoi_dung', 'ho_ten email')
            .skip((page - 1) * limit).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await DatTour.countDocuments(filter);

        res.json({ bookings: bookings.map(mapBooking), pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedBooking = await DatTour.findByIdAndUpdate(req.params.id, { trang_thai: status }, { new: true })
            .populate('id_tour', 'ten_tour').populate('id_nguoi_dung', 'ho_ten email');
        if (!updatedBooking) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ message: 'Thành công', booking: mapBooking(updatedBooking) });
    } catch (error) { res.status(400).json({ message: 'Lỗi', error: error.message }); }
};

export const getStaffCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const filter = { vai_tro: 'user' };
        if (search) filter.$or = [{ ho_ten: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

        const customers = await NguoiDung.find(filter).skip((page - 1) * limit).limit(parseInt(limit)).sort({ ngay_tao: -1 });
        const total = await NguoiDung.countDocuments(filter);

        const customersWithStats = await Promise.all(customers.map(async (c) => {
            const bookings = await DatTour.find({ id_nguoi_dung: c._id });
            const lastBookingDate = bookings.length > 0 ? bookings.sort((a, b) => b.ngay_tao - a.ngay_tao)[0].ngay_tao : null;
            return {
                ...c.toObject(),
                id: c._id,
                name: c.ho_ten,
                fullName: c.ho_ten, 
                email: c.email,
                phone: c.so_dien_thoai,
                role: c.vai_tro,
                joinDate: c.ngay_tao,
                lastBookingDate,
                totalBookings: bookings.length,
                totalSpent: bookings.reduce((sum, b) => sum + (b.tong_tien_cuoi || 0), 0),
                customerType: bookings.length >= 3 ? 'regular' : bookings.length > 0 ? 'new' : 'prospect'
            };
        }));

        res.json({ customers: customersWithStats, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getStaffDashboardStats = async (req, res) => {
    try {
        const tourStatsRaw = await TourVi.aggregate([{ $group: { _id: '$trang_thai', count: { $sum: 1 } } }]);
        const bookingStatsRaw = await DatTour.aggregate([{ $group: { _id: '$trang_thai', count: { $sum: 1 }, totalAmount: { $sum: '$tong_tien_cuoi' } } }]);
        const totalCustomers = await NguoiDung.countDocuments({ vai_tro: 'user' });
        
        const recentBookingsRaw = await DatTour.find().populate('id_tour', 'ten_tour').populate('id_nguoi_dung', 'ho_ten').sort({ ngay_tao: -1 }).limit(5);
        const upcomingToursRaw = await TourVi.find({ trang_thai: 'active' }).populate('id_diem_den', 'quoc_gia').sort({ ngay_tao: -1 }).limit(5);

        res.json({
            tourStats: tourStatsRaw.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
            bookingStats: bookingStatsRaw.reduce((acc, s) => { acc[s._id] = { count: s.count, revenue: s.totalAmount || 0 }; return acc; }, {}),
            totalCustomers,
            totalRevenue: bookingStatsRaw.reduce((sum, stat) => sum + (stat.totalAmount || 0), 0),
            recentBookings: recentBookingsRaw.map(mapBooking),
            upcomingTours: upcomingToursRaw.map(mapTour)
        });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate, groupBy = 'day' } = req.query;
        let dateFormat = { $dateToString: { format: '%Y-%m-%d', date: '$ngay_tao' } };
        const data = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
            { $group: { _id: dateFormat, revenue: { $sum: '$tong_tien_cuoi' } } },
            { $sort: { _id: 1 } }
        ]);
        const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
        res.json({ data: data.map(i => ({ date: i._id, revenue: i.revenue })), totalRevenue, averageRevenue: totalRevenue / (data.length || 1) });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getBookingDistribution = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
            { $group: { _id: '$id_tour', bookings: { $sum: 1 }, revenue: { $sum: '$tong_tien_cuoi' } } },
            { $lookup: { from: 'tour', localField: '_id', foreignField: '_id', as: 'tour' } },
            { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
            { $project: { tourName: { $ifNull: ['$tour.ten_tour', 'Unknown Tour'] }, bookings: 1, revenue: 1 } }
        ]);
        res.json({ data });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getCustomerDemographics = async (req, res) => {
    res.json({ data: [], totalCustomers: 0 }); // Simplified for demo
};

export const getTourPerformance = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const data = await DatTour.aggregate([
            { $match: { ngay_tao: { $gte: new Date(startDate), $lte: new Date(endDate) }, trang_thai: { $nin: ['cancelled'] } } },
            { $group: { _id: '$id_tour', revenue: { $sum: '$tong_tien_cuoi' }, bookings: { $sum: 1 } } },
            { $lookup: { from: 'tour', localField: '_id', foreignField: '_id', as: 'tour' } },
            { $unwind: { path: '$tour', preserveNullAndEmptyArrays: true } },
            { $project: { tourId: '$_id', tourName: { $ifNull: ['$tour.ten_tour', 'Unknown Tour'] }, revenue: 1, bookings: 1, rating: { $literal: 4.5 } } }
        ]);
        res.json({ data });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const exportAnalytics = async (req, res) => {
    res.status(500).json({ message: 'Chức năng đang được cập nhật' });
};

export const getTourById = async (req, res) => {
    try {
        const tour = await TourVi.findById(req.params.id).populate('id_diem_den', 'quoc_gia thanh_pho');
        if (!tour) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ tour: mapTour(tour) });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const bulkUpdateTourStatus = async (req, res) => {
    try {
        const { tourIds, status } = req.body;
        for (const tourId of tourIds) await TourVi.findByIdAndUpdate(tourId, { trang_thai: status });
        res.json({ success: tourIds.length, failed: 0, errors: [] });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};