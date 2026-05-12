import authService from "./authService.js";

const API_BASE_URL = "http://localhost:3000/api";

const couponService = {
  async getCatalog() {
    let response = await fetch(`${API_BASE_URL}/coupons/catalog`, {
      headers: authService.getAuthHeaders(),
    });

    if (response.status === 401 || response.headers.get("content-type")?.includes("text/html")) {
      response = await fetch(`${API_BASE_URL}/coupons/available`);
    }

    if (!response.ok) {
      throw new Error(`Failed to load coupons: ${response.status}`);
    }

    const data = await response.json();
    return data.coupons || [];
  },
};

export default couponService;
