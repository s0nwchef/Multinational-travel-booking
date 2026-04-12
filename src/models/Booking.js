import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['tour', 'flight'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ref: TourSchedule hoặc Flight
  travelers: [{
    fullName: String,
    age: Number,
    documentId: String
  }],
  totalAmount: { type: Number, required: true },
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  bookingDate: { type: Date, default: Date.now },
  
  paymentHistory: [{
    transactionId: String,
    amount: Number,
    method: { type: String, enum: ['credit_card', 'paypal', 'bank_transfer'] },
    status: { type: String, enum: ['success', 'failed', 'pending'] },
    date: { type: Date, default: Date.now }
  }],
  
  refundDetails: {
    amount: Number,
    reason: String,
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'processed'] },
    requestDate: Date,
    processedDate: Date
  }
});

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
