const API_BASE_URL = 'http://localhost:3000/api';

const bookingService = {
  async getBookings() {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tải danh sách booking');
      }

      return data;
    } catch (error) {
      console.error('Get bookings error:', error);
      throw error;
    }
  },

  async createBooking(bookingData) {
    try {
      const authServiceModule = await import('./authService.js');
      const authService = authServiceModule.default;

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Không thể tạo booking');
      }

      return data;
    } catch (error) {
      console.error('Create booking error:', error);
      throw error;
    }
  },
};

export default bookingService;
