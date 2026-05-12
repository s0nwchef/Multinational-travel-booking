const API_BASE_URL = "http://localhost:3000/api";

function getSessionId() {
  const raw = localStorage.getItem("travel_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw).sessionId;
  } catch {
    return null;
  }
}

function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  const sessionId = getSessionId();
  if (sessionId) {
    headers.Authorization = sessionId;
  }
  return headers;
}

const wishlistService = {
  async getWishlist() {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
    const data = await response.json();

    return {
      count: data.count,
      items: data.wishlist.map((tour) => this._mapTour(tour)),
    };
  },

  async getWishlistCount() {
    const response = await fetch(`${API_BASE_URL}/wishlist/count`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
    const data = await response.json();
    return data.count;
  },

  async checkWishlist(tourId) {
    const response = await fetch(`${API_BASE_URL}/wishlist/check/${tourId}`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
    const data = await response.json();
    return data.isInWishlist;
  },

  async addToWishlist(tourId) {
    const response = await fetch(`${API_BASE_URL}/wishlist`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ tourId }),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Không thể thêm vào wishlist");
    }
    return await response.json();
  },

  async removeFromWishlist(tourId) {
    const response = await fetch(`${API_BASE_URL}/wishlist/${tourId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || "Không thể xóa khỏi wishlist");
    }
    return await response.json();
  },

  async toggleWishlist(tourId, currentState) {
    if (currentState) {
      return await this.removeFromWishlist(tourId);
    } else {
      return await this.addToWishlist(tourId);
    }
  },

  // Map tour data từ API sang shape giống tourService
  _mapTour(tour) {
    const city = tour.id_diem_den?.thanh_pho || "Unknown";
    const country = tour.id_diem_den?.quoc_gia || "";

    return {
      id: tour._id,
      title: tour.ten_tour,
      slug: tour.slug,
      location: city.toUpperCase(),
      city,
      country,
      image:
        tour.anh_dai_dien ||
        tour.danh_sach_anh?.[0] ||
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=800",
      basePrice: tour.gia_nguoi_lon,
      originalPrice: tour.gia_nguoi_lon
        ? Math.round(tour.gia_nguoi_lon * 1.15)
        : null,
      rating: tour.diem_trung_binh || 0,
      totalReviews: tour.so_luong_danh_gia || 0,
      duration: `${tour.so_ngay} D / ${tour.so_dem} N`,
      soNgay: tour.so_ngay,
      badge:
        tour.diem_trung_binh >= 4.8
          ? "BEST SELLER"
          : tour.noi_bat
            ? "FEATURED"
            : null,
      badgeType:
        tour.diem_trung_binh >= 4.8
          ? "orange"
          : tour.noi_bat
            ? "purple"
            : "blue",
      status: tour.trang_thai,
    };
  },
};

export default wishlistService;
