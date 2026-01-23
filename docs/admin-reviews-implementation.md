# Admin Reviews Management Page - Implementation Guide

## Overview

The Admin Reviews Management page provides a comprehensive interface for administrators to monitor, moderate, and analyze user reviews submitted after completed bookings.

## Route

**Path:** `/admin/reviews`

## Files Created/Modified

### 1. Type Definitions

**File:** `/src/types/review.ts`

Defines TypeScript interfaces for:

- `Review`: Main review data structure
- `ReviewStatus`: Union type for review statuses (active, approved, hidden, flagged, deleted)
- `ReviewFilters`: Filter criteria for searching reviews
- `ReviewStats`: Analytics and statistics data
- `ReviewDetailData`: Extended review data with additional context

### 2. Service Layer

**File:** `/src/services/reviewService.ts`

API service methods:

- `getAllReviews()`: Fetch paginated reviews with filters
- `getReviewStats()`: Get analytics overview
- `getReviewById()`: Fetch detailed review information
- `updateReviewStatus()`: Update review status
- `approveReview()`: Approve a review
- `hideReview()`: Hide a review from public view
- `flagReview()`: Flag review as abusive/fake
- `deleteReview()`: Permanently delete a review
- `updateAdminNotes()`: Add/update admin notes

### 3. Main Component

**File:** `/src/pages/Dashboard/admin/AdminReviews.tsx`

## Features Implemented

### 📊 Analytics Overview

Five key metrics displayed in cards:

- **Total Reviews**: Count of all reviews
- **Average Rating**: Platform-wide average rating
- **Flagged Count**: Number of flagged reviews
- **Hidden Count**: Number of hidden reviews
- **Deleted Count**: Number of deleted reviews

### 🔍 Advanced Filters

Collapsible filter panel with:

- **Search**: Search by user name, worker name, or booking ID
- **Status Filter**: All, Active, Approved, Hidden, Flagged, Deleted
- **Rating Filter**: Filter by 1-5 star ratings
- **Date Range**: From/To date filters
- **Flagged Only Toggle**: Show only flagged reviews
- **Clear Filters**: Reset all filters to default

### 📋 Reviews Table

Paginated table displaying:

- Review ID (truncated with ellipsis)
- Star rating (visual stars + number)
- Comment text (truncated with "View more" expansion)
- User name
- Worker name + average rating
- Service (Category → Section)
- Booking ID (clickable link to booking details)
- Status badge (color-coded)
- Created date
- Action buttons

### 🎯 Admin Actions

Four primary actions per review:

1. **Approve** (✓): Mark review as approved
2. **Hide** (👁️): Hide from public view
3. **Flag** (🚩): Flag as abusive/fake
4. **Delete** (🗑️): Permanently remove

Each action includes:

- Confirmation dialog
- Reason input (required for delete, optional for hide/flag)
- Success/error toast notifications
- Automatic data refresh after action

### 📱 Review Detail Modal

Comprehensive view showing:

- Full review text
- Complete rating display
- User and worker information
- Service details
- Booking ID with navigation link
- Creation timestamp
- Current status

### 🎨 UI/UX Features

- **Color-coded status badges**:
  - Active: Green
  - Approved: Blue
  - Hidden: Gray
  - Flagged: Orange
  - Deleted: Red
- **Star rating visualization**: Filled/unfilled stars
- **Responsive design**: Mobile-friendly layout
- **Loading states**: Spinner during data fetch
- **Empty states**: Friendly message when no reviews found
- **Pagination controls**: Previous/Next navigation
- **Sorting**: Sort by date, rating, or status (ascending/descending)
- **Confirmation dialogs**: Prevent accidental destructive actions

## API Integration

### Endpoint

```
GET /admin/reviews
```

### Query Parameters

```javascript
{
  page: 1,
  limit: 10,
  status: 'active' | 'approved' | 'hidden' | 'flagged' | 'deleted',
  sortBy: 'created_at' | 'rating' | 'status',
  sortOrder: 'asc' | 'desc',
  search: string,
  rating: 1-5,
  category: string,
  section: string,
  dateFrom: string,
  dateTo: string,
  flaggedOnly: boolean
}
```

### Response Structure

```javascript
{
  success: boolean,
  data: [
    {
      review_id: string,
      rating: number,
      comment: string,
      status: string,
      created_at: string,
      user: {
        id: string,
        name: string
      },
      worker: {
        id: string,
        name: string,
        avg_rating: number
      },
      service: {
        category: string,
        section: string
      },
      booking_id: string
    }
  ],
  pagination: {
    page: number,
    limit: number,
    totalCount: number,
    totalPages: number
  }
}
```

## Business Rules Implemented

1. **Reviews exist only for completed bookings**
   - Reviews are linked to booking IDs
   - Booking ID is clickable and navigates to booking details

2. **One review per booking per user**
   - Enforced at API level (not UI responsibility)

3. **Deleted reviews don't alter historical analytics**
   - Deletion is tracked separately in stats
   - Historical data remains intact

4. **Worker rating recalculation**
   - Handled asynchronously by backend
   - UI shows current avg_rating from worker profile

5. **Admin action auditability**
   - All actions require confirmation
   - Reason field for destructive actions
   - Toast notifications confirm success/failure

## State Management

### Local State

- `reviews`: Current page of reviews
- `stats`: Analytics overview data
- `filters`: Current filter values
- `currentPage`: Pagination state
- `sortBy` / `sortOrder`: Sorting preferences
- `selectedReview`: Review selected for detail view
- `actionDialog`: Current action confirmation state

### Effects

- Auto-fetch on filter/page/sort changes
- Separate stats fetch for analytics
- Refresh data after admin actions

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Screen reader friendly status badges

## Performance Optimizations

- Pagination to limit data load
- Lazy loading of review details
- Debounced search (can be added)
- Optimistic UI updates (can be enhanced)

## Future Enhancements

1. Bulk actions (approve/hide multiple reviews)
2. Export reviews to CSV
3. Advanced analytics dashboard
4. Review response feature
5. Image gallery for review images
6. User/worker profile quick view
7. Review sentiment analysis
8. Automated flagging based on keywords
9. Review templates for common responses
10. Email notifications for flagged reviews

## Testing Checklist

- [ ] Filter by each status type
- [ ] Search functionality
- [ ] Rating filter
- [ ] Date range filter
- [ ] Pagination navigation
- [ ] Sort by different fields
- [ ] Approve review action
- [ ] Hide review action
- [ ] Flag review action
- [ ] Delete review action (with reason validation)
- [ ] View review details modal
- [ ] Navigate to booking from review
- [ ] Responsive layout on mobile
- [ ] Loading states
- [ ] Empty states
- [ ] Error handling

## Dependencies

- React Router (navigation)
- date-fns (date formatting)
- Lucide React (icons)
- Shadcn UI components (Table, Dialog, Card, etc.)
- Axios (API calls)

## Notes

- All destructive actions require confirmation
- Delete action requires a reason (enforced in UI)
- Status changes are immediate with optimistic updates
- Toast notifications provide user feedback
- Color coding helps quick visual identification
- Clickable booking IDs enable quick navigation
