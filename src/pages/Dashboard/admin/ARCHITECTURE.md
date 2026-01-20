# Admin Dashboard - Component Hierarchy

## 🏗️ Architecture Overview

```
App.tsx
  └── BrowserRouter
      └── Routes
          └── Route path="/admin"
              └── AdminDashboardLayout
                  ├── AdminSidebar (Fixed Left)
                  │   ├── Header (Worksure branding)
                  │   ├── Navigation
                  │   │   └── NavLink (x11 items)
                  │   │       ├── Dashboard
                  │   │       ├── Users
                  │   │       ├── Workers
                  │   │       ├── Services
                  │   │       ├── Bookings
                  │   │       ├── Payments
                  │   │       ├── Reviews
                  │   │       ├── Complaints
                  │   │       ├── Addresses
                  │   │       ├── Reports
                  │   │       └── Settings
                  │   └── Footer (Admin profile)
                  │
                  └── Main Content (Outlet)
                      ├── AdminDashboard
                      │   ├── Stats Grid
                      │   │   └── Card (x4)
                      │   └── Recent Activity
                      │
                      ├── AdminUsers (FULLY FUNCTIONAL)
                      │   ├── Page Header
                      │   ├── Filters Card
                      │   │   ├── Search Input
                      │   │   ├── Status Select
                      │   │   ├── Address Select
                      │   │   └── Action Buttons
                      │   ├── Results Summary
                      │   └── Users Table Card
                      │       ├── Table
                      │       │   ├── TableHeader
                      │       │   └── TableBody
                      │       │       └── TableRow (x5)
                      │       │           ├── Checkbox
                      │       │           ├── User Info + Avatar
                      │       │           ├── Email
                      │       │           ├── Phone
                      │       │           ├── Status Badge
                      │       │           ├── Address Count
                      │       │           ├── Booking Count
                      │       │           ├── Join Date
                      │       │           └── Actions Dropdown
                      │       └── Pagination
                      │
                      ├── AdminWorkers (Placeholder)
                      ├── AdminServices (Placeholder)
                      ├── AdminBookings (Placeholder)
                      ├── AdminPayments (Placeholder)
                      ├── AdminReviews (Placeholder)
                      ├── AdminComplaints (Placeholder)
                      ├── AdminAddresses (Placeholder)
                      ├── AdminReports (Placeholder)
                      └── AdminSettings (Placeholder)
```

## 🎨 Component Breakdown

### Layout Components

#### AdminDashboardLayout
```tsx
Purpose: Main container with sidebar + content area
Props: None (uses Outlet for nested routes)
Layout: Flexbox (horizontal split)
  - Sidebar: Fixed width (256px)
  - Content: Flex-1 (fills remaining space)
```

#### AdminSidebar
```tsx
Purpose: Fixed navigation sidebar
Props: None
Features:
  - Header section (branding)
  - Scrollable navigation list
  - Footer section (admin profile)
  - Active route highlighting
```

### Page Components

#### AdminDashboard
```tsx
Purpose: Overview dashboard
Data: Mock statistics
Features:
  - 4 stat cards (Users, Workers, Bookings, Revenue)
  - Trend indicators
  - Recent activity feed
```

#### AdminUsers (Full Implementation)
```tsx
Purpose: Users management page
Data: Mock users array (5 users)
State Management:
  - users: User[]
  - searchQuery: string
  - statusFilter: string
  - addressFilter: string
  - selectedUsers: Set<string>
  - currentPage: number
  - pageSize: number

Features:
  - Search (real-time filtering)
  - Status filter
  - Address filter
  - Bulk selection
  - Row actions
  - Pagination
  - Empty state
  - Loading state

Functions:
  - filteredUsers() - Apply filters
  - handleToggleStatus() - Suspend/activate
  - handleSelectAll() - Bulk selection
  - handleSelectUser() - Individual selection
  - getStatusBadge() - Badge styling
  - getUserInitials() - Avatar generation
```

### Reusable UI Components (shadcn/ui)

```
Button        - Primary actions, variants (default, outline, ghost)
Input         - Text input with search icon
Select        - Dropdown filters
Card          - Container with header/content
Badge         - Status indicators (colored)
Checkbox      - Bulk selection
Table         - Data table with header/body/row/cell
DropdownMenu  - Action menus
```

## 🔄 Data Flow

### AdminUsers Component Data Flow

```
1. Initial State
   └── mockUsers (hardcoded array)

2. User Interaction
   ├── Search input onChange
   │   └── setSearchQuery()
   │       └── Triggers re-render
   │           └── filteredUsers recalculates
   │
   ├── Status filter onChange
   │   └── setStatusFilter()
   │       └── Triggers re-render
   │           └── filteredUsers recalculates
   │
   └── Suspend/Activate click
       └── handleToggleStatus(userId)
           └── setUsers() with updated user
               └── Triggers re-render
                   └── UI updates

3. Rendering
   └── filteredUsers mapped to TableRow components
       └── Each row renders user data + actions
```

## 🎯 Component Communication

```
App.tsx
  │
  ├─ Routes Configuration
  │   └─ Nested admin routes
  │
  └─ AdminDashboardLayout
      │
      ├─ AdminSidebar
      │   └─ NavLink (React Router)
      │       └─ Navigates to route
      │           └─ Updates browser URL
      │               └─ Outlet re-renders
      │
      └─ Outlet
          └─ Renders active route component
              └─ AdminUsers, AdminDashboard, etc.
```

## 📦 State Management

### Current Approach (Local State)
```tsx
// Each page component manages its own state
const [users, setUsers] = useState<User[]>(mockUsers);
const [searchQuery, setSearchQuery] = useState('');
// ... more state
```

### Future Approach (API + React Query)
```tsx
// Centralized data fetching
const { data: users, isLoading, error } = useQuery({
  queryKey: ['admin-users'],
  queryFn: fetchUsers,
});

// Actions
const suspendMutation = useMutation({
  mutationFn: suspendUser,
  onSuccess: () => queryClient.invalidateQueries(['admin-users']),
});
```

## 🎨 Styling Architecture

### Tailwind CSS Utility Classes
```
Layout:
  - flex, grid
  - w-*, h-*
  - p-*, m-*
  - gap-*

Typography:
  - text-* (size)
  - font-* (weight)
  - text-gray-900 (color)

Colors:
  - bg-* (background)
  - text-* (text color)
  - border-* (border color)

States:
  - hover:*
  - focus:*
  - active:*

Responsive:
  - md:*, lg:*, xl:*
```

### Component Variants (shadcn/ui)
```tsx
// Button variants
<Button variant="default" size="default" />
<Button variant="outline" size="sm" />
<Button variant="ghost" size="lg" />

// Badge variants
<Badge className="bg-green-100 text-green-800" />
<Badge className="bg-red-100 text-red-800" />
```

## 🔌 Integration Points

### Where to Add API Calls

```tsx
// 1. In AdminUsers component
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchUsers, suspendUser } from '@/services/adminApi';

const AdminUsers = () => {
  // Replace useState with useQuery
  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
  });

  // Add mutation for actions
  const suspendMutation = useMutation({
    mutationFn: suspendUser,
    onSuccess: () => {
      // Refresh data
      queryClient.invalidateQueries(['admin-users']);
    },
  });

  // Update handler
  const handleToggleStatus = (userId: string) => {
    suspendMutation.mutate(userId);
  };

  // ... rest of component
};
```

### Where to Add Authentication

```tsx
// In App.tsx
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

## 📊 Performance Considerations

### Current Optimizations
- ✅ Efficient filtering (single pass)
- ✅ Minimal re-renders
- ✅ Lazy loading of pages (React Router code splitting)

### Future Optimizations
- [ ] Memoize filtered results
- [ ] Virtualize long lists
- [ ] Debounce search input
- [ ] Paginate server-side
- [ ] Cache API responses

## 🧪 Testing Strategy

### Component Testing
```tsx
// Example: Testing AdminUsers search
describe('AdminUsers', () => {
  it('filters users by search query', () => {
    render(<AdminUsers />);
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'John' } });
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
```

### Integration Testing
```tsx
// Example: Testing navigation
describe('Admin Navigation', () => {
  it('navigates to users page', () => {
    render(<App />);
    const usersLink = screen.getByRole('link', { name: /users/i });
    fireEvent.click(usersLink);
    expect(screen.getByText('Manage platform customers')).toBeInTheDocument();
  });
});
```

## 📚 Key Patterns Used

### 1. Nested Routing Pattern
```tsx
<Route path="/admin" element={<Layout />}>
  <Route index element={<Dashboard />} />
  <Route path="users" element={<Users />} />
</Route>
```

### 2. Compound Component Pattern
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### 3. Controlled Components Pattern
```tsx
<Input
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

### 4. Render Props Pattern
```tsx
<NavLink>
  {({ isActive }) => (
    <Icon className={isActive ? 'active' : ''} />
  )}
</NavLink>
```

## 🎓 Learning Path

1. **Understand Layout**
   - Study AdminDashboardLayout.tsx
   - Understand Outlet concept
   - Learn flexbox layout

2. **Study Routing**
   - Review App.tsx route configuration
   - Understand nested routes
   - Learn NavLink active states

3. **Analyze Users Page**
   - Study state management
   - Understand filtering logic
   - Learn table rendering

4. **Explore UI Components**
   - Check shadcn/ui documentation
   - Understand component variants
   - Learn Tailwind utilities

5. **Implement New Pages**
   - Use AdminUsers as template
   - Follow same patterns
   - Maintain consistency

---

This hierarchy shows the complete structure of the admin dashboard. Use it as a reference when:
- Adding new features
- Understanding data flow
- Debugging issues
- Planning enhancements
- Onboarding team members
