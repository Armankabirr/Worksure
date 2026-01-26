export type ReviewStatus = 'active' | 'approved' | 'hidden' | 'flagged' | 'deleted';

export interface Review {
  review_id: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  created_at: string;
  user: {
    id: string;
    name: string;
  } | null;
  worker: {
    id: string;
    name: string;
    avg_rating: number;
  } | null;
  service: {
    category: string | null;
    section: string | null;
  } | null;
  booking_id: string | null;
}

export interface ReviewFilters {
  search: string;
  status: ReviewStatus | 'all';
  rating: number | 'all';
  category: string;
  section: string;
  dateFrom: string;
  dateTo: string;
  flaggedOnly: boolean;
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  flagged_count: number;
  hidden_count: number;
  deleted_count: number;
  by_rating: {
    [key: number]: number;
  };
}

export interface ReviewDetailData extends Review {
  images?: string[];
  user_summary?: {
    total_reviews: number;
    flag_history: number;
  };
  worker_summary?: {
    avg_rating: number;
    total_reviews: number;
    verification_status: string;
  };
  booking_context?: {
    booking_id: string;
    service_date: string;
    service_details: string;
  };
  admin_notes?: string;
}
