import mongoose from 'mongoose';

const chiTietDiemSchema = new mongoose.Schema({
  chat_luong: { type: Number, min: 1, max: 5 },
  gia_tri: { type: Number, min: 1, max: 5 },
  huong_dan_vien: { type: Number, min: 1, max: 5 },
  phuong_tien: { type: Number, min: 1, max: 5 }
}, { _id: false });

const phanHoiSchema = new mongoose.Schema({
  noi_dung: { type: String, required: true },
  ngay_phan_hoi: { type: Date, default: Date.now }
}, { _id: false });

const danhGiaSchema = new mongoose.Schema({
  id_nguoi_dung: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true, 'ID người dùng là bắt buộc']
  },
  id_tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourVi',
    required: [true, 'ID tour là bắt buộc']
  },
  id_dat_tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DatTour',
    required: [true, 'ID đặt tour là bắt buộc']
  },

  // === ĐÁNH GIÁ ===
  diem: {
    type: Number,
    required: [true, 'Điểm đánh giá là bắt buộc'],
    min: [1, 'Điểm tối thiểu là 1'],
    max: [5, 'Điểm tối đa là 5']
  },
  chi_tiet_diem: {
    type: chiTietDiemSchema,
    default: null
  },

  // === NỘI DUNG ===
  tieu_de: {
    type: String,
    default: ''
  },
  noi_dung: {
    type: String,
    required: [true, 'Nội dung đánh giá là bắt buộc'],
    minlength: [10, 'Nội dung phải có ít nhất 10 ký tự']
  },
  danh_sach_media: [{ type: String }],

  // === PHẢN HỒI ===
  phan_hoi: {
    type: phanHoiSchema,
    default: null
  },

  // === TRẠNG THÁI ===
  da_xac_minh: {
    type: Boolean,
    default: false,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat'
  },
  collection: 'danh_gia'
});

// Indexes
danhGiaSchema.index({ id_tour: 1, ngay_tao: -1 });
danhGiaSchema.index({ id_nguoi_dung: 1 });
danhGiaSchema.index({ diem: -1 });

export default mongoose.models.DanhGia || mongoose.model('DanhGia', danhGiaSchema);
