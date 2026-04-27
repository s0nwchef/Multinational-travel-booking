import Flight from '../models/Flight.js';

// Search flights
export const searchFlights = async (req, res) => {
    try {
        const { 
            from,           // departure airport code (e.g., "SGN")
            to,             // arrival airport code (e.g., "HAN")
            departureDate,  // departure date
            returnDate,     // optional return date for round trip
            passengers = 1,
            seatClass = 'economy'
        } = req.query;

        if (!from || !to || !departureDate) {
            return res.status(400).json({ 
                message: 'Thiếu thông tin bắt buộc: from, to, departureDate' 
            });
        }

        // Build filter for departure flights
        const filter = {
            'departure.airportCode': from.toUpperCase(),
            'arrival.airportCode': to.toUpperCase(),
            'departure.time': {
                $gte: new Date(departureDate),
                $lt: new Date(new Date(departureDate).getTime() + 24 * 60 * 60 * 1000)
            },
            availableSeats: { $gte: parseInt(passengers) }
        };

        const flights = await Flight.find(filter)
            .select('-seatMap')
            .sort({ 'departure.time': 1 });

        // Add seat class pricing
        const flightsWithPricing = flights.map(flight => {
            const basePrice = flight.price;
            let multiplier = 1;
            if (seatClass === 'business') multiplier = 2.5;
            if (seatClass === 'first_class') multiplier = 4;
            
            return {
                ...flight.toObject(),
                seatClass,
                price: basePrice * multiplier,
                availableSeats: flight.availableSeats
            };
        });

        res.json({
            flights: flightsWithPricing,
            searchParams: { from, to, departureDate, returnDate, passengers, seatClass }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi tìm kiếm chuyến bay', 
            error: error.message 
        });
    }
};

// Get flight by ID
export const getFlightById = async (req, res) => {
    try {
        const { id } = req.params;

        const flight = await Flight.findById(id);

        if (!flight) {
            return res.status(404).json({ 
                message: 'Không tìm thấy chuyến bay' 
            });
        }

        res.json({ flight });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy thông tin chuyến bay', 
            error: error.message 
        });
    }
};

// Get seat map for a flight
export const getFlightSeatMap = async (req, res) => {
    try {
        const { id } = req.params;

        const flight = await Flight.findById(id).select('seatMap flightNumber airline');

        if (!flight) {
            return res.status(404).json({ 
                message: 'Không tìm thấy chuyến bay' 
            });
        }

        // Group seats by class
        const seatMap = {
            economy: flight.seatMap.filter(s => s.seatClass === 'economy'),
            business: flight.seatMap.filter(s => s.seatClass === 'business'),
            first_class: flight.seatMap.filter(s => s.seatClass === 'first_class')
        };

        // Get available seats count
        const availableSeats = {
            economy: seatMap.economy.filter(s => s.status === 'Available').length,
            business: seatMap.business.filter(s => s.status === 'Available').length,
            first_class: seatMap.first_class.filter(s => s.status === 'Available').length
        };

        res.json({
            flightNumber: flight.flightNumber,
            airline: flight.airline,
            seatMap,
            availableSeats
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy seat map', 
            error: error.message 
        });
    }
};

// Book seats (reserve seats for a booking)
export const reserveSeats = async (req, res) => {
    try {
        const { id } = req.params;
        const { seatNumbers, bookingId } = req.body;

        if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
            return res.status(400).json({ 
                message: 'Danh sách ghế không hợp lệ' 
            });
        }

        const flight = await Flight.findById(id);

        if (!flight) {
            return res.status(404).json({ 
                message: 'Không tìm thấy chuyến bay' 
            });
        }

        // Update seat status
        const updatedSeats = [];
        const errors = [];

        for (const seatNumber of seatNumbers) {
            const seatIndex = flight.seatMap.findIndex(s => s.seatNumber === seatNumber);
            
            if (seatIndex === -1) {
                errors.push({ seatNumber, error: 'Ghế không tồn tại' });
                continue;
            }

            if (flight.seatMap[seatIndex].status !== 'Available') {
                errors.push({ seatNumber, error: 'Ghế đã được đặt' });
                continue;
            }

            flight.seatMap[seatIndex].status = 'Booked';
            updatedSeats.push(seatNumber);
        }

        // Update available seats count
        flight.availableSeats = flight.seatMap.filter(s => s.status === 'Available').length;
        
        await flight.save();

        res.json({
            message: errors.length > 0 ? 'Một số ghế không thể đặt' : 'Đặt ghế thành công',
            reservedSeats: updatedSeats,
            errors,
            availableSeats: flight.availableSeats
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi đặt ghế', 
            error: error.message 
        });
    }
};

// Release seats (when booking is cancelled)
export const releaseSeats = async (req, res) => {
    try {
        const { id } = req.params;
        const { seatNumbers } = req.body;

        if (!seatNumbers || !Array.isArray(seatNumbers)) {
            return res.status(400).json({ 
                message: 'Danh sách ghế không hợp lệ' 
            });
        }

        const flight = await Flight.findById(id);

        if (!flight) {
            return res.status(404).json({ 
                message: 'Không tìm thấy chuyến bay' 
            });
        }

        for (const seatNumber of seatNumbers) {
            const seatIndex = flight.seatMap.findIndex(s => s.seatNumber === seatNumber);
            if (seatIndex !== -1 && flight.seatMap[seatIndex].status === 'Booked') {
                flight.seatMap[seatIndex].status = 'Available';
            }
        }

        flight.availableSeats = flight.seatMap.filter(s => s.status === 'Available').length;
        await flight.save();

        res.json({
            message: 'Giải phóng ghế thành công',
            availableSeats: flight.availableSeats
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi giải phóng ghế', 
            error: error.message 
        });
    }
};

// Get all flights (admin)
export const getAllFlights = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const flights = await Flight.find()
            .select('-seatMap')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ 'departure.time': -1 });

        const total = await Flight.countDocuments();

        res.json({
            flights,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi lấy danh sách chuyến bay', 
            error: error.message 
        });
    }
};

// Create flight (admin)
export const createFlight = async (req, res) => {
    try {
        const newFlight = new Flight(req.body);
        const savedFlight = await newFlight.save();

        res.status(201).json({
            message: 'Tạo chuyến bay thành công',
            flight: savedFlight
        });

    } catch (error) {
        res.status(400).json({ 
            message: 'Lỗi khi tạo chuyến bay', 
            error: error.message 
        });
    }
};

// Update flight (admin)
export const updateFlight = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedFlight = await Flight.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedFlight) {
            return res.status(404).json({ 
                message: 'Không tìm thấy chuyến bay' 
            });
        }

        res.json({
            message: 'Cập nhật chuyến bay thành công',
            flight: updatedFlight
        });

    } catch (error) {
        res.status(400).json({ 
            message: 'Lỗi khi cập nhật chuyến bay', 
            error: error.message 
        });
    }
};

// Delete flight (admin)
export const deleteFlight = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFlight = await Flight.findByIdAndDelete(id);

        if (!deletedFlight) {
            return res.status(404).json({ 
                message: 'Không tìm thấy chuyến bay' 
            });
        }

        res.json({ 
            message: 'Xóa chuyến bay thành công' 
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Lỗi khi xóa chuyến bay', 
            error: error.message 
        });
    }
};