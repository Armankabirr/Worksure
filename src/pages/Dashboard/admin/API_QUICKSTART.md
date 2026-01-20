# 🚀 Quick Start - API Integration

## ✅ What Was Changed

The AdminUsers page now fetches real data from your backend API instead of using mock data.

## 🔧 Setup Steps

### 1. Environment Configuration
Create or update `.env` file in your project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Start Your Servers

**Backend:**
```bash
cd path/to/backend
npm run dev
```

**Frontend:**
```bash
cd /home/nayeem/UIU/12th\ trimester/SE\ Lab/Worksure
npm run dev
```

### 3. Test It
Navigate to: `http://localhost:5173/admin/users`

## 📡 API Endpoints Required

### 1. Get All Users
```
GET /userRoutes/users

Response:
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "isBlocked": false,
      "addresses": [...],
      "bookings": [...],
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 2. Toggle User Status
```
PATCH /userRoutes/users/:userId/toggle-status

Response:
{
  "success": true,
  "message": "User status updated",
  "data": { "_id": "user123", "isBlocked": true }
}
```

## 🎯 New Features

- ✅ Real-time data from API
- ✅ Auto-refresh after updates
- ✅ Loading spinner
- ✅ Error handling with retry
- ✅ Success/error toast notifications
- ✅ Suspend/Activate via API

## 🐛 Quick Troubleshooting

**Problem:** Can't see any users  
**Solution:** Check that backend is running and API URL is correct in `.env`

**Problem:** "Failed to load users" error  
**Solution:** 
1. Verify backend is running
2. Check browser console for CORS errors
3. Test API endpoint directly: `http://localhost:5000/api/userRoutes/users`

**Problem:** Toggle status not working  
**Solution:** Ensure backend has the PATCH endpoint implemented

## 📝 Test Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Navigate to `/admin/users`
- [ ] See loading spinner
- [ ] Users display from API
- [ ] Search works
- [ ] Filter works
- [ ] Click suspend/activate
- [ ] See toast notification
- [ ] User status updates

## 📚 Documentation

For detailed information, see:
- [API_INTEGRATION.md](./API_INTEGRATION.md) - Complete integration guide
- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide

## 🔗 Key Files Modified

- ✅ `AdminUsers.tsx` - Updated to use API
  - Added React Query
  - Added API calls
  - Added error handling
  - Added toast notifications

## 💡 Next Steps

1. Test the integration thoroughly
2. Implement similar API integration for other pages
3. Add authentication if required
4. Implement server-side pagination
5. Add more advanced features

---

**Ready to test!** Start both servers and navigate to `/admin/users` 🎉
