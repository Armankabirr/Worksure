export type ComplaintStatus = 
  | 'open' 
  | 'under_review' 
  | 'awaiting_response' 
  | 'resolved' 
  | 'rejected' 
  | 'closed';

export type ComplaintPriority = 'low' | 'medium' | 'high';

export type ComplaintRaisedBy = 'user' | 'worker';

export interface ComplaintUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: string;
}

export interface ComplaintBooking {
  id: string;
  status: string;
  scheduledTime: string;
  totalAmount: number;
  description: string;
  address: string;
  serviceName?: string;
  createdAt: string;
}

export interface ComplaintPayment {
  id: string;
  amount: number;
  status: string;
  method: string;
  transactionId?: string;
  paidAt?: string;
}

export interface AdminNote {
  id: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
}

export interface ComplaintTimeline {
  id: string;
  action: string;
  performedBy: string;
  performedByRole: 'user' | 'worker' | 'admin';
  description: string;
  createdAt: string;
}

export interface Complaint {
  id: string;
  complaintId: string;
  category: string;
  subCategory: string;
  subject: string;
  description: string;
  attachments?: string[];
  
  // Parties involved
  raisedBy: ComplaintUser;
  against: ComplaintUser;
  
  // Related entities
  booking: ComplaintBooking | null;
  payment: ComplaintPayment | null;
  
  // Status and priority
  status: ComplaintStatus;
  priority: ComplaintPriority;
  
  // Admin management
  assignedAdmin?: string;
  assignedAdminName?: string;
  adminNotes?: string;
  resolution?: string;
  rejectionReason?: string;
  
  // Timeline
  timeline?: ComplaintTimeline[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

export interface ComplaintFilters {
  search: string;
  status: ComplaintStatus | 'all';
  category: string;
  subCategory: string;
  priority: ComplaintPriority | 'all';
  raisedBy: ComplaintRaisedBy | 'all';
  dateFrom: string;
  dateTo: string;
}

export interface ComplaintStats {
  total: number;
  open: number;
  underReview: number;
  awaitingResponse: number;
  resolved: number;
  rejected: number;
  closed: number;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

// Category to Sub-Category Mapping
export const COMPLAINT_CATEGORIES = {
  "Service Quality": [
    "Poor service quality",
    "Incomplete work",
    "Late arrival / No show",
    "Work not as described",
    "Property damage"
  ],
  "Payment & Billing": [
    "Overcharged",
    "Incorrect invoice",
    "Refund not received",
    "Extra charges added",
    "Payment deducted but failed"
  ],
  "Worker Conduct": [
    "Rude or unprofessional behavior",
    "Safety violation",
    "Harassment or abuse",
    "Fake credentials",
    "Policy violation"
  ],
  "Booking Issue": [
    "Worker cancelled last minute",
    "Booking not confirmed",
    "Wrong service assigned",
    "Rescheduled without notice",
    "Duplicate booking"
  ],
  "Platform / Technical": [
    "App crash",
    "Payment gateway error",
    "Incorrect booking status",
    "Notification not received",
    "Profile or data issue"
  ],
  "Fraud & Trust": [
    "Fake worker",
    "Identity mismatch",
    "Scam attempt",
    "Unauthorized payment",
    "Suspicious activity"
  ],
  "Policy & Compliance": [
    "Terms of service violation",
    "Privacy concern",
    "Data misuse",
    "Legal or compliance issue"
  ],
  "Other": [
    "General feedback",
    "Not listed above"
  ]
} as const;
