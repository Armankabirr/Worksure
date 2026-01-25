import axios from 'axios';
import {
  DashboardSummary,
  BookingStats,
  RevenueStats,
  ComplaintStats,
  ReviewStats,
  RecentActivities,
} from '@/types/dashboard';

// Create axios instance using the same configuration as useAxiosPublic
const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

class DashboardService {
  /**
   * Get dashboard summary statistics
   */
  async getSummary(): Promise<ApiResponse<DashboardSummary>> {
    try {
      const response = await axiosPublic.get('/admin/dashboard/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch dashboard summary',
      };
    }
  }

  /**
   * Get booking statistics over time
   */
  async getBookingStats(range: string = '7d'): Promise<ApiResponse<BookingStats>> {
    try {
      const response = await axiosPublic.get('/admin/dashboard/bookings', {
        params: { range }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch booking statistics',
      };
    }
  }

  /**
   * Get revenue statistics over time
   */
  async getRevenueStats(range: string = '7d'): Promise<ApiResponse<RevenueStats>> {
    try {
      const response = await axiosPublic.get('/admin/dashboard/revenue', {
        params: { range }
      });
      
     return response.data;
    } catch (error) {
      console.error('Error fetching revenue stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch revenue statistics',
      };
    }
  }

  /**
   * Get complaint statistics
   */
  async getComplaintStats(): Promise<ApiResponse<ComplaintStats>> {
    try {
      const response = await axiosPublic.get('/admin/dashboard/complaints');
      return response.data;
    } catch (error) {
      console.error('Error fetching complaint stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch complaint statistics',
      };
    }
  }

  /**
   * Get review statistics
   */
  async getReviewStats(): Promise<ApiResponse<ReviewStats>> {
    try {
      const response = await axiosPublic.get('/admin/dashboard/reviews');
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch review statistics',
      };
    }
  }

  /**
   * Get recent activities
   */
  async getRecentActivities(limit: number = 5): Promise<ApiResponse<RecentActivities>> {
    try {
      const response = await axiosPublic.get('/admin/dashboard/recent-activities', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch recent activities',
      };
    }
  }
}

export const dashboardService = new DashboardService();
