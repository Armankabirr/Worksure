// Types and interfaces for Worker Dashboard

export interface ExtraItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  status: "pending" | "approved" | "rejected";
}

export interface ApiServiceRequest {
  id: string;
  client_id?: string;
  assigned_worker_id?: string;
  selected_date?: string | null;
  selected_time?: string | null;
  address?: string | null;
  description?: string | null;
  status?: string | null;
  total_amount?: number | null;
  payment_completed?: boolean | null;
  is_reviewed?: boolean;
  is_complained?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  work_start?: string | null;
  work_end?: string | null;
  users_orders_client_idTousers?: {
    select?: {
      full_name?: string;
      email?: string;
      phone?: string;
      profile_picture?: string;
    };
    full_name?: string;
    email?: string;
    phone?: string;
    profile_picture?: string;
  };
  extra_items?: ExtraItem[];
  base_price?: number;
  labor_cost?: number;
}

export interface UpcomingDay {
  date: string;
  day_name?: string;
  appointments: number;
  total_appointments?: number;
}

// Dashboard Overview API Response Types
export interface DashboardTodayWork {
  booking_id: string;
  client_name: string;
  service_name: string;
  start_time: string;
  countdown: string;
  location: string;
  status: string;
  client_picture?: string;
}

export interface DashboardUpcomingWork {
  booking_id: string;
  client_name: string;
  service_name: string;
  scheduled_date: string;
  scheduled_time?: string;
  days_until: string;
  location: string;
  client_picture?: string;
}

export interface DashboardServiceRequest {
  request_id: string;
  client_name: string;
  client_email: string;
  client_picture?: string;
  task: string;
  task_name?: string;
  service_name?: string;
  location: string;
  status: string;
  scheduled_date?: string;
  scheduled_time?: string;
  description?: string;
  total_amount?: number;
}

export interface DashboardSummary {
  todaysAppointments: number;
  confirmed: number;
  pending: number;
  completed: number;
}

export interface DashboardOverviewResponse {
  success: boolean;
  worker_name: string;
  summary: DashboardSummary;
  todaysWorks: DashboardTodayWork[];
  upcomingWorks: DashboardUpcomingWork[];
  upcomingDays: UpcomingDay[];
  serviceRequests: DashboardServiceRequest[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ProfileFormData {
  name: string;
  phone: string;
  avatarUrl: string;
  nidNumber: string;
  address: string;
  dateOfBirth: string;
  speciality: string;
  experience: string;
  certification: string;
  serviceAreas: string;
  hourlyRate: string;
  availability: string;
}

export interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CompleteFormData {
  workStartTime: string;
  workEndTime: string;
  completionNotes: string;
}

export interface NewExtraItemData {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface WorkerStats {
  todayAppointments: number;
  confirmed: number;
  pending: number;
  availableSlots: number;
}

// Worker Dashboard Details API Response Types
export interface WorkerProfile {
  display_name?: string;
  bio?: string;
  years_experience?: number;
  avg_rating?: number;
  total_reviews?: number;
  verification?: string;
  documents_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ServiceSection {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface WorkerService {
  id: string;
  base_price?: number;
  price_unit?: string;
  skills?: string[];
  created_at?: string;
  service_categories?: ServiceCategory;
  service_sections?: ServiceSection;
}

export interface WorkerAvailability {
  id: string;
  available_from?: string;
  available_to?: string;
  weekend?: boolean;
}

export interface WorkerAddress {
  id: string;
  street?: string;
  city?: string;
  district?: string;
  postal_code?: string;
  lat?: number;
  lon?: number;
}

export interface WorkerReviewReviewer {
  id: string;
  full_name?: string;
  profile_picture?: string;
}

export interface WorkerReview {
  id: string;
  rating?: number;
  comment?: string;
  created_at?: string;
  users_reviews_reviewer_idTousers?: WorkerReviewReviewer;
}

export interface WorkerDetailsData {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  gender?: string;
  role?: string;
  date_of_birth?: string;
  profile_picture?: string;
  created_at?: string;
  last_login_at?: string;
  status?: string;
  worker_profiles?: WorkerProfile[];
  worker_services?: WorkerService[];
  availabilities?: WorkerAvailability[];
  addresses?: WorkerAddress[];
  reviews_reviews_worker_idTousers?: WorkerReview[];
}

export interface WorkerDetailsResponse {
  success: boolean;
  data: WorkerDetailsData;
}
