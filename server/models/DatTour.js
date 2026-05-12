import mongoose from 'mongoose';

const hanhKhachSchema = new mongoose.Schema({
  ho_ten: { type: String, required: true },
  ngay_sinh: { type: Date, required: true },
  gioi_tinh: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  so_ho_chieu: { type: String, default: '' },
  loai: {
    type: String,
    enum: ['nguoi_lon', 'tre_em'],
    required: true
  }
}, { _id: false });

const thongTinLienHeSchema = new mongoose.Schema({
  ho_ten: { type: String, required: true },
  email: { type: String, required: true },
  so_dien_thoai: { type: String, required: true }
}, { _id: false });

const datTourSchema = new mongoose.Schema({
  ma_dat_tour: {
    type: String,
    unique: true,
    required: [true, 'Mã đặt tour là bắt buộc']
  },

  // === LIÊN KẾT ===
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
  id_lich_khoi_hanh: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LichKhoiHanh',
    required: [true, 'ID lịch khởi hành là bắt buộc']
  },

  // === THÔNG TIN LIÊN HỆ ===
  thong_tin_lien_he: {
    type: thongTinLienHeSchema,
    required: true
  },

  // === HÀNH KHÁCH ===
  hanh_khach: {
    type: [hanhKhachSchema],
    required: true,
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'Phải có ít nhất 1 hành khách'
    }
  },

  // === SỐ LƯỢNG ===
  so_nguoi_lon: {
    type: Number,
    required: true,
    min: [1, 'Phải có ít nhất 1 người lớn']
  },
  so_tre_em: {
    type: Number,
    default: 0,
    min: 0
  },

  // === GIÁ & THANH TOÁN ===
  don_gia_nguoi_lon: {
    type: Number,
    required: true,
    min: 0
  },
  don_gia_tre_em: {
    type: Number,
    default: 0,
    min: 0
  },
  tong_tien_truoc_giam: {
    type: Number,
    required: true,
    min: 0
  },
  tien_giam_gia: {
    type: Number,
    default: 0,
    min: 0
  },
  tong_tien_cuoi: {
    type: Number,
    required: true,
    min: 0
  },

  // === MÃ GIẢM GIÁ ===
  id_ma_giam_gia: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MaGiamGia',
    default: null
  },
  ma_giam_gia_da_dung: {
    type: String,
    default: ''
  },

  // === TRẠNG THÁI ===
  trang_thai: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: 'Trạng thái đặt tour không hợp lệ: {VALUE}'
    },
    default: 'pending',
    required: true
  },
  trang_thai_thanh_toan: {
    type: String,
    enum: {
      values: ['unpaid', 'paid', 'refunded'],
      message: 'Trạng thái thanh toán không hợp lệ: {VALUE}'
    },
    default: 'unpaid',
    required: true
  },
  phuong_thuc_thanh_toan: {
    type: String,
    enum: {
      values: ['card', 'banking', 'momo', ''],
      message: 'Phương thức thanh toán không hợp lệ: {VALUE}'
    },
    default: ''
  },

  // === HỦY TOUR ===
  ngay_huy: { type: Date, default: null },
  ly_do_huy: { type: String, default: '' },
  tien_hoan: { type: Number, default: 0, min: 0 },

  // === GHI CHÚ ===
  yeu_cau_dac_biet: { type: String, default: '' }
}, {
  timestamps: {
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat'
  },
  collection: 'dat_tour'
});

// Auto-generate booking code
datTourSchema.pre('save', async function() {
  if (this.isNew && !this.ma_dat_tour) {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    this.ma_dat_tour = `BK-${year}-${random}`;
  }
});

// Indexes
datTourSchema.index({ id_nguoi_dung: 1, ngay_tao: -1 });
datTourSchema.index({ trang_thai: 1 });
datTourSchema.index({ id_tour: 1 });

export default mongoose.models.DatTour || mongoose.model('DatTour', datTourSchema);
