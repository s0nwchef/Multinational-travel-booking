const API_BASE_URL = '/api/reviews';
const TOUR_REVIEWS_URL = '/api/reviews/tour';

const buildUrl = (baseUrl, path = '', params = {}) => {
  const url = new URL(`${baseUrl}${path}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

const getAuthHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const sessionStr = localStorage.getItem('travel_session');
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      if (session?.sessionId) {
        headers.Authorization = session.sessionId;
      }
    } catch {
      // Ignore malformed session storage and fall back to anonymous requests
    }
  }

  return headers;
};

const request = async (path, options = {}) => {
  const response = await fetch(buildUrl(API_BASE_URL, path, options.params), {
    method: options.method || 'GET',
    headers: options.headers || getAuthHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return data;
};

export const reviewService = {
  /**
   * Get reviews for a specific tour
   * @param {string} tourId - Tour ID
   * @param {object} params - Query parameters { sort, limit, page, rating }
   * @returns {Promise} Reviews data with distribution and pagination
   */
  async getTourReviews(tourId, params = {}) {
    try {
      const response = await fetch(buildUrl(TOUR_REVIEWS_URL, `/${tourId}`, params));
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching tour reviews:', error);
      throw error;
    }
  },

  /**
   * Get a single review by ID
   * @param {string} id - Review ID
   * @returns {Promise} Review data
   */
  async getReviewById(id) {
    try {
      return await request(`/${id}`);
    } catch (error) {
      console.error('Error fetching review:', error);
      throw error;
    }
  },

  /**
   * Get current user's reviews
   * @param {object} params - Query parameters { page, limit }
   * @returns {Promise} User's reviews
   */
  async getUserReviews(params = {}) {
    try {
      return await request('/my-reviews', { params });
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },

  /**
   * Create a new review
   * @param {object} reviewData - Review data { tourId, rating, title, content, photos, isAnonymous, detailedRatings }
   * @returns {Promise} Created review
   */
  async createReview(reviewData) {
    try {
      return await request('/', {
        method: 'POST',
        body: reviewData,
      });
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  },

  /**
   * Update an existing review
   * @param {string} id - Review ID
   * @param {object} updateData - Data to update
   * @returns {Promise} Updated review
   */
  async updateReview(id, updateData) {
    try {
      return await request(`/${id}`, {
        method: 'PUT',
        body: updateData,
      });
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  },

  /**
   * Delete a review
   * @param {string} id - Review ID
   * @returns {Promise} Success message
   */
  async deleteReview(id) {
    try {
      return await request(`/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
};

export default reviewService;
