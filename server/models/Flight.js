import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  departure: {
    airportCode: { type: String, required: true },
    time: { type: Date, required: true }
  },
  arrival: {
    airportCode: { type: String, required: true },
    time: { type: Date, required: true }
  },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  seatMap: [{
    seatNumber: { type: String, required: true },
    seatClass: { type: String, enum: ['economy', 'business', 'first_class'], default: 'economy' },
    status: { type: String, enum: ['Available', 'Booked', 'Blocked'], default: 'Available' },
    priceMultiplier: { type: Number, default: 1.0 }
  }]
});

export default mongoose.models.Flight || mongoose.model('Flight', flightSchema);
