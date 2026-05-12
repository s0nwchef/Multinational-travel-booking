import mongoose from 'mongoose';

const taiKhoanOAuthSchema = new mongoose.Schema({
  // Tham chiếu đến người dùng
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NguoiDung',
    required: [true, 'User ID là bắt buộc'],
    index: true
  },
  
  // Provider thông tin
  provider: {
    type: String,
    enum: {
      values: ['google', 'facebook', 'apple'],
      message: 'Provider không hợp lệ: {VALUE}'
    },
    required: [true, 'Provider là bắt buộc']
  },
  
  // ID từ provider (Google ID, Facebook ID, Apple ID)
  provider_id: {
    type: String,
    required: [true, 'Provider ID là bắt buộc'],
    index: true
  },
  
  // Email từ provider
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Trạng thái
  trang_thai: {
    type: String,
    enum: {
      values: ['hoat_dong', 'dang_phat_trien'],
      message: 'Trạng thái không hợp lệ: {VALUE}'
    },
    default: 'hoat_dong'
  },
  
  // Metadata
  provider_metadata: {
    name: String,
    picture: String,
    locale: String
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  },
  collection: 'tai_khoan_oauth'
});

// Compound unique index: một user chỉ có một tài khoản OAuth cho mỗi provider
taiKhoanOAuthSchema.index({ user_id: 1, provider: 1 }, { unique: true });

// Index cho việc tìm kiếm theo provider và provider_id
taiKhoanOAuthSchema.index({ provider: 1, provider_id: 1 }, { unique: true });

// Index cho việc tìm kiếm theo email
taiKhoanOAuthSchema.index({ provider: 1, email: 1 });

export default mongoose.models.TaiKhoanOAuth || mongoose.model('TaiKhoanOAuth', taiKhoanOAuthSchema);
