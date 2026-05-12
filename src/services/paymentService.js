const API_BASE_URL = 'http://localhost:3000/api';

function getAuthHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  try {
    const session = JSON.parse(localStorage.getItem('travel_session'));
    if (session?.sessionId) {
      headers.Authorization = session.sessionId;
    }
  } catch (error) {
    console.warn('Failed to parse session:', error);
  }

  return headers;
}

const paymentService = {
  async processPayment(bookingId, paymentMethod) {
    const response = await fetch(`${API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ bookingId, paymentMethod }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Không thể xử lý thanh toán');
    }

    return data;
  },
};

export default paymentService;
