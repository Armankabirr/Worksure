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
