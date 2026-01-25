# Admin Complaints Page - Implementation Guide

## Overview

The Admin Complaints Page provides a comprehensive interface for administrators to review, manage, and resolve user and worker complaints in the service marketplace application.

## 🎯 Key Features

### 1. Dashboard Summary
- **Real-time Statistics**: Total complaints, Open, Under Review, Awaiting Response, Resolved, Rejected, and Closed
- **Visual Status Cards**: Color-coded cards with icons for quick status overview
- **Refresh Capability**: Manual refresh to get latest data

### 2. Advanced Filtering & Search
- **Text Search**: Search by Complaint ID, Booking ID, User name, Worker name
- **Status Filter**: Filter by complaint status (Open, Under Review, Awaiting Response, Resolved, Rejected, Closed)
- **Category Filter**: Filter by complaint category (Service Quality, Payment & Billing, Worker Conduct, etc.)
- **Sub-Category Filter**: Dependent filter based on selected category
- **Priority Filter**: Filter by Low, Medium, High priority
- **Raised By Filter**: Filter by User or Worker
- **Date Range**: Filter by date range (From - To)
- **Clear Filters**: One-click reset of all filters

### 3. Complaints Table
- **Sortable Columns**: Click column headers to sort
- **Pagination**: Navigate through pages of complaints
- **Color-coded Badges**: Visual status and priority indicators
- **Responsive Design**: Mobile-friendly table layout
- **Row Actions**: Quick actions menu for each complaint

### 4. Complaint Details Drawer
- **Tabbed Interface**: Organized information in tabs (Overview, Parties, Booking, Admin)
- **Overview Tab**: Complaint details, category, description, attachments
- **Parties Tab**: Information about complainant and respondent
- **Booking Tab**: Related booking and payment details
- **Admin Tab**: Internal notes, timeline, resolution/rejection info
- **Action Buttons**: Quick access to status changes and resolution options

### 5. Admin Actions
- **View Details**: Open detailed complaint view in drawer
- **Change Status**: Update complaint status with optional reason
- **Assign Admin**: Assign complaint to specific admin
- **Add Internal Notes**: Add notes visible only to admins
- **Request Information**: Mark as "Awaiting Response"
- **Resolve**: Mark complaint as resolved with resolution summary
- **Reject**: Reject complaint with rejection reason
- **Close**: Close complaint (final state, locked)

## 📁 File Structure

```
src/
├── types/
│   └── complaint.ts                  # TypeScript types and interfaces
├── services/
│   └── complaintService.ts          # API service for complaint operations
├── components/
│   └── admin/
│       ├── ComplaintStatsCards.tsx  # Statistics dashboard cards
│       ├── ComplaintFilters.tsx     # Filter and search panel
│       ├── ComplaintTable.tsx       # Main complaints table
│       └── ComplaintDetailDrawer.tsx # Detailed complaint view
└── pages/
    └── Dashboard/
        └── admin/
            └── AdminComplaints.tsx  # Main complaints page
```

## 🔧 Components Breakdown

### AdminComplaints (Main Page)
**Location**: `src/pages/Dashboard/admin/AdminComplaints.tsx`

**Responsibilities**:
- State management for complaints, filters, pagination
- API integration and data fetching
- User interaction handling
- Dialog management for quick actions
- Fallback to mock data when API unavailable

**Key State**:
```typescript
- complaints: Complaint[]              // List of complaints
- stats: ComplaintStats               // Statistics summary
- filters: ComplaintFilters           // Active filters
- currentPage: number                 // Current page number
- selectedComplaint: Complaint        // Selected for detail view
- detailDrawerOpen: boolean          // Drawer open state
- actionDialog: {...}                // Dialog state for actions
```

### ComplaintStatsCards
**Location**: `src/components/admin/ComplaintStatsCards.tsx`

**Features**:
- 7 stat cards (Total, Open, Under Review, Awaiting, Resolved, Rejected, Closed)
- Loading skeleton states
- Color-coded with relevant icons
- Hover effects for better UX

### ComplaintFilters
**Location**: `src/components/admin/ComplaintFilters.tsx`

**Features**:
- 9 filter fields in responsive grid
- Dependent sub-category filter
- Date range selectors
- Clear filters button
- Search with debounce (recommended)

### ComplaintTable
**Location**: `src/components/admin/ComplaintTable.tsx`

**Features**:
- 10 columns with relevant data
- Color-coded status and priority badges
- Actions dropdown menu
- Pagination controls
- Empty state handling
- Loading skeleton

### ComplaintDetailDrawer
**Location**: `src/components/admin/ComplaintDetailDrawer.tsx`

**Features**:
- Sheet/Drawer component for side panel
- Tabbed interface with 4 tabs
- Admin notes section with add capability
- Timeline of all actions
- Resolution/Rejection display
- Action buttons with confirmation dialogs

## 🔄 Data Flow

### Initial Load
1. Component mounts
2. `fetchComplaints()` called
3. API requests sent in parallel:
   - `getAllComplaints()` with filters and pagination
   - `getComplaintStats()` for dashboard stats
4. On success: Update state with API data
5. On failure: Fallback to mock data, show toast

### Filter Change
1. User updates filter
2. `setFilters()` called with new filter values
3. `useEffect` detects filter change
4. Reset to page 1
5. `fetchComplaints()` re-fetches with new filters

### Status Update
1. User clicks action (e.g., "Change Status")
2. Dialog opens with current status
3. User selects new status and optional reason
4. `updateComplaintStatus()` API call
5. On success: Refresh complaints list, show toast
6. On failure: Show error toast

### Resolution Flow
1. User opens complaint details
2. Clicks "Resolve" button
3. Confirmation dialog appears
4. User enters resolution summary
5. `resolveComplaint()` API call
6. Complaint status → 'resolved'
7. Timeline updated
8. Drawer closes, list refreshes

## 🎨 UI/UX Guidelines

### Color Coding

**Status Colors**:
- Open: Orange (`bg-orange-100 text-orange-800`)
- Under Review: Purple (`bg-purple-100 text-purple-800`)
- Awaiting Response: Yellow (`bg-yellow-100 text-yellow-800`)
- Resolved: Green (`bg-green-100 text-green-800`)
- Rejected: Red (`bg-red-100 text-red-800`)
- Closed: Gray (`bg-gray-100 text-gray-800`)

**Priority Colors**:
- High: Red (`bg-red-100 text-red-800`)
- Medium: Orange (`bg-orange-100 text-orange-800`)
- Low: Green (`bg-green-100 text-green-800`)

### Responsive Breakpoints
- **Mobile**: Single column layout
- **Tablet (md)**: 2 columns for filters/stats
- **Desktop (lg)**: 4 columns for filters
- **Large (xl)**: 7 columns for stat cards

### Accessibility
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly
- High contrast text
- Focus indicators

## 🔌 API Integration

### Service: `complaintService`
**Location**: `src/services/complaintService.ts`

### Available Methods:

#### 1. Get All Complaints
```typescript
getAllComplaints(filters: ComplaintFilters, page: number, limit: number)
→ ApiResponse<Complaint[]>
```

#### 2. Get Statistics
```typescript
getComplaintStats(dateFrom?: string, dateTo?: string)
→ ApiResponse<ComplaintStats>
```

#### 3. Get Single Complaint
```typescript
getComplaintById(complaintId: string)
→ ApiResponse<Complaint>
```

#### 4. Update Status
```typescript
updateComplaintStatus(complaintId: string, status: ComplaintStatus, reason?: string)
→ ApiResponse<Complaint>
```

#### 5. Assign Admin
```typescript
assignComplaint(complaintId: string, adminId: string)
→ ApiResponse<Complaint>
```

#### 6. Add Note
```typescript
addAdminNote(complaintId: string, note: string)
→ ApiResponse<Complaint>
```

#### 7. Resolve
```typescript
resolveComplaint(complaintId: string, resolution: string)
→ ApiResponse<Complaint>
```

#### 8. Reject
```typescript
rejectComplaint(complaintId: string, rejectionReason: string)
→ ApiResponse<Complaint>
```

## 📊 Data Models

### Complaint Type
```typescript
interface Complaint {
  id: string;
  complaintId: string;              // Display ID (e.g., CMP-2024-001)
  category: string;
  subCategory: string;
  subject: string;
  description: string;
  attachments?: string[];
  
  // Parties
  raisedBy: ComplaintUser;
  against: ComplaintUser;
  
  // Relations
  booking: ComplaintBooking | null;
  payment: ComplaintPayment | null;
  
  // Status
  status: ComplaintStatus;
  priority: ComplaintPriority;
  
  // Admin management
  assignedAdmin?: string;
  assignedAdminName?: string;
  adminNotes?: AdminNote[];
  resolution?: string;
  rejectionReason?: string;
  timeline?: ComplaintTimeline[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}
```

### Complaint Status Flow
```
open → under_review → awaiting_response → resolved/rejected → closed
```

**Valid Transitions**:
- `open` → `under_review`, `awaiting_response`, `resolved`, `rejected`
- `under_review` → `awaiting_response`, `resolved`, `rejected`
- `awaiting_response` → `under_review`, `resolved`, `rejected`
- `resolved` → `closed`
- `rejected` → `closed`

**Locked States**: `resolved`, `rejected`, `closed` (no further changes allowed)

## 🧪 Mock Data

Mock data is included for development and fallback:
- **Location**: Inside `AdminComplaints.tsx`
- **Usage**: Automatically used when API fails
- **Contains**: 3 sample complaints with different statuses
- **Stats**: Realistic statistics for dashboard

## 🚀 Future Enhancements

### Recommended Features:
1. **Bulk Actions**: Select multiple complaints and update status
2. **Export Functionality**: Export to CSV/PDF
3. **Advanced Analytics**: Charts and trends
4. **Email Integration**: Send notifications from admin panel
5. **SLA Tracking**: Track response and resolution times
6. **Escalation System**: Auto-escalate based on priority and age
7. **Complaint Templates**: Quick responses for common issues
8. **Worker/User History**: View all complaints by specific user/worker
9. **Search Suggestions**: Auto-complete for search
10. **Real-time Updates**: WebSocket integration for live updates

## 🔒 Security Considerations

- Admin-only access (implement route guards)
- Authentication required for all API calls
- Authorization checks on backend
- Input sanitization for notes and resolutions
- Audit trail for all admin actions
- Rate limiting on API endpoints

## 📱 Responsive Design

**Mobile (< 768px)**:
- Stacked stat cards
- Single column filters
- Horizontal scroll for table
- Full-screen drawer

**Tablet (768px - 1024px)**:
- 2-column stat cards
- 2-column filters
- Condensed table columns

**Desktop (> 1024px)**:
- 7-column stat cards
- 4-6 column filters
- Full table display
- Side drawer (not full screen)

## 🎓 Usage Examples

### Opening Complaint Details
```typescript
const handleViewDetails = (complaint: Complaint) => {
  setSelectedComplaint(complaint);
  setDetailDrawerOpen(true);
};
```

### Resolving a Complaint
```typescript
const handleResolve = async (complaintId: string, resolution: string) => {
  const response = await complaintService.resolveComplaint(complaintId, resolution);
  if (response.success) {
    toast({ title: 'Complaint Resolved' });
    fetchComplaints(); // Refresh list
  }
};
```

### Filtering Complaints
```typescript
const handleFilterChange = (key: keyof ComplaintFilters, value: any) => {
  onFiltersChange({ ...filters, [key]: value });
};
```

## 🐛 Troubleshooting

### Issue: API not connecting
**Solution**: Check API base URL in `.env` file, fallback to mock data will activate

### Issue: Filters not working
**Solution**: Verify backend API supports all filter parameters

### Issue: Status not updating
**Solution**: Check admin permissions and status transition rules

### Issue: Drawer not opening
**Solution**: Verify Sheet/Drawer component is properly imported from shadcn/ui

## 📞 Support

For questions or issues with the Admin Complaints Page:
1. Check this documentation
2. Review component source code
3. Check console for errors
4. Verify API responses in Network tab
5. Test with mock data to isolate backend issues

---

**Last Updated**: January 25, 2026
**Version**: 1.0.0
**Maintainer**: Worksure Development Team
