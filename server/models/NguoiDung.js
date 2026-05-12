import mongoose from "mongoose";

const nguoiDungSchema = new mongoose.Schema({
  // === XÁC THỰC ===
  email: {
    type: String,
    required: [true, 'Email là bắt buộc'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email không hợp lệ']
  },
  mat_khau_hash: {
    type: String,
    select: false
  },
  vai_tro: {
    type: String,
    enum: {
      values: ['user', 'staff', 'admin'],
      message: 'Vai trò không hợp lệ: {VALUE}'
    },

    // === THÔNG TIN CÁ NHÂN ===
    ho_ten: {
      type: String,
      trim: true,
      default: "",
    },
    default: ''
  },
  dia_chi: {
    type: String,
    trim: true,
    default: ''
  },
  anh_dai_dien: {
    type: String,
    default: ''
  },
  diem: {
    type: Number,
    default: 0,
    min: 0
  },

  diem: {
    type: Number,
    default: 0,
    min: 0
  },

  // === DANH SÁCH YÊU THÍCH ===
  danh_sach_yeu_thich: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourVi'
  }],

  // === ĐIỂM THƯỞNG ===
  diem: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: {
    createdAt: 'ngay_tao',
    updatedAt: 'ngay_cap_nhat'
  },
  {
    timestamps: {
      createdAt: "ngay_tao",
      updatedAt: "ngay_cap_nhat",
    },
    collection: "nguoi_dung",
    toJSON: {
      transform(doc, ret) {
        delete ret.mat_khau_hash;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.mat_khau_hash;
        return ret;
      },
    },
  },
);

// Indexes
nguoiDungSchema.index({ vai_tro: 1 });

// Note: Password validation for OAuth users is handled in the OAuth service
// by using validateBeforeSave: false option
// Regular registration handles password validation in the controller

export default mongoose.models.NguoiDung || mongoose.model('NguoiDung', nguoiDungSchema);
