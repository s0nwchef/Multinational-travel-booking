const API_BASE_URL = 'http://localhost:3000/api';

export const tourService = {
    // Get all tours
    async getAllTours(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/tours?${queryParams}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get all tours error:', error);
            throw error;
        }
    },

    // Get single tour by ID
    async getTourById(id) {
        try {
            if (!id) {
                throw new Error('Tour ID không được cung cấp');
            }
            
            const response = await fetch(`${API_BASE_URL}/tours/${id}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            const tour = await response.json();

            // Ensure schedules are populated; fallback to separate fetch if needed
            if (!tour.lich_khoi_hanh || tour.lich_khoi_hanh.length === 0) {
                try {
                    const tourIdForSchedules = tour._id || id;
                    const schedulesResponse = await fetch(`${API_BASE_URL}/tours/${tourIdForSchedules}/schedules`);
                    if (schedulesResponse.ok) {
                        const schedules = await schedulesResponse.json();
                        tour.lich_khoi_hanh = Array.isArray(schedules) ? schedules : (schedules.data || []);
                    }
                } catch (scheduleErr) {
                    console.warn('Fallback schedule fetch failed:', scheduleErr.message);
                    tour.lich_khoi_hanh = [];
                }
            }

            return tour;
        } catch (error) {
            console.error('Get tour by ID error:', error);
            throw error;
        }
    },

    // Search tours with filters
    async searchTours(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/tours?${queryParams}`);
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Search tours error:', error);
            throw error;
        }
    }
};

export default tourService;
