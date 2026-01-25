// Profile page type definitions

export interface Address {
  street: string;
  city: string;
  district: string;
  postal_code: string;
  lat: string;
  lon: string;
}

export interface UserData {
  email: string;
  phone: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  role: string;
  profile_picture: string;
  status: string;
  addresses: Address[];
}

export interface WorkerProfile {
  display_name: string;
  avg_rating: number;
  total_reviews: number;
}

export interface Worker {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  profile_picture: string;
  worker_profiles: WorkerProfile;
}

export interface Hiring {
  id: string;
  client_id: string;
  assigned_worker_id: string;
  selected_time: string;
  address: string;
  description: string;
  status: string;
  total_amount: number;
  payment_completed: boolean;
  is_reviewed?: boolean;
  is_complained?: boolean;
  created_at: string;
  work_start: string;
  work_end: string;
  worker: Worker;
  users_orders_assigned_worker_idTousers?: Worker;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  gender: string;
  date_of_birth: string;
  bio: string;
  avatar: string;
  address: string;
}

export type ActiveMenuType = "my-profile" | "my-hirings" | "my-reviews" | "saved-services";

// User Reviews API Response Types
export interface OrderDetails {
  description: string;
  status: string;
  service_date: string;
}

export interface ReviewWorker {
  id: string;
  name: string;
  display_name: string;
  profile_picture: string;
  avg_rating: string;
}

export interface UserReviewItem {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  order_id: string;
  order_details: OrderDetails;
  worker: ReviewWorker;
}

export interface UserReviewPagination {
  current_page: number;
  total_pages: number;
  per_page: number;
  total_count: number;
}

export interface UserReviewsData {
  user_id: string;
  user_name: string;
  total_reviews: number;
  reviews: UserReviewItem[];
  pagination: UserReviewPagination;
}

export interface UserReviewsResponse {
  success: boolean;
  data: UserReviewsData;
}
