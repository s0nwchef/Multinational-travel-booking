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

const bookingService = {
  async getMyBookings() {
    const headers = { "Content-Type": "application/json" };

    const sessionId = getSessionId();
    if (sessionId) {
      headers.Authorization = sessionId;
    }

    const response = await fetch(`${API_BASE_URL}/bookings`, { headers });
    if (!response.ok) throw new Error(`Lỗi: ${response.status}`);
    const data = await response.json();

    return data.map((booking) => {
      const tourData = booking.id_tour || {};
      const scheduleData = booking.id_lich_khoi_hanh || {};

      const returnDate = scheduleData.ngay_ve
        ? new Date(scheduleData.ngay_ve).toLocaleDateString("en-GB")
        : null;

      return {
        id: booking._id,
        bookingCode: booking.ma_dat_tour,
        tourImage:
          tourData.anh_dai_dien ||
          "https://placehold.co/600x400/e2e8f0/64748b?text=No+Image",
        tourTitle: tourData.ten_tour || "Unnamed Tour",
        departureDate: scheduleData.ngay_khoi_hanh
          ? new Date(scheduleData.ngay_khoi_hanh).toLocaleDateString("en-GB")
          : "TBA",
        returnDate,
        totalPrice: booking.tong_tien_cuoi,
        numAdults: booking.so_nguoi_lon,
        numChildren: booking.so_tre_em,
        bookingDate: new Date(booking.ngay_tao).toLocaleDateString("en-US"),
        status: booking.trang_thai,
        paymentStatus: booking.trang_thai_thanh_toan,
        tabGroup: this._mapStatusToTab(booking.trang_thai, returnDate),
        city: tourData.id_diem_den?.thanh_pho || "",
        soNgay: tourData.so_ngay || 0,
      };
    });
  },

  async cancelBooking(bookingId, reason = "Customer requested cancellation") {
    const headers = { "Content-Type": "application/json" };

    const sessionId = getSessionId();
    if (sessionId) {
      headers.Authorization = sessionId;
    }

    const response = await fetch(
      `${API_BASE_URL}/bookings/${bookingId}/cancel`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ ly_do_huy: reason }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to cancel booking.");
    }

    return await response.json();
  },

  _mapStatusToTab(status, returnDate) {
    const s = status?.toLowerCase();

    if (s === "cancelled") return "cancelled";

    if (s === "completed") return "completed";

    if (["pending", "confirmed"].includes(s)) {
      if (returnDate) {
        const [day, month, year] = returnDate.split("/");
        const retDate = new Date(year, month - 1, day);
        if (retDate < new Date()) return "completed";
      }
      return "upcoming";
    }

    return "upcoming";
  },
};

export default bookingService;
