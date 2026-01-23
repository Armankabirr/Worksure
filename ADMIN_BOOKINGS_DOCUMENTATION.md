# Admin Bookings Management System - Documentation

## Overview

The Admin Bookings Management system is a comprehensive solution for managing service bookings in the WorkSure platform. It provides a complete interface for administrators to monitor, filter, and manage all booking transactions between customers and service workers.

## Features

### 📊 Dashboard Statistics
- **Real-time Booking Stats**: Display total, pending, ongoing, completed, and cancelled bookings
- **Color-coded Cards**: Visual indicators for each booking status
- **Responsive Grid Layout**: Adapts to different screen sizes

### 🔍 Advanced Filtering System
- **Search Functionality**: Search by booking ID, user name, phone, or worker name
- **Status Filter**: Filter by booking status (pending, accepted, ongoing, completed, cancelled)
- **Category Filter**: Filter by service category (cleaning, electrician, plumbing, etc.)
- **Payment Filter**: Filter by payment status (paid, unpaid, refunded)
- **Date Range Filter**: Filter bookings by scheduled date range
- **Clear Filters**: One-click option to reset all filters

### 📋 Comprehensive Booking Table
- **Sortable Columns**: Click column headers to sort data
- **Pagination**: Navigate through large datasets efficiently (8 items per page)
- **Status Badges**: Color-coded badges for quick visual identification
- **Worker Verification Icons**: Visual indicators for verified workers
- **Action Menu**: Per-row actions for managing individual bookings

### 🔍 Detailed Booking View
- **Status Timeline**: Visual representation of booking status progression
- **Service Information**: Complete service details with schedule
- **Customer Information**: Full customer profile with contact details and ratings
- **Worker Information**: Assigned worker details with specializations and ratings
- **Payment Information**: Transaction details and payment method
- **Admin Notes**: Internal notes system for tracking important information

### ⚙️ Booking Management Actions
- **View Details**: Comprehensive booking information in a side drawer
- **Assign/Reassign Worker**: Assign workers to pending bookings
- **Change Status**: Update booking status with confirmation
- **Cancel Booking**: Cancel bookings with admin notes
- **Process Refund**: Handle refund requests for cancelled bookings
- **Update Notes**: Add or modify internal admin notes

## File Structure

```
src/
├── types/
│   └── booking.ts                          # TypeScript types for bookings
├── lib/
│   └── mockBookingData.ts                  # Mock booking data and utilities
├── components/
│   └── admin/
│       ├── BookingStatsCards.tsx           # Statistics dashboard cards
│       ├── BookingFilters.tsx              # Filter and search component
│       ├── BookingTable.tsx                # Main bookings table
│       └── BookingDetailsDrawer.tsx        # Detailed booking view
└── pages/
    └── Dashboard/
        └── AdminBookings.tsx               # Main admin bookings page
```

## Components

### 1. AdminBookings (Main Page)
**Location**: `src/pages/Dashboard/AdminBookings.tsx`

Main container component that orchestrates all booking management functionality.

**Key Features**:
- State management for bookings, filters, and UI interactions
- Filter logic with memoization for performance
- Action handlers for all booking operations
- Toast notifications for user feedback
- Confirmation dialogs for critical actions

**Props**: None (Root component)

### 2. BookingStatsCards
**Location**: `src/components/admin/BookingStatsCards.tsx`

Displays summary statistics for bookings.

**Props**:
- `stats: BookingStats` - Statistics object containing counts
- `isLoading?: boolean` - Loading state indicator

**Features**:
- 5 stat cards (Total, Pending, Ongoing, Completed, Cancelled)
- Color-coded icons and backgrounds
- Loading skeleton states
- Responsive grid layout

### 3. BookingFiltersComponent
**Location**: `src/components/admin/BookingFilters.tsx`

Advanced filtering and search interface.

**Props**:
- `filters: BookingFilters` - Current filter state
- `onFiltersChange: (filters: BookingFilters) => void` - Filter update callback
- `onClearFilters: () => void` - Clear filters callback

**Features**:
- Full-text search across multiple fields
- Multiple dropdown filters
- Date range selection
- Show/Hide filters toggle
- Clear filters button (only shows when filters are active)

### 4. BookingTable
**Location**: `src/components/admin/BookingTable.tsx`

Main data table for displaying bookings.

**Props**:
- `bookings: Booking[]` - Array of bookings to display
- `onViewDetails: (booking: Booking) => void` - View details callback
- `onAssignWorker: (booking: Booking) => void` - Assign worker callback
- `onChangeStatus: (booking: Booking, newStatus: BookingStatus) => void` - Status change callback
- `onCancelBooking: (booking: Booking) => void` - Cancel booking callback
- `onRefundPayment: (booking: Booking) => void` - Refund callback

**Features**:
- Sortable columns
- Pagination (8 items per page)
- Color-coded status and payment badges
- Worker verification indicators
- Context menu for actions
- Empty state handling
- Responsive design

### 5. BookingDetailsDrawer
**Location**: `src/components/admin/BookingDetailsDrawer.tsx`

Side drawer showing comprehensive booking information.

**Props**:
- `booking: Booking | null` - Selected booking data
- `isOpen: boolean` - Drawer visibility state
- `onClose: () => void` - Close callback
- `onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void` - Status update callback
- `onUpdateNotes: (bookingId: string, notes: string) => void` - Notes update callback

**Features**:
- Status timeline with visual indicators
- Comprehensive information cards
- Inline status change functionality
- Admin notes editor
- Customer and worker profiles
- Payment transaction details
- Scrollable content area

## Data Types

### Booking
```typescript
interface Booking {
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
  statusHistory: StatusHistoryItem[];
}
```

### BookingStats
```typescript
interface BookingStats {
  total: number;
  pending: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}
```

### BookingFilters
```typescript
interface BookingFilters {
  search: string;
  status: BookingStatus | 'all';
  category: ServiceCategory | 'all';
  paymentStatus: PaymentStatus | 'all';
  dateFrom: string;
  dateTo: string;
}
```

## Mock Data

The system includes 10 comprehensive mock bookings with varied statuses, payment methods, and service categories. Mock data is located in `src/lib/mockBookingData.ts`.

**Mock Bookings Include**:
- Different booking statuses
- Various service categories
- Verified and unverified workers
- Different payment methods (bKash, Nagad, Card, Cash)
- Complete status histories
- Realistic Bangladeshi addresses and phone numbers

## Usage

### Integration with Admin Dashboard

To integrate the Admin Bookings page into your admin dashboard:

1. **Add Route** (if using React Router):
```tsx
import AdminBookings from '@/pages/Dashboard/AdminBookings';

// In your routes configuration
<Route path="/admin/bookings" element={<AdminBookings />} />
```

2. **Add Navigation Link**:
```tsx
<NavLink to="/admin/bookings">
  <Calendar className="h-5 w-5" />
  Bookings
</NavLink>
```

### Customization

#### Change Items Per Page
In `BookingTable.tsx`:
```typescript
const ITEMS_PER_PAGE = 8; // Change this value
```

#### Customize Status Colors
In `BookingTable.tsx` and `BookingDetailsDrawer.tsx`:
```typescript
const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Pending' },
  // Modify colors here
};
```

#### Add New Filters
In `BookingFilters.tsx`, add new filter controls and update the `BookingFilters` type in `booking.ts`.

### API Integration

To connect with a real backend API:

1. **Replace Mock Data**:
In `AdminBookings.tsx`:
```typescript
// Replace
const [bookings, setBookings] = useState<Booking[]>(mockBookings);

// With
const [bookings, setBookings] = useState<Booking[]>([]);

useEffect(() => {
  fetchBookings();
}, []);

const fetchBookings = async () => {
  setIsLoading(true);
  try {
    const response = await axios.get('/api/admin/bookings');
    setBookings(response.data);
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to fetch bookings',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

2. **Add API Calls for Actions**:
```typescript
const handleChangeStatus = async (booking: Booking, newStatus: BookingStatus) => {
  try {
    await axios.patch(`/api/admin/bookings/${booking.id}/status`, {
      status: newStatus,
    });
    // Update local state
    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: newStatus } : b
    ));
    toast({ title: 'Status Updated' });
  } catch (error) {
    toast({ title: 'Error', variant: 'destructive' });
  }
};
```

## Styling

The components use Tailwind CSS for styling and shadcn/ui components for consistent design. The color scheme follows:

- **Blue**: Information and accepted status
- **Yellow**: Pending/warning status
- **Purple**: Ongoing/in-progress
- **Green**: Success and completed
- **Red**: Errors and cancelled
- **Gray**: Neutral and secondary information

## Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI component library
- **date-fns**: Date formatting
- **lucide-react**: Icons
- **Radix UI**: Accessible primitives

## Performance Considerations

1. **Memoization**: Filtered bookings and stats are memoized using `useMemo`
2. **Pagination**: Large datasets are paginated (8 items per page)
3. **Lazy Loading**: Details drawer only renders when opened
4. **Optimized Filters**: Filters run on client-side for instant feedback

## Future Enhancements

Possible improvements for production:

1. **Server-side Filtering**: Move filtering to backend for large datasets
2. **Real-time Updates**: WebSocket integration for live booking updates
3. **Export Functionality**: CSV/PDF export implementation
4. **Bulk Actions**: Select multiple bookings for batch operations
5. **Advanced Analytics**: Charts and graphs for booking trends
6. **Worker Assignment UI**: Complete worker selection interface
7. **Email Notifications**: Automated notifications for status changes
8. **Audit Log**: Track all admin actions on bookings
9. **Print Functionality**: Print booking details and receipts
10. **Mobile App**: Dedicated mobile interface for on-the-go management

## Accessibility

The admin bookings system follows accessibility best practices:

- Keyboard navigation support
- ARIA labels on interactive elements
- Color contrast compliance
- Screen reader friendly
- Focus management
- Semantic HTML structure

## Browser Support

Tested and supported on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This component is part of the WorkSure platform.

---

**Created by**: WorkSure Development Team  
**Last Updated**: January 22, 2026  
**Version**: 1.0.0
