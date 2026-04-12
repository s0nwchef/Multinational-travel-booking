import mongoose from 'mongoose';

const tourScheduleSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  actualPrice: { type: Number, required: true },
  maxCapacity: { type: Number, required: true },
  bookedSeats: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'sold_out', 'cancelled'], default: 'available' }
});

export default mongoose.models.TourSchedule || mongoose.model('TourSchedule', tourScheduleSchema);
