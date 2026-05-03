import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
  title: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  photos: [{ type: String }],
  isAnonymous: { type: Boolean, default: false },
  detailedRatings: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
