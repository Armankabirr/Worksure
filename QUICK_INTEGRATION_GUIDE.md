# Quick Integration Guide - Admin Bookings

This guide will help you integrate the Admin Bookings page into your existing WorkSure admin dashboard.

## Step 1: Verify Installation

All necessary files have been created:

```
✅ src/types/booking.ts
✅ src/lib/mockBookingData.ts
✅ src/components/admin/BookingStatsCards.tsx
✅ src/components/admin/BookingFilters.tsx
✅ src/components/admin/BookingTable.tsx
✅ src/components/admin/BookingDetailsDrawer.tsx
✅ src/pages/Dashboard/AdminBookings.tsx
```

## Step 2: Add to Your Router

If you're using React Router, add the route to your router configuration:

```tsx
// Example: In your main router file (App.tsx or routes.tsx)
import AdminBookings from '@/pages/Dashboard/AdminBookings';

// Add to your routes
{
  path: '/admin/bookings',
  element: <AdminBookings />
}

// Or with layout wrapper
{
  path: '/admin',
  element: <AdminLayout />,
  children: [
    { path: 'bookings', element: <AdminBookings /> },
    // ... other admin routes
  ]
}
```

## Step 3: Add Navigation Link

Add a link to your admin navigation menu:

```tsx
// Example navigation link
import { Calendar } from 'lucide-react';

<NavLink to="/admin/bookings">
  <Calendar className="h-5 w-5" />
  <span>Bookings</span>
</NavLink>
```

## Step 4: Test the Page

1. Navigate to `/admin/bookings`
2. You should see:
   - 5 statistics cards at the top
   - Filters section with search and dropdowns
   - Bookings table with 10 mock bookings
   - Pagination controls at the bottom

3. Test functionality:
   - Click on filters and search
   - Click "View Details" on any booking
   - Use the action menu (three dots) on rows
   - Try changing status in the details drawer
   - Add admin notes

## Step 5: Customize (Optional)

### Change Page Layout
If you want to integrate it within an existing admin layout:

```tsx
// In AdminBookings.tsx
// Remove the outer wrapper and just export the content
export default function AdminBookings() {
  return (
    // Remove: <div className="min-h-screen bg-gray-50 p-6">
    // Remove: <div className="max-w-7xl mx-auto space-y-6">
    <>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        {/* ... header content ... */}
      </div>

      {/* Rest of the components */}
      <BookingStatsCards stats={stats} isLoading={isLoading} />
      {/* ... */}
    </>
    // Remove closing divs
  );
}
```

### Adjust Colors to Match Your Theme
Update Tailwind classes in components to match your design system:

```tsx
// Example: Change primary button color
// From:
<Button className="gap-2">
// To:
<Button className="gap-2 bg-your-brand-color">
```

## Step 6: Connect to Real API (When Ready)

Replace mock data with API calls:

```tsx
// In AdminBookings.tsx
import { useEffect } from 'react';
import axios from 'axios';

const AdminBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('/api/admin/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bookings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Rest of the component...
};
```

## Troubleshooting

### Issue: Components not found
**Solution**: Verify all UI components exist in `src/components/ui/`:
- button.tsx
- card.tsx
- input.tsx
- select.tsx
- badge.tsx
- table.tsx
- sheet.tsx
- separator.tsx
- alert-dialog.tsx
- dropdown-menu.tsx

If any are missing, install them from shadcn/ui:
```bash
npx shadcn-ui@latest add button card input select badge table sheet separator alert-dialog dropdown-menu
```

### Issue: date-fns errors
**Solution**: The project already has date-fns installed. If you see errors:
```bash
npm install date-fns
```

### Issue: Types not recognized
**Solution**: Restart your TypeScript server in VS Code:
- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
- Type "TypeScript: Restart TS Server"
- Press Enter

### Issue: Styling looks off
**Solution**: Ensure Tailwind CSS is properly configured and the content array includes the admin folder:
```js
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // ...
}
```

## Features Ready to Use

✅ **Search & Filters**: Multi-field search with advanced filters  
✅ **Statistics Dashboard**: Real-time booking counts  
✅ **Sortable Table**: Click headers to sort  
✅ **Pagination**: Automatic pagination (8 items/page)  
✅ **Details View**: Comprehensive booking information  
✅ **Status Management**: Change booking status  
✅ **Admin Notes**: Add internal notes  
✅ **Action Confirmations**: Safety dialogs for critical actions  
✅ **Responsive Design**: Works on all screen sizes  
✅ **Toast Notifications**: User feedback for all actions  

## What's Not Included (To Be Implemented)

⏳ Worker assignment modal (placeholder exists)  
⏳ Actual refund processing (UI ready)  
⏳ Export to CSV functionality (button ready)  
⏳ Real-time updates via WebSocket  
⏳ Email notifications  
⏳ Print functionality  

## Support

For questions or issues:
1. Check the full documentation in `ADMIN_BOOKINGS_DOCUMENTATION.md`
2. Review the code comments in each component
3. Test with the provided mock data first

---

**Quick Test URL**: `/admin/bookings`  
**Mock Data**: 10 sample bookings with various statuses  
**Dependencies**: All included in existing project  

Happy coding! 🚀
