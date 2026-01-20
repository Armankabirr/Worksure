# API Integration Guide - Admin Users Page

## ✅ What's Been Implemented

The AdminUsers page has been successfully updated to fetch real data from your backend API.

### Changes Made

#### 1. **API Data Fetching**
- ✅ Integrated React Query for data fetching
- ✅ Using axios via `useAxiosPublic` hook
- ✅ Endpoint: `/userRoutes/users`
- ✅ Automatic caching and background refetching

#### 2. **User Data Transformation**
The API response is transformed to match the component's expectations:

```typescript
API Response → Component Format
─────────────────────────────────
_id         → id
isBlocked   → status ('active' | 'suspended')
addresses   → addressCount (length)
bookings    → bookingCount (length)
createdAt   → joinedDate
```

#### 3. **Status Toggle with API**
- ✅ API call to toggle user status
- ✅ Endpoint: `PATCH /userRoutes/users/:userId/toggle-status`
- ✅ Auto-refresh after successful update
- ✅ Toast notifications for success/error
- ✅ Loading state during update

#### 4. **Enhanced Error Handling**
- ✅ Loading state with spinner
- ✅ Error state with retry button
- ✅ Empty state when no users exist
- ✅ Toast notifications for API errors

## 📡 API Endpoints Used

### 1. Get All Users
```
GET /userRoutes/users
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "role": "user",
      "isBlocked": false,
      "addresses": [...],
      "bookings": [...],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T15:45:00Z"
    }
  ]
}
```

### 2. Toggle User Status
```
PATCH /userRoutes/users/:userId/toggle-status
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "data": {
    "_id": "user123",
    "isBlocked": true
  }
}
```

## 🔧 Configuration Required

### 1. Environment Variables

Make sure your `.env` file has the API URL configured:

```env
VITE_API_URL=http://localhost:5000/api
```

Or update to your actual backend URL.

### 2. Backend API Requirements

The backend should:
- Return data in the format shown above
- Support CORS for your frontend domain
- Handle authentication if required
- Implement the toggle status endpoint

## 🎯 Features

### Current Features
- ✅ Real-time data fetching from API
- ✅ Search (client-side filtering)
- ✅ Status filter (client-side)
- ✅ Address filter (client-side)
- ✅ Suspend/Activate users via API
- ✅ Loading states
- ✅ Error handling with retry
- ✅ Toast notifications
- ✅ Pagination UI (client-side)

### Features to Add (Optional)
- [ ] Server-side pagination
- [ ] Server-side search
- [ ] Server-side filtering
- [ ] Bulk actions API integration
- [ ] User details modal with API
- [ ] Export functionality

## 🔄 Data Flow

```
Component Mount
    ↓
React Query executes fetch
    ↓
useAxiosPublic.get('/userRoutes/users')
    ↓
API returns user data
    ↓
Data transformed to component format
    ↓
Component renders with data
    ↓
User clicks "Suspend"
    ↓
Mutation executes PATCH request
    ↓
API updates user status
    ↓
Query automatically refetches
    ↓
UI updates with fresh data
    ↓
Toast notification shows success
```

## 🧪 Testing the Integration

### 1. Start Your Backend
```bash
# Navigate to your backend directory
cd path/to/backend
npm run dev
```

### 2. Start Your Frontend
```bash
# Navigate to your frontend directory
cd /home/nayeem/UIU/12th\ trimester/SE\ Lab/Worksure
npm run dev
```

### 3. Test the Features

1. **Load Users**
   - Navigate to `/admin/users`
   - Should see loading spinner
   - Then display list of users from API

2. **Search Users**
   - Type in search box
   - Results filter in real-time

3. **Filter by Status**
   - Select "Active" or "Suspended"
   - See filtered results

4. **Toggle User Status**
   - Click ⋮ menu on any user
   - Click "Suspend User" or "Activate User"
   - Should see loading state
   - Toast notification on success
   - User status updates in UI

5. **Error Handling**
   - Stop backend server
   - Try to load page
   - Should see error state with retry button
   - Click retry to attempt again

## 🐛 Troubleshooting

### Issue: "Failed to load users"

**Possible Causes:**
1. Backend server not running
2. Wrong API URL in `.env`
3. CORS not configured
4. Network error

**Solutions:**
1. Check backend is running: `http://localhost:5000/api/userRoutes/users`
2. Verify `VITE_API_URL` in `.env`
3. Add CORS headers in backend
4. Check browser console for errors

### Issue: "Toggle status not working"

**Possible Causes:**
1. Endpoint not implemented: `/userRoutes/users/:id/toggle-status`
2. Wrong HTTP method (should be PATCH)
3. Authentication required but not sent

**Solutions:**
1. Implement the toggle endpoint in backend
2. Check API route accepts PATCH requests
3. Add authentication headers if needed

### Issue: "Data not displaying correctly"

**Possible Causes:**
1. API response format different from expected
2. Missing fields in response
3. Data transformation issue

**Solutions:**
1. Check API response in Network tab
2. Update data transformation in component
3. Add console.log to debug:

```typescript
console.log('API Response:', apiResponse);
console.log('Transformed Users:', users);
```

## 🔐 Adding Authentication (Optional)

If your API requires authentication, update the axios instance:

```typescript
// In useAxiosPublic.tsx or create a new useAxiosSecure.tsx
import axios from "axios";

const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Add request interceptor for auth token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosSecure;
```

Then use it in AdminUsers:
```typescript
import useAxiosSecure from '@/hooks/useAxiosSecure';

const AdminUsers = () => {
  const axiosSecure = useAxiosSecure();
  
  const { data: apiResponse } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await axiosSecure.get('/userRoutes/users');
      return response.data;
    },
  });
  // ...
};
```

## 📊 Performance Optimization

### Current Optimizations
- ✅ React Query caching (5 minutes default)
- ✅ Background refetching
- ✅ Automatic retry on failure
- ✅ Request deduplication

### Additional Optimizations (Future)

1. **Server-side Pagination**
```typescript
const [page, setPage] = useState(1);
const [limit, setLimit] = useState(10);

const { data } = useQuery({
  queryKey: ['admin-users', page, limit],
  queryFn: async () => {
    const response = await axiosPublic.get(
      `/userRoutes/users?page=${page}&limit=${limit}`
    );
    return response.data;
  },
});
```

2. **Debounced Search**
```typescript
import { useMemo } from 'react';
import debounce from 'lodash/debounce';

const debouncedSearch = useMemo(
  () => debounce((query) => {
    // Call API with search query
  }, 500),
  []
);
```

3. **Optimistic Updates**
```typescript
const toggleUserStatusMutation = useMutation({
  mutationFn: async (userId: string) => {
    const response = await axiosPublic.patch(
      `/userRoutes/users/${userId}/toggle-status`
    );
    return response.data;
  },
  onMutate: async (userId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['admin-users'] });
    
    // Snapshot previous value
    const previousUsers = queryClient.getQueryData(['admin-users']);
    
    // Optimistically update
    queryClient.setQueryData(['admin-users'], (old: any) => ({
      ...old,
      data: old.data.map((user: User) =>
        user._id === userId
          ? { ...user, isBlocked: !user.isBlocked }
          : user
      ),
    }));
    
    return { previousUsers };
  },
  onError: (err, userId, context) => {
    // Rollback on error
    queryClient.setQueryData(['admin-users'], context?.previousUsers);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  },
});
```

## ✅ Checklist

- [x] API endpoint configured
- [x] useAxiosPublic hook used
- [x] React Query integrated
- [x] Data transformation implemented
- [x] Loading state handled
- [x] Error state handled
- [x] Empty state handled
- [x] Toggle status API integrated
- [x] Toast notifications added
- [x] Type definitions updated
- [x] Error handling with retry

## 📝 Next Steps

1. **Test with Real Backend**
   - Ensure backend is running
   - Verify API endpoints work
   - Test all CRUD operations

2. **Implement Other Pages**
   - Use AdminUsers as template
   - Workers, Services, Bookings, etc.
   - Follow same patterns

3. **Add More Features**
   - User details modal
   - Bulk operations
   - Advanced filtering
   - Export functionality

4. **Performance Monitoring**
   - Monitor API response times
   - Optimize slow queries
   - Add loading skeletons

---

**🎉 Your AdminUsers page is now fully integrated with your backend API!**

Navigate to `/admin/users` to see it in action.
