import mongoose from 'mongoose';

const gheSchema = new mongoose.Schema({
  so_ghe: { type: String, required: true },
  hang: { type: String, enum: ['pho_thong', 'thuong_gia', 'hang_nhat'], required: true },
  trang_thai: { type: String, enum: ['trong', 'da_dat', 'dang_giu'], default: 'trong', required: true },
  phi_them: { type: Number, default: 0, min: 0 },
  giu_den: { type: Date, default: null }
}, { _id: false });

const chuyenBaySchema = new mongoose.Schema({
  so_hieu: { type: String, required: true },
  hang_bay: { type: String, required: true },
  logo_hang_bay: { type: String, default: '' },
  san_bay_di: { type: String, required: true, uppercase: true },
  thanh_pho_di: { type: String, required: true },
  san_bay_den: { type: String, required: true, uppercase: true },
  thanh_pho_den: { type: String, required: true },
  gio_khoi_hanh: { type: Date, required: true },
  gio_ha_canh: { type: Date, required: true },
  thoi_gian_bay_phut: { type: Number, required: true, min: 1 },
  tong_so_ghe: { type: Number, required: true, min: 1 },
  danh_sach_ghe: [gheSchema],
  gia_hang_pho_thong: { type: Number, required: true, min: 0 },
  gia_hang_thuong_gia: { type: Number, required: true, min: 0 },
  trang_thai: { type: String, enum: ['scheduled', 'cancelled', 'departed'], default: 'scheduled', required: true }
}, {
  timestamps: { createdAt: 'ngay_tao', updatedAt: 'ngay_cap_nhat' },
  collection: 'chuyen_bay'
});

chuyenBaySchema.index({ san_bay_di: 1, san_bay_den: 1, gio_khoi_hanh: 1 });
chuyenBaySchema.index({ so_hieu: 1 });
chuyenBaySchema.index({ trang_thai: 1 });

export default mongoose.models.ChuyenBay || mongoose.model('ChuyenBay', chuyenBaySchema);
