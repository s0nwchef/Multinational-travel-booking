import mongoose from "mongoose";

const lichTrinhSchema = new mongoose.Schema(
  {
    ngay: { type: Number, required: true },
    tieu_de: { type: String, required: true },
    mo_ta: { type: String, required: true },
    bua_an: [{ type: String, enum: ["sang", "trua", "toi"] }],
    khach_san: { type: String, default: "" },
  },
  { _id: false },
);

const tourSchema = new mongoose.Schema(
  {
    // === THÔNG TIN CƠ BẢN ===
    ten_tour: {
      type: String,
      required: [true, "Tên tour là bắt buộc"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    id_diem_den: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DiemDen",
      required: [true, "Điểm đến là bắt buộc"],
    },

    // === HÌNH ẢNH & VIDEO ===
    anh_dai_dien: {
      type: String,
      default: "",
    },
    danh_sach_anh: [{ type: String }],
    video_url: { type: String, default: "" },

    // === MÔ TẢ ===
    mo_ta: {
      type: String,
      required: [true, "Mô tả tour là bắt buộc"],
      default: "",
    },
    diem_noi_bat: [{ type: String }],

    // === GIÁ & THỜI GIAN ===
    gia_nguoi_lon: {
      type: Number,
      required: [true, "Giá người lớn là bắt buộc"],
      min: [0, "Giá không được âm"],
    },
    gia_tre_em: {
      type: Number,
      required: [true, "Giá trẻ em là bắt buộc"],
      min: [0, "Giá không được âm"],
    },
    so_ngay: {
      type: Number,
      required: [true, "Số ngày là bắt buộc"],
      min: [1, "Tour phải ít nhất 1 ngày"],
    },
    so_dem: {
      type: Number,
      required: [true, "Số đêm là bắt buộc"],
      min: [0, "Số đêm không được âm"],
    },

    // === LỊCH TRÌNH ===
    lich_trinh: {
      type: [lichTrinhSchema],
      default: [],
    },

    // === ĐIỀU KIỆN ===
    bao_gom: [{ type: String }],
    khong_bao_gom: [{ type: String }],
    chinh_sach_huy: {
      type: String,
      default: "",
    },
    so_nguoi_toi_thieu: { type: Number, default: 1 },
    so_nguoi_toi_da: { type: Number, default: 30 },

    // === ĐÁNH GIÁ ===
    diem_trung_binh: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    so_luong_danh_gia: {
      type: Number,
      default: 0,
      min: 0,
    },

    // === TRẠNG THÁI ===
    trang_thai: {
      type: String,
      enum: {
        values: ["active", "inactive", "soldout"],
        message: "Trạng thái không hợp lệ: {VALUE}",
      },
      default: "active",
      required: true,
    },
    noi_bat: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: "ngay_tao",
      updatedAt: "ngay_cap_nhat",
    },
    collection: "tour",
  },
);

// Auto-generate slug from ten_tour before saving
tourSchema.pre("save", function (next) {
  if (this.isModified("ten_tour") && !this.slug) {
    this.slug = this.ten_tour
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  next();
});

tourSchema.virtual("lich_khoi_hanh", {
  ref: "LichKhoiHanh",
  localField: "_id",
  foreignField: "id_tour",
});

tourSchema.set("toJSON", { virtuals: true });
tourSchema.set("toObject", { virtuals: true });

// Indexes
tourSchema.index({ trang_thai: 1, noi_bat: -1 });
tourSchema.index({ gia_nguoi_lon: 1 });
tourSchema.index({ id_diem_den: 1 });
tourSchema.index({ diem_trung_binh: -1 });

export default mongoose.models.TourVi || mongoose.model("TourVi", tourSchema);
