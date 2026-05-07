import mongoose from 'mongoose';

const maGiamGiaSchema = new mongoose.Schema({
  ma: { type: String, required: true, unique: true, uppercase: true, trim: true },
  mo_ta: { type: String, required: true, trim: true },
  loai_giam: { type: String, enum: ['phan_tram', 'so_tien'], required: true },
  gia_tri_giam: { type: Number, required: true, min: 0 },
  giam_toi_da: { type: Number, default: null, min: 0 },
  don_hang_toi_thieu: { type: Number, default: 0, min: 0 },
  tong_so_luong: { type: Number, required: true, min: 1 },
  da_su_dung: { type: Number, default: 0, min: 0 },
  hieu_luc_tu: { type: Date, required: true },
  hieu_luc_den: { type: Date, required: true },
  kich_hoat: { type: Boolean, default: true, required: true }
}, {
  timestamps: { createdAt: 'ngay_tao', updatedAt: 'ngay_cap_nhat' },
  collection: 'ma_giam_gia',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

maGiamGiaSchema.virtual('con_lai').get(function() {
  return this.tong_so_luong - this.da_su_dung;
});

maGiamGiaSchema.index({ kich_hoat: 1, hieu_luc_den: 1 });

export default mongoose.models.MaGiamGia || mongoose.model('MaGiamGia', maGiamGiaSchema);
