import mongoose from 'mongoose';

const lichKhoiHanhSchema = new mongoose.Schema({
  id_tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourVi',
    required: [true, 'ID tour là bắt buộc']
  },
  ngay_khoi_hanh: {
    type: Date,
    required: [true, 'Ngày khởi hành là bắt buộc']
  },
  ngay_ve: {
    type: Date,
    required: [true, 'Ngày về là bắt buộc']
  },
  gia_nguoi_lon: {
    type: Number,
    required: [true, 'Giá người lớn là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  gia_tre_em: {
    type: Number,
    required: [true, 'Giá trẻ em là bắt buộc'],
    min: [0, 'Giá không được âm']
  },
  tong_cho: {
    type: Number,
    required: [true, 'Tổng số chỗ là bắt buộc'],
    min: [1, 'Phải có ít nhất 1 chỗ']
  },
  cho_da_dat: {
    type: Number,
    default: 0,
    min: [0, 'Số chỗ đã đặt không được âm']
  },
  trang_thai: {
    type: String,
    enum: {
      values: ['available', 'full', 'cancelled'],
      message: 'Trạng thái không hợp lệ: {VALUE}'
    },
    default: 'available',
    required: true
  }
}, {
  timestamps: {
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat'
  },
  collection: 'lich_khoi_hanh',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual field: cho_con_lai
lichKhoiHanhSchema.virtual('cho_con_lai').get(function() {
  return this.tong_cho - this.cho_da_dat;
});

// Indexes
lichKhoiHanhSchema.index({ id_tour: 1, ngay_khoi_hanh: 1 });
lichKhoiHanhSchema.index({ trang_thai: 1, ngay_khoi_hanh: 1 });

export default mongoose.models.LichKhoiHanh || mongoose.model('LichKhoiHanh', lichKhoiHanhSchema);
