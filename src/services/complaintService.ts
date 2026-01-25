import axios from 'axios';
import { Complaint, ComplaintFilters, ComplaintStats, ComplaintStatus } from '@/types/complaint';

// Create axios instance using the same configuration as useAxiosPublic
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

class ComplaintService {
  /**
   * Get all complaints with filters
   */
  async getAllComplaints(
    filters: ComplaintFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<Complaint[]>> {
    try {
      const params: Record<string, string> = {};

      // Only send required query params: status, category, priority
      if (filters.status && filters.status !== 'all') params.status = filters.status;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.priority && filters.priority !== 'all') params.priority = filters.priority;

      const response = await axiosPublic.get('/complaints/getAllcomplaints', { params });
      console.log("complints: ",response);
      

      const apiResponse = response.data;
      
      // Transform API response to match our interface
      if (apiResponse.success && apiResponse.data) {
        const transformedData = apiResponse.data.map((complaint: any) => ({
          id: complaint.id,
          complaintId: complaint.id.substring(0, 8).toUpperCase(),
          category: complaint.category,
          subCategory: complaint.sub_category,
          subject: complaint.category + ' - ' + complaint.sub_category,
          description: complaint.description,
          attachments: complaint.attachments ? JSON.parse(complaint.attachments) : [],
          raisedBy: {
            id: complaint.raised_by_user_id,
            name: '',
            email: '',
            phone: '',
            role: complaint.raised_by_role,
          },
          against: {
            id: complaint.against_user_id,
            name: '',
            email: '',
            phone: '',
            role: complaint.raised_by_role === 'client' ? 'worker' : 'client',
          },
          booking: complaint.booking_id ? {
            id: complaint.booking_id,
            status: 'completed',
            scheduledTime: '',
            totalAmount: 0,
            description: '',
            address: '',
            createdAt: '',
          } : null,
          payment: complaint.payment_id ? {
            id: complaint.payment_id,
            amount: 0,
            status: 'paid',
            method: '',
          } : null,
          status: complaint.status,
          priority: complaint.priority,
          adminNotes: complaint.admin_notes,
          resolution: complaint.resolution,
          createdAt: complaint.created_at,
          updatedAt: complaint.updated_at,
          resolvedAt: complaint.resolved_at,
        }));

        return {
          success: true,
          data: transformedData,
          pagination: {
            page,
            limit,
            totalCount: apiResponse.count || transformedData.length,
            totalPages: Math.ceil((apiResponse.count || transformedData.length) / limit),
          },
        };
      }

      return apiResponse;
    } catch (error) {
      console.error('Error fetching complaints:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get complaint statistics
   */
  async getComplaintStats(dateFrom?: string, dateTo?: string): Promise<ApiResponse<ComplaintStats>> {
    try {
      const params: Record<string, string> = {};
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;

      const response = await axiosPublic.get('/admin/complaints/stats', { params });

      return response.data;
    } catch (error) {
      console.error('Error fetching complaint stats:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Get a single complaint by ID
   */
  async getComplaintById(complaintId: string): Promise<ApiResponse<Complaint>> {
    try {
      const response = await axiosPublic.get(`/complaints/getComplaintDetailsById/${complaintId}`);
      const apiResponse = response.data;

      // Transform API response to match our interface
      if (apiResponse.success && apiResponse.data) {
        const data = apiResponse.data;
        const transformedData: Complaint = {
          id: data.id,
          complaintId: data.id.substring(0, 8).toUpperCase(),
          category: data.category,
          subCategory: data.subCategory,
          subject: data.category + ' - ' + data.subCategory,
          description: data.description,
          attachments: data.attachments ? (typeof data.attachments === 'string' ? JSON.parse(data.attachments) : data.attachments) : [],
          raisedBy: data.raisedBy,
          against: data.against,
          booking: data.booking,
          payment: data.payment,
          status: data.status,
          priority: data.priority,
          adminNotes: data.adminNotes,
          resolution: data.resolution,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          resolvedAt: data.resolvedAt,
        };

        return {
          success: true,
          data: transformedData,
        };
      }

      return apiResponse;
    } catch (error) {
      console.error('Error fetching complaint details:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Update complaint status
   */
  async updateComplaintStatus(
    complaintId: string,
    status: ComplaintStatus,
    admin_notes?: string,
    resolution?: string
  ): Promise<ApiResponse<Complaint>> {
    try {
      const response = await axiosPublic.patch(
        `/complaints/updatecomplaintStatus/${complaintId}`,
        { 
          status, 
          admin_notes: admin_notes || null,
          resolution: resolution || null 
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Assign complaint to admin
   */
  async assignComplaint(complaintId: string, adminId: string): Promise<ApiResponse<Complaint>> {
    try {
      const response = await axiosPublic.patch(
        `/admin/complaints/${complaintId}/assign`,
        { adminId }
      );

      return response.data;
    } catch (error) {
      console.error('Error assigning complaint:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Add admin note to complaint
   */
  async addAdminNote(complaintId: string, note: string, currentStatus?: ComplaintStatus): Promise<ApiResponse<Complaint>> {
    try {
      const response = await axiosPublic.patch(
        `/complaints/updatecomplaintStatus/${complaintId}`,
        { 
          status: currentStatus || 'under_review',
          admin_notes: note,
          resolution: null 
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error adding admin note:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Resolve complaint
   */
  async resolveComplaint(
    complaintId: string,
    resolution: string
  ): Promise<ApiResponse<Complaint>> {
    try {
      const response = await axiosPublic.patch(
        `/complaints/updatecomplaintStatus/${complaintId}`,
        { 
          status: 'resolved',
          admin_notes: null,
          resolution 
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error resolving complaint:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  /**
   * Reject complaint
   */
  async rejectComplaint(
    complaintId: string,
    rejectionReason: string
  ): Promise<ApiResponse<Complaint>> {
    try {
      const response = await axiosPublic.patch(
        `/complaints/updatecomplaintStatus/${complaintId}`,
        { 
          status: 'rejected',
          admin_notes: rejectionReason,
          resolution: null 
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error rejecting complaint:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

}

export const complaintService = new ComplaintService();
