export type BookingStatus = 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
export type PaymentStatus = 'paid' | 'unpaid' | 'refunded';
export type ServiceCategory = 'cleaning' | 'electrician' | 'plumbing' | 'catering' | 'babysitting' | 'pet-care' | 'ac-doctor';

export interface BookingUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  rating: number;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface BookingWorker {
  id: string;
  name: string;
  phone: string;
  verified: boolean;
  rating: number;
  completedJobs: number;
  specialization: string[];
}

export interface Booking {
  id: string;
  bookingNumber: string;
  user: BookingUser;
  worker: BookingWorker | null;
  serviceCategory: ServiceCategory;
  serviceSection: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'bkash' | 'nagad' | 'card' | 'cash';
  transactionId?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  adminNotes?: string;
  statusHistory: {
    status: BookingStatus;
    timestamp: string;
    note?: string;
  }[];
}

export interface BookingStats {
  total: number;
  pending: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

export interface BookingFilters {
  search: string;
  status: BookingStatus | 'all';
  category: ServiceCategory | 'all';
  paymentStatus: PaymentStatus | 'all';
  dateFrom: string;
  dateTo: string;
}
