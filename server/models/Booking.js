import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingType: { type: String, enum: ['tour', 'flight'], required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Ref: TourSchedule hoặc Flight
  bookingCode: { type: String, unique: true, sparse: true },
  bookingReference: { type: String },
  customerName: { type: String },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  travelers: [{
    fullName: String,
    age: Number,
    documentId: String,
    seatNumber: String,
    baggage: { type: String, default: "7kg xách tay" }
  }],
  
  // Bóc tách kế toán
  baseFare: { type: Number, default: 0 },
  baggageFee: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  totalAmount: { type: Number }, // Giữ lại để tương thích ngược với code cũ,
  
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  status: { type: String, enum: ['pending', 'paid', 'confirmed', 'ticketed', 'cancelled', 'completed', 'refund_pending', 'refunded'], default: 'pending' },
  penaltyFee: { type: Number, default: 0 },
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
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
