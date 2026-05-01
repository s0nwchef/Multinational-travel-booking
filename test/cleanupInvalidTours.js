/**
 * Cleanup Script: Find and remove tours without category
 * Also removes related bookings and flights
 * 
 * Usage: node test/cleanupInvalidTours.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

// Tour Schema
const tourSchema = new mongoose.Schema({
  title: String,
  description: String,
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  basePrice: Number,
  duration: Number,
  startDate: Date,
  endDate: Date,
  category: String,
  images: [String],
  itinerary: [{ day: Number, activity: String }],
  included: [String],
  excluded: [String],
  averageRating: Number,
  totalReviews: Number,
  status: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBookings: Number
}, { timestamps: true });

// Booking Schema
const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingType: String,
  itemId: mongoose.Schema.Types.ObjectId,
  bookingCode: String,
  bookingReference: String,
  customerName: String,
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour' },
  travelers: [{
    fullName: String,
    age: Number,
    documentId: String,
    seatNumber: String,
    baggage: String
  }],
  baseFare: Number,
  baggageFee: Number,
  taxAmount: Number,
  discountAmount: Number,
  grandTotal: Number,
  totalAmount: Number,
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  status: String,
  penaltyFee: Number,
  processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paymentStatus: String,
  bookingDate: Date,
  paymentHistory: [{
    transactionId: String,
    amount: Number,
    method: String,
    status: String,
    date: Date
  }],
  refundDetails: {
    amount: Number,
    reason: String,
    status: String,
    requestDate: Date,
    processedDate: Date
  }
});

// Flight Schema
const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  departure: {
    airportCode: String,
    time: Date
  },
  arrival: {
    airportCode: String,
    time: Date
  },
  price: Number,
  availableSeats: Number,
  seatMap: [{
    seatNumber: String,
    seatClass: String,
    status: String,
    priceMultiplier: Number
  }]
});

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);
const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
const Flight = mongoose.models.Flight || mongoose.model('Flight', flightSchema);

async function cleanupInvalidTours() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ Lỗi: Chưa tìm thấy MONGODB_URI trong .env');
      process.exit(1);
    }

    console.log('🔌 Đang kết nối MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB!\n');

    // Find tours without category or with null/empty category
    console.log('🔍 Đang tìm tours không có category...');
    const invalidTours = await Tour.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' },
        { category: { $type: 'null' } }
      ]
    });

    console.log(`\n📊 Tìm thấy ${invalidTours.length} tours không có category:\n`);
    
    if (invalidTours.length === 0) {
      console.log('✅ Không có tour nào cần xóa!');
    } else {
      // Show invalid tours
      invalidTours.forEach((tour, index) => {
        console.log(`  ${index + 1}. ${tour.title}`);
        console.log(`     - ID: ${tour._id}`);
        console.log(`     - Category: ${tour.category}`);
        console.log(`     - Price: $${tour.basePrice}`);
        console.log('');
      });

      // Get tour IDs to delete
      const tourIds = invalidTours.map(t => t._id);

      // Find related bookings
      console.log('🔍 Đang tìm bookings liên quan...');
      const relatedBookings = await Booking.find({ tourId: { $in: tourIds } });
      console.log(`   Tìm thấy ${relatedBookings.length} bookings liên quan`);

      // Find bookings with itemId pointing to invalid tours (for flight type)
      // Note: For flights, we need to check if they exist
      const bookingIds = relatedBookings.map(b => b._id);

      // Delete related bookings
      if (relatedBookings.length > 0) {
        console.log('\n🗑️ Đang xóa bookings...');
        await Booking.deleteMany({ tourId: { $in: tourIds } });
        console.log(`   ✅ Đã xóa ${relatedBookings.length} bookings`);
      }

      // Delete invalid tours
      console.log('\n🗑️ Đang xóa tours...');
      await Tour.deleteMany({ _id: { $in: tourIds } });
      console.log(`   ✅ Đã xóa ${invalidTours.length} tours`);

      console.log('\n🎉 Hoàn thành cleanup!');
      console.log(`   - Tours đã xóa: ${invalidTours.length}`);
      console.log(`   - Bookings đã xóa: ${relatedBookings.length}`);
    }

    // Show remaining tours with valid categories
    console.log('\n📋 Tours còn lại trong database:');
    const validTours = await Tour.find({});
    console.log(`   Tổng: ${validTours.length} tours\n`);

    // Group by category
    const categoryCount = {};
    validTours.forEach(tour => {
      const cat = tour.category || 'no-category';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    console.log('   Phân bố theo category:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`   - ${cat}: ${count}`);
    });

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Đã ngắt kết nối MongoDB');
    process.exit(0);
  }
}

cleanupInvalidTours();