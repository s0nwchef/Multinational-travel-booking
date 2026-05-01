import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  basePrice: { type: Number, required: true },
  duration: { type: Number, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  category: { 
    type: String, 
    enum: ['adventure', 'cultural', 'relaxation', 'family', 'luxury', 'nature', 'city_tour', 'food'], 
    default: 'city_tour' 
  },
  images: [{ type: String }],
  itinerary: [{
    day: Number,
    activity: String
  }],
  included: [{ type: String }],
  excluded: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'archived'], 
    default: 'draft' 
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  totalBookings: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', tourSchema);
