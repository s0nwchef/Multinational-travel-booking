import authService from './authService.js';

const API_BASE_URL = 'http://localhost:3000/api';

export const staffService = {
    // Get dashboard statistics
    async getDashboardStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/dashboard/stats`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            throw error;
        }
    },
    
    // Get tours with pagination and filtering
    async getTours(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/tours?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get tours error:', error);
            throw error;
        }
    },
    
    // Get single tour by ID
    async getTourById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/tours/${id}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get tour by ID error:', error);
            throw error;
        }
    },
    
    // Create a new tour
    async createTour(tourData) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/tours`, {
                method: 'POST',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(tourData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Create tour error:', error);
            throw error;
        }
    },
    
    // Update a tour
    async updateTour(id, tourData) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/tours/${id}`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify(tourData),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Update tour error:', error);
            throw error;
        }
    },
    
    // Delete a tour
    async deleteTour(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/tours/${id}`, {
                method: 'DELETE',
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Delete tour error:', error);
            throw error;
        }
    },
    
    // Get bookings with pagination and filtering
    async getBookings(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/bookings?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get bookings error:', error);
            throw error;
        }
    },
    
    // Update booking status
    async updateBookingStatus(id, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/bookings/${id}/status`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ status }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Update booking status error:', error);
            throw error;
        }
    },
    
    // Get customers with pagination and filtering
    async getCustomers(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/customers?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get customers error:', error);
            throw error;
        }
    },
    
    // Export data to CSV
    async exportData(type, params = {}) {
        try {
            // This would call a backend export endpoint
            // For now, we'll simulate it
            console.log(`Export ${type} with params:`, params);
            
            // In a real implementation, this would download a file
            return { success: true, message: 'Export feature coming soon' };
        } catch (error) {
            console.error('Export data error:', error);
            throw error;
        }
    },
    
    // Analytics APIs
    async getRevenueAnalytics(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/analytics/revenue?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get revenue analytics error:', error);
            throw error;
        }
    },
    
    async getBookingDistribution(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/analytics/bookings?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get booking distribution error:', error);
            throw error;
        }
    },
    
    async getCustomerDemographics(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/analytics/customers?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get customer demographics error:', error);
            throw error;
        }
    },
    
    async getTourPerformance(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/staff/analytics/tour-performance?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Get tour performance error:', error);
            throw error;
        }
    },
    
    async exportAnalytics(type, params = {}) {
        try {
            const queryParams = new URLSearchParams({ type, ...params }).toString();
            const response = await fetch(`${API_BASE_URL}/staff/analytics/export?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            // Return blob for file download
            return await response.blob();
        } catch (error) {
            console.error('Export analytics error:', error);
            throw error;
        }
    },
    
    // Bulk tour actions
    async bulkUpdateTourStatus(tourIds, status) {
        try {
            const response = await fetch(`${API_BASE_URL}/staff/tours/bulk-status`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ tourIds, status }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Bulk update tour status error:', error);
            throw error;
        }
    },
    
    // Refund Management APIs
    async getRefundRequests(params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const response = await fetch(`${API_BASE_URL}/refunds/all?${queryParams}`, {
                headers: authService.getAuthHeaders(),
            });
            
            // Try to parse JSON response first
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            console.error('Get refund requests error:', error);
            throw error;
        }
    },
    
    async processRefund(bookingId, action, notes = '') {
        try {
            const response = await fetch(`${API_BASE_URL}/refunds/process/${bookingId}`, {
                method: 'PUT',
                headers: authService.getAuthHeaders(),
                body: JSON.stringify({ action, notes }),
            });
            
            // Try to parse JSON response first
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return data;
        } catch (error) {
            console.error('Process refund error:', error);
            throw error;
        }
    }
};

export default staffService;