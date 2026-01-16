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
  appointments: number;
  availableSlots: number;
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
