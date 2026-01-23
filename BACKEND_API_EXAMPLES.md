# Backend API Integration Examples

This document shows the API endpoints and response formats needed to connect the Admin Bookings page to your backend.

---

## 1. Get All Bookings

**Endpoint:** `GET /api/admin/bookings`

**Query Parameters:**
```
?search=string          // Search term
&status=string          // pending|accepted|ongoing|completed|cancelled|all
&category=string        // cleaning|electrician|plumbing|etc|all
&paymentStatus=string   // paid|unpaid|refunded|all
&dateFrom=string        // ISO date string
&dateTo=string          // ISO date string
&page=number           // Pagination page number (default: 1)
&limit=number          // Items per page (default: 8)
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
        "bookingNumber": "BK-2026-0001",
        "user": {
          "id": "u1a2b3c4-d5e6-7890-abcd-ef1234567890",
          "name": "Rahul Ahmed",
          "phone": "+880 1712-345678",
          "email": "rahul@example.com",
          "rating": 4.5,
          "address": "House 23, Road 5, Dhanmondi, Dhaka",
          "location": {
            "lat": 23.7461,
            "lng": 90.3742
          }
        },
        "worker": {
          "id": "w1a2b3c4-d5e6-7890-abcd-ef1234567890",
          "name": "Karim Khan",
          "phone": "+880 1823-456789",
          "verified": true,
          "rating": 4.8,
          "completedJobs": 145,
          "specialization": ["AC Repair", "AC Installation", "AC Maintenance"]
        },
        "serviceCategory": "ac-doctor",
        "serviceSection": "AC Repair",
        "serviceName": "Split AC Gas Refill",
        "scheduledDate": "2026-01-25T00:00:00.000Z",
        "scheduledTime": "10:00 AM",
        "status": "accepted",
        "paymentStatus": "paid",
        "paymentMethod": "bkash",
        "transactionId": "TRX20260122001",
        "totalAmount": 1500,
        "createdAt": "2026-01-22T08:30:00.000Z",
        "updatedAt": "2026-01-22T09:15:00.000Z",
        "adminNotes": "Customer requested morning slot",
        "statusHistory": [
          {
            "status": "pending",
            "timestamp": "2026-01-22T08:30:00.000Z",
            "note": null
          },
          {
            "status": "accepted",
            "timestamp": "2026-01-22T09:15:00.000Z",
            "note": "Worker accepted the booking"
          }
        ]
      }
      // ... more bookings
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 40,
      "itemsPerPage": 8,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "stats": {
      "total": 40,
      "pending": 8,
      "ongoing": 5,
      "completed": 25,
      "cancelled": 2
    }
  }
}
```

**Error Response (400/500):**
```json
{
  "success": false,
  "error": {
    "code": "FETCH_BOOKINGS_ERROR",
    "message": "Failed to fetch bookings",
    "details": "Database connection error"
  }
}
```

---

## 2. Get Single Booking Details

**Endpoint:** `GET /api/admin/bookings/:bookingId`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "bookingNumber": "BK-2026-0001",
    "user": {
      "id": "u1a2b3c4-d5e6-7890-abcd-ef1234567890",
      "name": "Rahul Ahmed",
      "phone": "+880 1712-345678",
      "email": "rahul@example.com",
      "rating": 4.5,
      "address": "House 23, Road 5, Dhanmondi, Dhaka",
      "location": {
        "lat": 23.7461,
        "lng": 90.3742
      }
    },
    // ... full booking object (same structure as above)
  }
}
```

---

## 3. Update Booking Status

**Endpoint:** `PATCH /api/admin/bookings/:bookingId/status`

**Request Body:**
```json
{
  "status": "accepted",
  "note": "Status changed by admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking status updated successfully",
  "data": {
    "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "accepted",
    "updatedAt": "2026-01-22T10:30:00.000Z",
    "statusHistory": [
      {
        "status": "pending",
        "timestamp": "2026-01-22T08:30:00.000Z"
      },
      {
        "status": "accepted",
        "timestamp": "2026-01-22T10:30:00.000Z",
        "note": "Status changed by admin"
      }
    ]
  }
}
```

---

## 4. Assign/Reassign Worker

**Endpoint:** `PATCH /api/admin/bookings/:bookingId/assign-worker`

**Request Body:**
```json
{
  "workerId": "w1a2b3c4-d5e6-7890-abcd-ef1234567890",
  "note": "Assigned by admin"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Worker assigned successfully",
  "data": {
    "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "worker": {
      "id": "w1a2b3c4-d5e6-7890-abcd-ef1234567890",
      "name": "Karim Khan",
      "phone": "+880 1823-456789",
      "verified": true,
      "rating": 4.8,
      "completedJobs": 145,
      "specialization": ["AC Repair", "AC Installation"]
    },
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
}
```

---

## 5. Cancel Booking

**Endpoint:** `PATCH /api/admin/bookings/:bookingId/cancel`

**Request Body:**
```json
{
  "reason": "Customer requested cancellation",
  "refundRequired": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "status": "cancelled",
    "paymentStatus": "refunded",
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
}
```

---

## 6. Process Refund

**Endpoint:** `POST /api/admin/bookings/:bookingId/refund`

**Request Body:**
```json
{
  "amount": 1500,
  "reason": "Booking cancelled by customer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "data": {
    "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "paymentStatus": "refunded",
    "refundAmount": 1500,
    "refundTransactionId": "REF20260122001",
    "refundedAt": "2026-01-22T10:30:00.000Z",
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
}
```

---

## 7. Update Admin Notes

**Endpoint:** `PATCH /api/admin/bookings/:bookingId/notes`

**Request Body:**
```json
{
  "notes": "Customer requested morning slot. Worker has been notified."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Admin notes updated successfully",
  "data": {
    "id": "b1a2c3d4-e5f6-7890-abcd-ef1234567890",
    "adminNotes": "Customer requested morning slot. Worker has been notified.",
    "updatedAt": "2026-01-22T10:30:00.000Z"
  }
}
```

---

## 8. Export Bookings Data

**Endpoint:** `GET /api/admin/bookings/export`

**Query Parameters:**
```
?format=csv|excel|pdf
&status=string
&category=string
&dateFrom=string
&dateTo=string
```

**Success Response (200):**
- Returns file download
- Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` or `application/pdf`
- Content-Disposition: `attachment; filename="bookings-export-2026-01-22.csv"`

---

## Integration Code Examples

### 1. Create API Service File

Create `src/services/bookingService.ts`:

```typescript
import axios from 'axios';
import { Booking, BookingFilters, BookingStatus } from '@/types/booking';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const bookingService = {
  // Get all bookings with filters
  async getAllBookings(filters: BookingFilters, page: number = 1, limit: number = 8) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.status !== 'all') params.append('status', filters.status);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.paymentStatus !== 'all') params.append('paymentStatus', filters.paymentStatus);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await axios.get(`${API_BASE_URL}/admin/bookings?${params.toString()}`);
    return response.data;
  },

  // Get single booking
  async getBookingById(bookingId: string) {
    const response = await axios.get(`${API_BASE_URL}/admin/bookings/${bookingId}`);
    return response.data;
  },

  // Update booking status
  async updateBookingStatus(bookingId: string, status: BookingStatus, note?: string) {
    const response = await axios.patch(`${API_BASE_URL}/admin/bookings/${bookingId}/status`, {
      status,
      note
    });
    return response.data;
  },

  // Assign worker
  async assignWorker(bookingId: string, workerId: string, note?: string) {
    const response = await axios.patch(`${API_BASE_URL}/admin/bookings/${bookingId}/assign-worker`, {
      workerId,
      note
    });
    return response.data;
  },

  // Cancel booking
  async cancelBooking(bookingId: string, reason: string, refundRequired: boolean = true) {
    const response = await axios.patch(`${API_BASE_URL}/admin/bookings/${bookingId}/cancel`, {
      reason,
      refundRequired
    });
    return response.data;
  },

  // Process refund
  async processRefund(bookingId: string, amount: number, reason: string) {
    const response = await axios.post(`${API_BASE_URL}/admin/bookings/${bookingId}/refund`, {
      amount,
      reason
    });
    return response.data;
  },

  // Update admin notes
  async updateAdminNotes(bookingId: string, notes: string) {
    const response = await axios.patch(`${API_BASE_URL}/admin/bookings/${bookingId}/notes`, {
      notes
    });
    return response.data;
  },

  // Export bookings
  async exportBookings(filters: BookingFilters, format: 'csv' | 'excel' | 'pdf' = 'csv') {
    const params = new URLSearchParams();
    params.append('format', format);
    
    if (filters.status !== 'all') params.append('status', filters.status);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    const response = await axios.get(`${API_BASE_URL}/admin/bookings/export?${params.toString()}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bookings-export-${new Date().toISOString().split('T')[0]}.${format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  }
};
```

### 2. Update AdminBookings.tsx to Use API

Replace the mock data parts with API calls:

```typescript
import { useState, useEffect, useMemo } from 'react';
import { bookingService } from '@/services/bookingService';
// ... other imports

const AdminBookings = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0
  });
  
  // ... other state

  // Fetch bookings from API
  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await bookingService.getAllBookings(filters, currentPage);
      
      if (response.success) {
        setBookings(response.data.bookings);
        setStats(response.data.stats);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bookings on mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [filters, currentPage]);

  // Update status handler
  const handleChangeStatus = async (booking: Booking, newStatus: BookingStatus) => {
    try {
      const response = await bookingService.updateBookingStatus(
        booking.id,
        newStatus,
        'Status changed by admin'
      );

      if (response.success) {
        // Update local state
        setBookings(prev =>
          prev.map(b =>
            b.id === booking.id
              ? { ...b, status: newStatus, statusHistory: response.data.statusHistory }
              : b
          )
        );

        toast({
          title: 'Status Updated',
          description: `Booking ${booking.bookingNumber} status changed to ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status',
        variant: 'destructive',
      });
    }
  };

  // Cancel booking handler
  const handleConfirmCancel = async () => {
    if (!actionDialog.booking) return;

    try {
      const response = await bookingService.cancelBooking(
        actionDialog.booking.id,
        'Cancelled by admin',
        true
      );

      if (response.success) {
        // Refresh bookings
        await fetchBookings();

        toast({
          title: 'Booking Cancelled',
          description: `Booking ${actionDialog.booking.bookingNumber} has been cancelled`,
        });
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel booking',
        variant: 'destructive',
      });
    } finally {
      setActionDialog({ isOpen: false, type: null, booking: null });
    }
  };

  // Process refund handler
  const handleConfirmRefund = async () => {
    if (!actionDialog.booking) return;

    try {
      const response = await bookingService.processRefund(
        actionDialog.booking.id,
        actionDialog.booking.totalAmount,
        'Booking cancelled'
      );

      if (response.success) {
        // Update local state
        setBookings(prev =>
          prev.map(b =>
            b.id === actionDialog.booking!.id
              ? { ...b, paymentStatus: 'refunded' }
              : b
          )
        );

        toast({
          title: 'Refund Processed',
          description: `Refund of ৳${actionDialog.booking.totalAmount} processed successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to process refund:', error);
      toast({
        title: 'Error',
        description: 'Failed to process refund',
        variant: 'destructive',
      });
    } finally {
      setActionDialog({ isOpen: false, type: null, booking: null });
    }
  };

  // Update notes handler
  const handleUpdateNotes = async (bookingId: string, notes: string) => {
    try {
      const response = await bookingService.updateAdminNotes(bookingId, notes);

      if (response.success) {
        setBookings(prev =>
          prev.map(b =>
            b.id === bookingId
              ? { ...b, adminNotes: notes }
              : b
          )
        );

        toast({
          title: 'Notes Saved',
          description: 'Admin notes updated successfully',
        });
      }
    } catch (error) {
      console.error('Failed to update notes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notes',
        variant: 'destructive',
      });
    }
  };

  // Export handler
  const handleExportData = async () => {
    try {
      toast({
        title: 'Export Started',
        description: 'Preparing your export file...',
      });

      await bookingService.exportBookings(filters, 'csv');

      toast({
        title: 'Export Complete',
        description: 'Your file has been downloaded',
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive',
      });
    }
  };

  // ... rest of component
};
```

### 3. Environment Variables

Add to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

For production (`.env.production`):

```env
VITE_API_BASE_URL=https://api.worksure.com/api
```

---

## Backend Implementation Tips

### Database Schema

**Bookings Table:**
```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_number VARCHAR(50) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id),
    worker_id UUID REFERENCES workers(id),
    service_category VARCHAR(50) NOT NULL,
    service_section VARCHAR(100) NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    payment_method VARCHAR(20),
    transaction_id VARCHAR(100),
    total_amount DECIMAL(10, 2) NOT NULL,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE booking_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    status VARCHAR(20) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Authentication

Add JWT token to all API requests:

```typescript
// In axios interceptor
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Error Handling

```typescript
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Testing the Integration

1. **Start your backend server**
2. **Update environment variables**
3. **Test each feature:**
   - Load bookings list
   - Filter bookings
   - View booking details
   - Change booking status
   - Cancel booking
   - Process refund
   - Update admin notes
   - Export data

---

This should give you everything you need to connect your Admin Bookings page to a real backend!
