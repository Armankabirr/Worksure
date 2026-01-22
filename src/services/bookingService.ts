import axios from 'axios';
import { Booking, BookingStats, BookingFilters, BookingStatus } from '@/types/booking';

// Use the existing axiosPublic instance
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

export const bookingService = {
  // Get all bookings with filters and pagination
  async getAllBookings(
    filters: BookingFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Booking[]>> {
    try {
      const params: any = { page, limit };
      
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.paymentStatus !== 'all') params.paymentStatus = filters.paymentStatus;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await axiosPublic.get('/admin/bookings', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  // Get booking statistics
  async getBookingStats(dateFrom?: string, dateTo?: string): Promise<ApiResponse<BookingStats>> {
    try {
      const params: any = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await axiosPublic.get('/admin/bookings/stats', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      throw error;
    }
  },

  // Update booking status
  async updateBookingStatus(
    bookingId: string,
    status: BookingStatus
  ): Promise<ApiResponse<Booking>> {
    try {
      const response = await axiosPublic.put(
        `/admin/bookings/${bookingId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  // Assign worker to booking
  async assignWorker(bookingId: string, workerId: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await axiosPublic.post(
        `/admin/bookings/${bookingId}/assign-worker`,
        { workerId }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning worker:', error);
      throw error;
    }
  },

  // Cancel booking
  async cancelBooking(bookingId: string, reason: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await axiosPublic.post(
        `/admin/bookings/${bookingId}/cancel`,
        { reason }
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  // Process refund
  async processRefund(bookingId: string, amount: number): Promise<ApiResponse<any>> {
    try {
      const response = await axiosPublic.post(
        `/admin/bookings/${bookingId}/refund`,
        { amount }
      );
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  },

  // Update admin notes
  async updateAdminNotes(bookingId: string, notes: string): Promise<ApiResponse<Booking>> {
    try {
      const response = await axiosPublic.put(
        `/admin/bookings/${bookingId}/notes`,
        { notes }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating admin notes:', error);
      throw error;
    }
  },

  // Export bookings to CSV
  async exportBookings(filters: BookingFilters): Promise<ApiResponse<string>> {
    try {
      const params: any = {};
      
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.paymentStatus !== 'all') params.paymentStatus = filters.paymentStatus;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await axiosPublic.get('/admin/bookings/export', { 
        params,
        responseType: 'text'
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Error exporting bookings:', error);
      throw error;
    }
  },

  // Get booking details by ID
  async getBookingById(bookingId: string): Promise<ApiResponse<any>> {
    try {
      const response = await axiosPublic.get(`/admin/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking details:', error);
      throw error;
    }
  }
};
