const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth headers
function getAuthHeaders() {
  const SESSION_KEY = 'travel_session';
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (session?.sessionId) {
      headers['Authorization'] = session.sessionId;
    }
  } catch (error) {
    console.warn('Failed to get session:', error);
  }

  return headers;
}

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
      console.log('[DEBUG] Starting createBooking with data:', bookingData);
      
      const headers = getAuthHeaders();
      console.log('[DEBUG] Auth headers:', headers);

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(bookingData),
      });

      console.log('[DEBUG] Fetch completed, response status:', response.status);
      console.log('[DEBUG] Response object type:', typeof response);
      
      let data;
      try {
        data = await response.json();
        console.log('[DEBUG] Response parsed successfully:', data);
      } catch (parseErr) {
        console.error('[DEBUG] Failed to parse response JSON:', parseErr);
        throw new Error(`Failed to parse server response: ${parseErr.message}`);
      }

      if (!response.ok) {
        console.error('[DEBUG] Response not OK, throwing error');
        throw new Error(data.message || 'Không thể tạo booking');
      }

      console.log('[DEBUG] Booking created successfully');
      return data;
    } catch (error) {
      console.error('[DEBUG] Caught error in createBooking:', error);
      console.error('[DEBUG] Error name:', error.name);
      console.error('[DEBUG] Error message:', error.message);
      console.error('[DEBUG] Error toString:', error.toString());
      throw error;
    }
  },
};

export default bookingService;
