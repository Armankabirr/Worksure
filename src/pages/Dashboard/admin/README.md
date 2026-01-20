# Admin Dashboard

A complete admin dashboard system for the Worksure platform with modern UI and responsive design.

## Features

### Layout
- **Fixed Sidebar Navigation**: Persistent navigation with active route highlighting
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Clean Architecture**: Separation of layout, pages, and components

### Dashboard Pages

#### 1. Dashboard (`/admin/dashboard`)
- Overview of key metrics and statistics
- Quick stats cards (Users, Workers, Bookings, Revenue)
- Recent activity feed
- Trend indicators

#### 2. Users (`/admin/users`)
Fully functional users management page with:
- **Search & Filters**:
  - Search by name, email, phone, or user ID
  - Status filter (All, Active, Suspended)
  - Address filter (Has address, No address, Multiple addresses)
  - Date range filter (coming soon)
  
- **Users Table**:
  - Bulk selection with checkboxes
  - User information with avatar placeholders
  - Status badges (Active/Suspended)
  - Address and booking counts
  - Join date
  - Row actions dropdown
  
- **Actions**:
  - View user details
  - Suspend/Activate users
  - Export data
  
- **UX Features**:
  - Loading state
  - Empty state with "Clear Filters" button
  - Pagination controls
  - Responsive table (converts to cards on mobile)

#### 3. Other Pages (Placeholders)
- Workers (`/admin/workers`)
- Services (`/admin/services`)
- Bookings (`/admin/bookings`)
- Payments (`/admin/payments`)
- Reviews (`/admin/reviews`)
- Complaints (`/admin/complaints`)
- Addresses (`/admin/addresses`)
- Reports (`/admin/reports`)
- Settings (`/admin/settings`)

## Tech Stack

- **React**: Functional components with hooks
- **React Router v6**: Nested routing with Outlet
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built UI components
- **Lucide React**: Icon library
- **TypeScript**: Type safety

## Project Structure

```
src/pages/Dashboard/admin/
├── AdminDashboardLayout.tsx    # Main layout with sidebar + outlet
├── AdminDashboard.tsx          # Dashboard overview page
├── AdminUsers.tsx              # Users management page
├── AdminWorkers.tsx            # Workers management (placeholder)
├── AdminServices.tsx           # Services management (placeholder)
├── AdminBookings.tsx           # Bookings management (placeholder)
├── AdminPayments.tsx           # Payments management (placeholder)
├── AdminReviews.tsx            # Reviews management (placeholder)
├── AdminComplaints.tsx         # Complaints management (placeholder)
├── AdminAddresses.tsx          # Addresses management (placeholder)
├── AdminReports.tsx            # Reports page (placeholder)
├── AdminSettings.tsx           # Settings page (placeholder)
└── components/
    └── AdminSidebar.tsx        # Reusable sidebar component
```

## Usage

### Accessing the Admin Dashboard

Navigate to `/admin` or `/admin/dashboard` to access the admin dashboard.

### Routes

All admin routes are prefixed with `/admin`:

- `/admin/dashboard` - Dashboard overview
- `/admin/users` - Users management
- `/admin/workers` - Workers management
- `/admin/services` - Services management
- `/admin/bookings` - Bookings management
- `/admin/payments` - Payments management
- `/admin/reviews` - Reviews management
- `/admin/complaints` - Complaints management
- `/admin/addresses` - Addresses management
- `/admin/reports` - Reports
- `/admin/settings` - Settings

### Adding Authentication

To protect admin routes, wrap them in a `ProtectedRoute` component:

```tsx
<Route
  path="/admin"
  element={
    <ProtectedRoute requireAdmin={true}>
      <AdminDashboardLayout />
    </ProtectedRoute>
  }
>
  {/* Nested routes */}
</Route>
```

## Customization

### Adding New Pages

1. Create a new component file in `src/pages/Dashboard/admin/`
2. Add the route to `App.tsx` within the admin route group
3. Add navigation item to `AdminSidebar.tsx` if needed

Example:
```tsx
// In App.tsx
<Route path="new-page" element={<AdminNewPage />} />

// In AdminSidebar.tsx
{ label: 'New Page', icon: IconComponent, href: '/admin/new-page' }
```

### Styling

The dashboard uses Tailwind CSS. Key design tokens:
- Primary color: Blue (blue-700, blue-600, etc.)
- Background: Gray-50
- Cards: White with gray-200 border
- Text: Gray-900 (headings), Gray-700 (body), Gray-500 (subtle)

### Mock Data

Currently, the Users page uses mock data defined in the component. To connect to a real API:

1. Create an API service file
2. Replace `mockUsers` with API calls using React Query or similar
3. Update state management to handle loading, error, and data states

Example:
```tsx
import { useQuery } from '@tanstack/react-query';

const { data: users, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsers,
});
```

## Future Enhancements

- [ ] Connect to real backend API
- [ ] Implement user details modal/page
- [ ] Add bulk actions (suspend multiple users, export selected)
- [ ] Implement date range filtering
- [ ] Add charts and graphs to dashboard
- [ ] Implement real-time updates with WebSocket
- [ ] Add export functionality (CSV, Excel)
- [ ] Implement advanced search with multiple criteria
- [ ] Add audit logs and activity tracking
- [ ] Mobile-responsive sidebar with collapse/expand
- [ ] Dark mode support
- [ ] Role-based access control (RBAC)

## Components Used

### shadcn/ui Components
- Button
- Input
- Select
- Table
- Card
- Badge
- Checkbox
- Dropdown Menu
- Dialog (for future modals)

### Custom Components
- AdminDashboardLayout
- AdminSidebar
- Individual page components

## Development

To work on the admin dashboard:

1. Navigate to the admin route: `http://localhost:5173/admin`
2. Edit components in `src/pages/Dashboard/admin/`
3. Changes will hot-reload automatically

## Notes

- The layout uses a fixed sidebar that remains visible during navigation
- Active route is automatically highlighted in the sidebar
- All placeholder pages follow the same structure for consistency
- The Users page is fully implemented and can serve as a template for other pages
