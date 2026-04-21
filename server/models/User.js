import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String },
  passwordHash: { type: String },
  phoneNumber: { type: String },
  avatarUrl: { type: String },
  role: { type: String, enum: ['user', 'staff', 'admin', 'tour_operator'], default: 'user' },
  loyaltyPoints: { type: Number, default: 0 },
  loyaltyTier: { type: String, enum: ['Bronze', 'Silver', 'Gold', 'Platinum'], default: 'Bronze' },
  staffId: { type: String, default: null },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tour' }]
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
