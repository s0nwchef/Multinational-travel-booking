const API_BASE_URL = 'http://localhost:3000/api';

export const reviewService = {
  async getTourReviews(tourId, params = {}) {
    if (!tourId) {
      throw new Error('Tour ID không được cung cấp');
    }

    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/reviews/tour/${tourId}${queryParams ? `?${queryParams}` : ''}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
};

export default reviewService;