import axios from 'axios';
import { Review, ReviewFilters, ReviewStats, ReviewStatus, ReviewDetailData } from '@/types/review';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}

export const reviewService = {
  // Get all reviews with filters and pagination
  async getAllReviews(
    filters: ReviewFilters,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ApiResponse<Review[]>> {
    try {
      const params: any = { page, limit, sortBy, sortOrder };
      
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.rating !== 'all') params.rating = filters.rating;
      if (filters.category) params.category = filters.category;
      if (filters.section) params.section = filters.section;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;
      if (filters.flaggedOnly) params.flaggedOnly = true;

      const response = await axiosPublic.get('/admin/reviews', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Get review statistics
  async getReviewStats(dateFrom?: string, dateTo?: string): Promise<ApiResponse<ReviewStats>> {
    try {
      const response = await axiosPublic.get('/admin/reviews/summary');
      
      // Transform the API response to match ReviewStats interface
      if (response.data.success && response.data.data) {
        const data = response.data.data;
        const transformedStats: ReviewStats = {
          total_reviews: data.totalReviews || 0,
          average_rating: data.averageRating || 0,
          flagged_count: 0, // Not available in new API
          hidden_count: 0, // Not available in new API
          deleted_count: 0, // Not available in new API
          by_rating: {
            1: data.ratingBreakdown?.one || 0,
            2: data.ratingBreakdown?.two || 0,
            3: data.ratingBreakdown?.three || 0,
            4: data.ratingBreakdown?.four || 0,
            5: data.ratingBreakdown?.five || 0,
          }
        };
        
        return {
          success: true,
          data: transformedStats
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  },

  // Get review details by ID
  async getReviewById(reviewId: string): Promise<ApiResponse<ReviewDetailData>> {
    try {
      const response = await axiosPublic.get(`/admin/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching review details:', error);
      throw error;
    }
  },

  // Update review status
  async updateReviewStatus(
    reviewId: string,
    status: ReviewStatus,
    adminNotes?: string
  ): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosPublic.put(
        `/admin/reviews/${reviewId}/status`,
        { status, adminNotes }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating review status:', error);
      throw error;
    }
  },

  // Approve review
  async approveReview(reviewId: string): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosPublic.post(`/admin/reviews/${reviewId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving review:', error);
      throw error;
    }
  },

  // Hide review
  async hideReview(reviewId: string, reason?: string): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosPublic.post(
        `/admin/reviews/${reviewId}/hide`,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error hiding review:', error);
      throw error;
    }
  },

  // Flag review
  async flagReview(reviewId: string, reason: string): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosPublic.post(
        `/admin/reviews/${reviewId}/flag`,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error flagging review:', error);
      throw error;
    }
  },

  // Delete review permanently
  async deleteReview(reviewId: string, reason: string): Promise<ApiResponse<void>> {
    try {
      const response = await axiosPublic.delete(`/admin/deleteReview/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Update admin notes
  async updateAdminNotes(reviewId: string, notes: string): Promise<ApiResponse<Review>> {
    try {
      const response = await axiosPublic.put(
        `/admin/reviews/${reviewId}/notes`,
        { notes }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating admin notes:', error);
      throw error;
    }
  }
};
