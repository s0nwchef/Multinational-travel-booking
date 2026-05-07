import DatTour from '../models/DatTour.js';
import NguoiDung from '../models/NguoiDung.js';

export const processPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, paymentMethod } = req.body;

        if (!bookingId || !paymentMethod) return res.status(400).json({ message: 'Thiếu thông tin thanh toán' });
        const validMethods = ['credit_card', 'paypal', 'bank_transfer', 'card', 'banking', 'momo'];
        if (!validMethods.includes(paymentMethod)) return res.status(400).json({ message: 'Phương thức thanh toán không hợp lệ' });

        const booking = await DatTour.findOne({ _id: bookingId, id_nguoi_dung: userId }).populate('id_tour', 'ten_tour');
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

        if (booking.trang_thai_thanh_toan === 'paid') return res.status(400).json({ message: 'Booking đã được thanh toán' });

        const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        booking.trang_thai_thanh_toan = 'paid';
        booking.trang_thai = 'confirmed';
        booking.phuong_thuc_thanh_toan = paymentMethod === 'credit_card' ? 'card' : paymentMethod === 'bank_transfer' ? 'banking' : paymentMethod;
        await booking.save();

        const pointsEarned = Math.floor(booking.tong_tien_cuoi / 1000);
        // Assuming loyalty points exists or handle gracefully
        
        res.json({
            message: 'Thanh toán thành công',
            payment: { transactionId, amount: booking.tong_tien_cuoi, method: paymentMethod, status: 'success' },
            pointsEarned
        });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getPaymentMethods = async (req, res) => {
    res.json({
        methods: [
            { id: 'credit_card', name: 'Thẻ tín dụng/Ghi nợ', icon: 'credit-card', description: 'Visa, Mastercard, JCB' },
            { id: 'paypal', name: 'PayPal', icon: 'paypal', description: 'Thanh toán qua PayPal' },
            { id: 'bank_transfer', name: 'Chuyển khoản ngân hàng', icon: 'building', description: 'Chuyển khoản trực tiếp' }
        ]
    });
};

export const getPaymentHistory = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const bookings = await DatTour.find({ id_nguoi_dung: req.user.id, trang_thai_thanh_toan: { $in: ['paid', 'refunded'] } })
            .populate('id_tour', 'ten_tour danh_sach_anh')
            .skip((page - 1) * limit).limit(parseInt(limit)).sort({ ngay_tao: -1 });

        const total = await DatTour.countDocuments({ id_nguoi_dung: req.user.id, trang_thai_thanh_toan: { $in: ['paid', 'refunded'] } });

        const payments = bookings.map(b => ({
            bookingId: b._id, bookingCode: b.ma_dat_tour, tourName: b.id_tour?.ten_tour,
            amount: b.tong_tien_cuoi, status: b.trang_thai_thanh_toan,
            transactions: [{ transactionId: `TXN-${b._id}`, amount: b.tong_tien_cuoi, method: b.phuong_thuc_thanh_toan, status: 'success', date: b.ngay_cap_nhat }],
            date: b.ngay_tao
        }));

        res.json({ payments, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const getPaymentDetails = async (req, res) => {
    try {
        const booking = await DatTour.findOne({ _id: req.params.bookingId, id_nguoi_dung: req.user.id })
            .populate('id_tour', 'ten_tour danh_sach_anh').populate('id_ma_giam_gia', 'ma loai_giam gia_tri_giam');
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy booking' });

        res.json({
            bookingId: booking._id, tourName: booking.id_tour?.ten_tour, tourImage: booking.id_tour?.danh_sach_anh?.[0],
            baseFare: booking.tong_tien_truoc_giam, baggageFee: 0, taxAmount: 0,
            discountAmount: booking.tien_giam_gia, coupon: booking.id_ma_giam_gia,
            grandTotal: booking.tong_tien_cuoi, paymentStatus: booking.trang_thai_thanh_toan,
            paymentHistory: [{ transactionId: `TXN-${booking._id}`, amount: booking.tong_tien_cuoi, method: booking.phuong_thuc_thanh_toan, status: 'success', date: booking.ngay_cap_nhat }]
        });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const verifyPayment = async (req, res) => {
    try {
        const { transactionId, status } = req.body;
        if (!transactionId || !status) return res.status(400).json({ message: 'Thiếu thông tin xác minh' });

        const bookingId = transactionId.replace('TXN-', ''); // Simplified for demo
        const booking = await DatTour.findById(bookingId);
        if (!booking) return res.status(404).json({ message: 'Không tìm thấy giao dịch' });

        if (status === 'success') { booking.trang_thai_thanh_toan = 'paid'; booking.trang_thai = 'confirmed'; }
        else if (status === 'failed') { booking.trang_thai_thanh_toan = 'unpaid'; booking.trang_thai = 'pending'; }

        await booking.save();
        res.json({ message: 'Xác minh thành công', bookingId: booking._id, paymentStatus: booking.trang_thai_thanh_toan });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};