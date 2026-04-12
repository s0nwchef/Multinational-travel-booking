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
    seatNumber: String,
    isAvailable: Boolean,
    class: { type: String, enum: ['economy', 'business', 'first_class'] }
  }]
});

export default mongoose.models.Flight || mongoose.model('Flight', flightSchema);
