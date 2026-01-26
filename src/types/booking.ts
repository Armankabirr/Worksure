export type BookingStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'disputed' | 'awaiting';
export type PaymentStatus = 'paid' | 'unpaid';
export type ServiceCategory = 'cleaning' | 'electrician' | 'plumbing' | 'catering' | 'babysitting' | 'pet-care' | 'ac-doctor';

export interface BookingUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePicture?: string;
}

export interface BookingWorker {
  id: string;
  name: string;
  phone: string;
  email: string;
  profilePicture?: string;
  displayName: string;
  rating: string;
}

export interface PaymentDetails {
  id: string;
  amount: string;
  status: string;
  payment_method: string;
  trx_id?: string;
  paid_at?: string;
}

export interface Booking {
  bookingId: string;
  id?: string; // Backward compatibility with mock data
  bookingNumber?: string; // Backward compatibility with mock data
  user: BookingUser;
  worker: BookingWorker | null;
  service: any; // Service details from order items
  scheduled: string;
  scheduledDate?: string; // Backward compatibility
  scheduledTime?: string; // Backward compatibility
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDetails?: PaymentDetails;
  amount: number;
  totalAmount?: number; // Backward compatibility
  createdAt: string;
  updatedAt: string;
  address: string;
  description?: string;
  adminNotes?: string; // Backward compatibility
  cancelReason?: string | null;
  canceledBy?: string | null;
  // Mock data specific fields
  serviceCategory?: string;
  serviceName?: string;
  serviceSection?: string;
  statusHistory?: any[];
}

export interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  statusCounts: {
    status: string;
    count: number;
  }[];
  paymentStats: {
    paymentCompleted: boolean;
    count: number;
    totalAmount: number;
  }[];
}

export interface BookingFilters {
  search: string;
  status: BookingStatus | 'all';
  category: ServiceCategory | 'all';
  paymentStatus: PaymentStatus | 'all';
  dateFrom: string;
  dateTo: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}
