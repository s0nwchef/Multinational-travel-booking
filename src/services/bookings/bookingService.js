const API_BASE_URL = "http://localhost:3000/api";

const bookingService = {
  /**
   * UC008: Lấy danh sách đơn đặt của tôi
   */
  async getMyBookings(currentUserId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: {
          Authorization: localStorage.getItem("sessionId"),
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error(`Lỗi: ${response.status}`);

      const data = await response.json();

      return data
        .filter((b) => {
          // Ép kiểu String để so sánh chính xác vì userId trong JSON là một Object
          const uid = b.userId?._id || b.userId;
          return String(uid) === String(currentUserId);
        })
        .map((booking) => {
          // Theo Schema và JSON, thông tin Tour nằm ở tourId (đã được populate)
          // itemId chỉ là ObjectId của TourSchedule (không có ref) nên không lấy được title/images từ đó
          const tourData = booking.tourId || {};

          return {
            id: booking._id,
            bookingCode: booking.bookingCode || booking._id,
            bookingReference: booking.bookingReference,

            // Thông tin Tour để hiển thị
            tourTitle: tourData.title || "Tour du lịch",
            tourImage:
              tourData.images?.[0] ||
              "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",

            // Thông tin khách hàng & Chi phí
            customerName: booking.customerName,
            travelers: booking.travelers || [],
            // Schema mới dùng grandTotal làm trường chính
            totalPrice: booking.grandTotal || booking.totalAmount || 0,

            // Thời gian & Trạng thái
            bookingDate: new Date(booking.bookingDate).toLocaleDateString(
              "vi-VN",
            ),
            status: booking.status,
            paymentStatus: booking.paymentStatus,

            // Phân nhóm Tab
            tabGroup: this._mapStatusToTab(booking.status),
          };
        });
    } catch (error) {
      console.error("BookingService Get Error:", error);
      throw error;
    }
  },

  async cancelBooking(bookingId) {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("sessionId"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
          paymentStatus: "refunded",
        }),
      });

      if (!response.ok) throw new Error("Không thể hủy đơn đặt.");
      return await response.json();
    } catch (error) {
      console.error("Cancel Error:", error);
      throw error;
    }
  },

  _mapStatusToTab(status) {
    const s = status?.toLowerCase();
    // Bổ sung các trạng thái từ Schema mới vào nhóm upcoming
    if (["confirmed", "paid", "pending", "ticketed"].includes(s))
      return "upcoming";
    if (s === "completed") return "completed";
    if (["cancelled", "refunded", "refund_pending"].includes(s))
      return "cancelled";
    return "upcoming";
  },
};

export default bookingService;
