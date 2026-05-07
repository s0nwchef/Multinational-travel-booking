import ChuyenBay from '../models/ChuyenBay.js';

// Search flights
export const searchFlights = async (req, res) => {
    try {
        const { 
            from,           
            to,             
            departureDate,  
            returnDate,     
            passengers = 1,
            seatClass = 'economy'
        } = req.query;

        if (!from || !to || !departureDate) {
            return res.status(400).json({ message: 'Thiếu thông tin bắt buộc: from, to, departureDate' });
        }

        const classMap = { economy: 'pho_thong', business: 'thuong_gia', first_class: 'hang_nhat' };
        const hangGhe = classMap[seatClass] || 'pho_thong';

        const filter = {
            san_bay_di: from.toUpperCase(),
            san_bay_den: to.toUpperCase(),
            gio_khoi_hanh: {
                $gte: new Date(departureDate),
                $lt: new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000)
            }
        };

        const flights = await ChuyenBay.find(filter).select('-danh_sach_ghe').sort({ gio_khoi_hanh: 1 });

        const flightsWithPricing = flights.map(flight => {
            let price = flight.gia_hang_pho_thong;
            if (hangGhe === 'thuong_gia') price = flight.gia_hang_thuong_gia;
            if (hangGhe === 'hang_nhat') price = flight.gia_hang_thuong_gia * 1.5;
            
            const obj = flight.toObject();
            return {
                ...obj,
                departure: { airportCode: obj.san_bay_di, time: obj.gio_khoi_hanh },
                arrival: { airportCode: obj.san_bay_den, time: obj.gio_ha_canh },
                price,
                flightNumber: obj.so_hieu,
                airline: obj.hang_bay,
                seatClass,
                availableSeats: obj.tong_so_ghe // Simplification for search
            };
        });

        res.json({ flights: flightsWithPricing, searchParams: { from, to, departureDate, returnDate, passengers, seatClass } });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm kiếm chuyến bay', error: error.message });
    }
};

export const getFlightById = async (req, res) => {
    try {
        const flight = await ChuyenBay.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
        const obj = flight.toObject();
        obj.flightNumber = obj.so_hieu;
        obj.airline = obj.hang_bay;
        res.json({ flight: obj });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin chuyến bay', error: error.message });
    }
};

export const getFlightSeatMap = async (req, res) => {
    try {
        const flight = await ChuyenBay.findById(req.params.id).select('danh_sach_ghe so_hieu hang_bay');
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });

        const seatMap = { economy: [], business: [], first_class: [] };
        const availableSeats = { economy: 0, business: 0, first_class: 0 };

        flight.danh_sach_ghe.forEach(s => {
            const statusMap = { trong: 'Available', da_dat: 'Booked', dang_giu: 'Blocked' };
            const seat = { seatNumber: s.so_ghe, seatClass: s.hang === 'pho_thong' ? 'economy' : s.hang === 'thuong_gia' ? 'business' : 'first_class', status: statusMap[s.trang_thai] || 'Available' };
            if (seat.seatClass === 'economy') { seatMap.economy.push(seat); if (seat.status === 'Available') availableSeats.economy++; }
            if (seat.seatClass === 'business') { seatMap.business.push(seat); if (seat.status === 'Available') availableSeats.business++; }
            if (seat.seatClass === 'first_class') { seatMap.first_class.push(seat); if (seat.status === 'Available') availableSeats.first_class++; }
        });

        res.json({ flightNumber: flight.so_hieu, airline: flight.hang_bay, seatMap, availableSeats });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy seat map', error: error.message });
    }
};

export const reserveSeats = async (req, res) => {
    try {
        const { seatNumbers } = req.body;
        if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
            return res.status(400).json({ message: 'Danh sách ghế không hợp lệ' });
        }
        const flight = await ChuyenBay.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });

        const updatedSeats = [];
        const errors = [];
        for (const seatNumber of seatNumbers) {
            const seatIndex = flight.danh_sach_ghe.findIndex(s => s.so_ghe === seatNumber);
            if (seatIndex === -1) { errors.push({ seatNumber, error: 'Ghế không tồn tại' }); continue; }
            if (flight.danh_sach_ghe[seatIndex].trang_thai !== 'trong') { errors.push({ seatNumber, error: 'Ghế đã được đặt' }); continue; }
            flight.danh_sach_ghe[seatIndex].trang_thai = 'da_dat';
            updatedSeats.push(seatNumber);
        }
        await flight.save();
        res.json({ message: errors.length > 0 ? 'Một số ghế không thể đặt' : 'Đặt ghế thành công', reservedSeats: updatedSeats, errors, availableSeats: flight.tong_so_ghe });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi đặt ghế', error: error.message });
    }
};

export const releaseSeats = async (req, res) => {
    try {
        const { seatNumbers } = req.body;
        if (!seatNumbers || !Array.isArray(seatNumbers)) return res.status(400).json({ message: 'Danh sách ghế không hợp lệ' });
        const flight = await ChuyenBay.findById(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });

        for (const seatNumber of seatNumbers) {
            const seatIndex = flight.danh_sach_ghe.findIndex(s => s.so_ghe === seatNumber);
            if (seatIndex !== -1 && flight.danh_sach_ghe[seatIndex].trang_thai === 'da_dat') {
                flight.danh_sach_ghe[seatIndex].trang_thai = 'trong';
            }
        }
        await flight.save();
        res.json({ message: 'Giải phóng ghế thành công', availableSeats: flight.tong_so_ghe });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi giải phóng ghế', error: error.message });
    }
};

export const getAllFlights = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const flights = await ChuyenBay.find().select('-danh_sach_ghe').skip((page - 1) * limit).limit(parseInt(limit)).sort({ gio_khoi_hanh: -1 });
        const total = await ChuyenBay.countDocuments();
        
        const mapped = flights.map(f => {
            const obj = f.toObject();
            obj.flightNumber = obj.so_hieu;
            obj.airline = obj.hang_bay;
            obj.departure = { time: obj.gio_khoi_hanh, airportCode: obj.san_bay_di };
            obj.arrival = { time: obj.gio_ha_canh, airportCode: obj.san_bay_den };
            obj.price = obj.gia_hang_pho_thong;
            return obj;
        });

        res.json({ flights: mapped, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};

export const createFlight = async (req, res) => {
    try {
        const flight = new ChuyenBay(req.body);
        await flight.save();
        res.status(201).json({ message: 'Tạo chuyến bay thành công', flight });
    } catch (error) { res.status(400).json({ message: 'Lỗi', error: error.message }); }
};

export const updateFlight = async (req, res) => {
    try {
        const flight = await ChuyenBay.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ message: 'Cập nhật thành công', flight });
    } catch (error) { res.status(400).json({ message: 'Lỗi', error: error.message }); }
};

export const deleteFlight = async (req, res) => {
    try {
        const flight = await ChuyenBay.findByIdAndDelete(req.params.id);
        if (!flight) return res.status(404).json({ message: 'Không tìm thấy' });
        res.json({ message: 'Xóa thành công' });
    } catch (error) { res.status(500).json({ message: 'Lỗi', error: error.message }); }
};