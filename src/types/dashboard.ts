/**
 * Dashboard Types
 * Type definitions for admin dashboard data
 */

export interface DashboardSummary {
  users: {
    total: number;
    new: number;
  };
  workers: {
    total: number;
    pending_verification: number;
  };
  bookings: {
    total: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    total: number;
    platform_earnings: number;
  };
  complaints: {
    open: number;
    under_review: number;
  };
}

export interface BookingStats {
  labels: string[];
  data: number[];
  status_breakdown: {
    completed: number;
    cancelled: number;
    ongoing: number;
  };
}

export interface DailyRevenue {
  date: string;
  amount: number;
}

export interface RevenueStats {
  daily_revenue: DailyRevenue[];
  pending_payouts: number;
  refunds: number;
}

export interface UrgentComplaint {
  id: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface ComplaintStats {
  open: number;
  under_review: number;
  resolved: number;
  closed: number;
  awaiting_response: number;
  urgent: UrgentComplaint[];
}

export interface RatingDistribution {
  '5_star': number;
  '4_star': number;
  '3_star': number;
  '2_star': number;
  '1_star': number;
}

export interface ReviewStats {
  average_rating: number;
  total_reviews: number;
  new_reviews: number;
  low_ratings: number;
  rating_distribution: RatingDistribution;
}

export interface RecentBooking {
  id: string;
  status: string;
  created_at: string;
  total_amount: string;
  users_orders_client_idTousers: {
    full_name: string;
  };
}

export interface RecentUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface RecentComplaint {
  id: string;
  category: string;
  status: string;
  priority: string;
  created_at: string;
}

export interface RecentActivities {
  recent_bookings: RecentBooking[];
  recent_users: RecentUser[];
  recent_complaints: RecentComplaint[];
}

export type DateRange = '7d' | '30d' | '90d' | 'custom';

export interface DateRangeFilter {
  range: DateRange;
  start_date?: string;
  end_date?: string;
}
