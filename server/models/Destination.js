import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['continent', 'country', 'city'], required: true },
  description: { type: String },
  imageUrl: { type: String },
  popularTours: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }]
});

export default mongoose.models.Destination || mongoose.model('Destination', destinationSchema);
