import useAxiosPublic from '@/hooks/useAxiosPublic';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const axiosPublic = useAxiosPublic();

interface PaymentFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentMethod?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface PaymentSummary {
  totalPayments: number;
  totalRevenue: number;
  statusBreakdown: {
    [key: string]: {
      count: number;
      total: number;
    };
  };
  methodBreakdown: {
    [key: string]: {
      count: number;
      total: number;
    };
  };
}

interface UserInfo {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
}

interface BookingInfo {
  id: string;
  status: string;
  total_amount: number;
  description?: string;
  address?: string;
  selected_time?: string;
  created_at: string;
  client?: UserInfo;
  worker?: UserInfo & {
    avg_rating?: number;
  };
}

interface PaymentDetail {
  id: string;
  payment_id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  payer?: UserInfo;
  booking?: BookingInfo;
  paid_at?: string;
  created_at: string;
}

interface PaymentResponse {
  payment_id: string;
  amount: number;
  status: string;
  payment_method: string;
  transaction_id: string;
  payer?: {
    id: string;
    name: string;
    email: string;
  };
  booking?: {
    id: string;
    status: string;
    client?: {
      id: string;
      name: string;
      email: string;
    };
  };
  paid_at?: string;
  created_at: string;
}

export const paymentService = {

  /**
   * Get all payments with filters and pagination
   */
  async getPayments(filters: PaymentFilters = {}) {
    try {
      const params = new URLSearchParams();

      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.status) params.append('status', filters.status);
      if (filters.paymentMethod) params.append('paymentMethod', filters.paymentMethod);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.append('dateTo', filters.dateTo);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await axiosPublic.get(`/admin/payments?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  /**
   * Get payment summary statistics
   */
  async getPaymentSummary(dateFrom?: string, dateTo?: string): Promise<PaymentSummary> {
    try {
      const params = new URLSearchParams();

      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);

      const response = await axiosPublic.get(`/admin/payments/summary?${params.toString()}`);

      return response.data.data;
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      throw error;
    }
  },

  /**
   * Get single payment details
   */
  async getPaymentDetails(paymentId: string): Promise<PaymentDetail> {
    try {
      const response = await axiosPublic.get(`/admin/payments/${paymentId}`);
      
      return response.data.data;
    } catch (error) {
      console.error(`Error fetching payment details for ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Refund a payment
   */
  async refundPayment(
    paymentId: string,
    refundReason: string,
    refundAmount?: number
  ): Promise<any> {
    try {
      const response = await axiosPublic.post(
        `/paymentRoutes/refund/${paymentId}`,
        {
          refundReason,
          ...(refundAmount && { refundAmount }),
        }
      );

      return response.data;
    } catch (error) {
      console.error(`Error refunding payment ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Transform API response to component format
   */
  transformPayment(apiPayment: any): PaymentResponse {
    return {
      payment_id: apiPayment.payment_id || apiPayment.id,
      amount: parseFloat(apiPayment.amount),
      status: apiPayment.status,
      payment_method: apiPayment.payment_method,
      transaction_id: apiPayment.transaction_id || apiPayment.trx_id,
      payer: apiPayment.payer || (apiPayment.users ? {
        id: apiPayment.users.id,
        name: apiPayment.users.full_name,
        email: apiPayment.users.email,
      } : undefined),
      booking: apiPayment.booking || (apiPayment.orders ? {
        id: apiPayment.orders.id,
        status: apiPayment.orders.status,
        client: apiPayment.orders.users_orders_client_idTousers ? {
          id: apiPayment.orders.users_orders_client_idTousers.id,
          name: apiPayment.orders.users_orders_client_idTousers.full_name,
          email: apiPayment.orders.users_orders_client_idTousers.email,
        } : undefined,
      } : undefined),
      paid_at: apiPayment.paid_at,
      created_at: apiPayment.created_at,
    };
  },
};

export default paymentService;
