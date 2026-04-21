import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  basePrice: { type: Number, required: true },
  duration: { type: Number, required: true },
  images: [{ type: String }],
  itinerary: [{
    day: Number,
    activity: String
  }],
  included: [{ type: String }],
  excluded: [{ type: String }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 }
});

export default mongoose.models.Tour || mongoose.model('Tour', tourSchema);
