import mongoose from 'mongoose';

const thongBaoSchema = new mongoose.Schema({
  id_nguoi_dung: { type: mongoose.Schema.Types.ObjectId, ref: 'NguoiDung', required: true },
  loai: {
    type: String,
    enum: ['dat_tour_thanh_cong', 'dat_tour_huy', 'thanh_toan_thanh_cong', 'nho_danh_gia', 'khuyen_mai', 'he_thong'],
    required: true
  },
  tieu_de: { type: String, required: true },
  noi_dung: { type: String, required: true },
  lien_ket: { type: String, default: null },
  id_tham_chieu: { type: mongoose.Schema.Types.ObjectId, default: null },
  loai_tham_chieu: { type: String, enum: ['dat_tour', 'tour', ''], default: '' },
  da_doc: { type: Boolean, default: false, required: true },
  ngay_doc: { type: Date, default: null }
}, {
  timestamps: { createdAt: 'ngay_tao', updatedAt: false },
  collection: 'thong_bao'
});

thongBaoSchema.index({ id_nguoi_dung: 1, ngay_tao: -1 });
thongBaoSchema.index({ id_nguoi_dung: 1, da_doc: 1 });

export default mongoose.models.ThongBao || mongoose.model('ThongBao', thongBaoSchema);
