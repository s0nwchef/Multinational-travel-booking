import mongoose from 'mongoose';

const diemDenSchema = new mongoose.Schema({
  quoc_gia: {
    type: String,
    required: [true, 'Quốc gia là bắt buộc'],
    trim: true
  },
  ma_quoc_gia: {
    type: String,
    required: [true, 'Mã quốc gia là bắt buộc'],
    uppercase: true,
    trim: true,
    maxlength: [3, 'Mã quốc gia tối đa 3 ký tự']
  },
  thanh_pho: {
    type: String,
    trim: true,
    default: ''
  },
  chau_luc: {
    type: String,
    required: [true, 'Châu lục là bắt buộc'],
    trim: true
  },
  anh_co: {
    type: String,
    default: ''
  },
  anh_bia: {
    type: String,
    default: ''
  },
  mo_ta: {
    type: String,
    default: ''
  },
  pho_bien: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'ngay_tao',
    updatedAt: false
  },
  collection: 'diem_den'
});

// Indexes
diemDenSchema.index({ quoc_gia: 1, thanh_pho: 1 });
diemDenSchema.index({ ma_quoc_gia: 1 });
diemDenSchema.index({ pho_bien: -1 });

export default mongoose.models.DiemDen || mongoose.model('DiemDen', diemDenSchema);
