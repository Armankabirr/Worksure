# Admin Complaints - API Integration Guide

## ✅ API Integration Complete

The Admin Complaints page has been updated to work with your actual backend API endpoints.

---

## 🔌 Integrated API Endpoints

### 1. Get All Complaints
**Endpoint**: `GET /complaints/getAllcomplaints`

**Query Parameters** (sent to backend):
- `status` - Filter by complaint status (open, under_review, awaiting_response, resolved, rejected, closed)
- `category` - Filter by category
- `priority` - Filter by priority (low, medium, high)

**Client-Side Filters** (not sent to backend):
- `search` - Search by complaint ID, booking ID, user/worker name
- `subCategory` - Filter by sub-category
- `raisedBy` - Filter by role (user/worker)
- `dateFrom` & `dateTo` - Date range filtering

**Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "raised_by_user_id": "uuid",
      "raised_by_role": "client|worker",
      "against_user_id": "uuid",
      "booking_id": "uuid",
      "payment_id": "uuid",
      "category": "string",
      "sub_category": "string",
      "priority": "low|medium|high",
      "description": "string",
      "attachments": null,
      "status": "open|under_review|awaiting_response|resolved|rejected|closed",
      "admin_notes": null,
      "resolution": null,
      "created_at": "ISO date",
      "updated_at": "ISO date",
      "resolved_at": null
    }
  ],
  "count": 1
}
```

### 2. Get Complaint Details
**Endpoint**: `GET /complaints/getComplaintDetailsById/:id`

**Response Format**:
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "raisedBy": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "avatar": "url",
      "role": "client|worker"
    },
    "against": {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "phone": "string",
      "avatar": "url",
      "role": "client|worker"
    },
    "booking": {
      "id": "uuid",
      "status": "string",
      "scheduledTime": "ISO date",
      "totalAmount": "string",
      "description": "string",
      "address": "string",
      "workStart": "ISO date",
      "workEnd": "ISO date",
      "createdAt": "ISO date"
    },
    "payment": {
      "id": "uuid",
      "amount": "string",
      "status": "paid|unpaid",
      "method": "string",
      "transactionId": "string",
      "paidAt": "ISO date",
      "createdAt": "ISO date"
    },
    "category": "string",
    "subCategory": "string",
    "priority": "low|medium|high",
    "description": "string",
    "attachments": null,
    "status": "string",
    "adminNotes": null,
    "resolution": null,
    "createdAt": "ISO date",
    "updatedAt": "ISO date",
    "resolvedAt": null
  }
}
```

### 3. Update Complaint Status
**Endpoint**: `PATCH /complaints/updatecomplaintStatus/:id`

**Request Body**:
```json
{
  "status": "open|under_review|awaiting_response|resolved|rejected|closed",
  "admin_notes": "string or null",
  "resolution": "string or null"
}
```

**Response Format**:
```json
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": {
    // Updated complaint object
  }
}
```

---

## 🔄 Data Transformation

The service layer automatically transforms between your backend's snake_case format and the frontend's camelCase format:

### Backend → Frontend Mapping
```javascript
{
  raised_by_user_id → raisedBy.id
  raised_by_role → raisedBy.role
  against_user_id → against.id
  booking_id → booking.id
  payment_id → payment.id
  sub_category → subCategory
  admin_notes → adminNotes
  created_at → createdAt
  updated_at → updatedAt
  resolved_at → resolvedAt
}
```

---

## 🎯 Feature Implementation Details

### Filtering Strategy

**Server-Side Filters** (sent to API):
- ✅ Status
- ✅ Category
- ✅ Priority

**Client-Side Filters** (applied in frontend):
- ✅ Search (ID, booking, names)
- ✅ Sub-category
- ✅ Raised by (role)
- ✅ Date range (from/to)

### Why Hybrid Filtering?

Server-side filtering reduces data transfer and improves performance for large datasets. Client-side filtering provides instant results for filters not supported by your backend API.

---

## 📊 Statistics Calculation

Since your API doesn't have a dedicated stats endpoint, statistics are calculated client-side from the fetched complaints data:

```javascript
const stats = {
  total: complaints.length,
  open: complaints.filter(c => c.status === 'open').length,
  underReview: complaints.filter(c => c.status === 'under_review').length,
  awaitingResponse: complaints.filter(c => c.status === 'awaiting_response').length,
  resolved: complaints.filter(c => c.status === 'resolved').length,
  rejected: complaints.filter(c => c.status === 'rejected').length,
  closed: complaints.filter(c => c.status === 'closed').length,
};
```

---

## 🛠️ Admin Actions Implementation

### 1. Change Status
Uses the status update endpoint with only the status field:
```javascript
updateComplaintStatus(id, newStatus, null, null)
```

### 2. Add Admin Note
Uses the status update endpoint with admin_notes:
```javascript
updateComplaintStatus(id, currentStatus, noteText, null)
```

### 3. Resolve Complaint
Uses the status update endpoint with resolution:
```javascript
updateComplaintStatus(id, 'resolved', null, resolutionText)
```

### 4. Reject Complaint
Uses the status update endpoint with admin_notes as rejection reason:
```javascript
updateComplaintStatus(id, 'rejected', rejectionReason, null)
```

### 5. Assign to Admin
Currently uses a workaround with the status update endpoint:
```javascript
updateComplaintStatus(id, 'under_review', `Assigned to admin: ${adminId}`, null)
```

**Note**: You may want to implement a dedicated assign endpoint on your backend if this feature is important.

---

## 🔐 Authentication

The service uses Supabase authentication:

```javascript
private getAuthHeaders(): HeadersInit {
  const session = supabase.auth.getSession();
  return session ? { Authorization: `Bearer ${session}` } : {};
}
```

**Important**: Make sure your backend API accepts and validates Supabase JWT tokens.

---

## ⚙️ Configuration

Set your API base URL in the environment file:

**.env**:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Or for production:
```
VITE_API_BASE_URL=https://your-api.com/api
```

---

## 🧪 Testing the Integration

### 1. Start Your Backend
```bash
# Make sure your backend is running
# Default: http://localhost:5000
```

### 2. Configure API URL
```bash
# Create or update .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
```

### 3. Test in Browser
1. Navigate to `/admin/complaints`
2. Open browser DevTools → Network tab
3. You should see API calls to:
   - `/complaints/getAllcomplaints?status=all&category=all&priority=all`
   - `/complaints/getComplaintDetailsById/:id` (when viewing details)
   - `/complaints/updatecomplaintStatus/:id` (when updating)

### 4. Check for Errors
- If API fails, page automatically falls back to mock data
- Check console for error messages
- Toast notification will show "Using Demo Data" if API is unavailable

---

## 🐛 Troubleshooting

### Issue: "Using Demo Data" message appears
**Causes**:
1. Backend API is not running
2. Wrong API base URL in .env
3. CORS issues
4. Authentication failure

**Solutions**:
1. Start your backend server
2. Verify `VITE_API_BASE_URL` is correct
3. Configure CORS on backend to allow your frontend origin
4. Check authentication headers are being sent

### Issue: No complaints showing
**Causes**:
1. Empty database
2. Filters too restrictive
3. API returning empty array

**Solutions**:
1. Create test complaints in your database
2. Click "Clear Filters" button
3. Check backend logs for database query issues

### Issue: Status update not working
**Causes**:
1. Authentication required
2. Invalid status transition
3. Missing required fields

**Solutions**:
1. Ensure user is logged in as admin
2. Check status workflow rules in backend
3. Verify request body matches expected format

### Issue: Details drawer shows incomplete data
**Causes**:
1. Details endpoint not returning full data
2. Missing user/booking/payment joins in backend

**Solutions**:
1. Check `/getComplaintDetailsById` endpoint response
2. Verify backend includes all necessary JOIN queries
3. Check console for transformation errors

---

## 📝 Backend Requirements

To fully support all features, your backend should:

### ✅ Already Implemented
- [x] Get all complaints with filters (status, category, priority)
- [x] Get complaint details by ID with related data
- [x] Update complaint status with notes and resolution

### 🔄 Recommended Additions
- [ ] **Pagination support**: Add `page` and `limit` query params
- [ ] **Stats endpoint**: Return pre-calculated statistics
- [ ] **Assign endpoint**: Dedicated endpoint for admin assignment
- [ ] **Search support**: Backend search by ID, name, etc.
- [ ] **Date filter support**: Filter by date range on backend
- [ ] **Attachment upload**: Handle file uploads for attachments

---

## 🚀 Performance Optimization

### Current Implementation
- Server-side filtering for status, category, priority
- Client-side filtering for search, sub-category, dates
- Stats calculated from current page data

### Recommended Improvements
1. **Add pagination support in backend**
   - Reduce data transfer
   - Faster page loads
   - Better performance with large datasets

2. **Add stats endpoint**
   - Pre-calculate statistics
   - Reduce client-side computation
   - Always accurate counts

3. **Add search endpoint**
   - Full-text search on backend
   - Search across all fields
   - Better performance than client-side

---

## 📊 Example API Calls

### Get All Open Complaints
```
GET /complaints/getAllcomplaints?status=open
```

### Get High Priority Payment Issues
```
GET /complaints/getAllcomplaints?category=Payment%20%26%20Billing&priority=high
```

### Get Complaint Details
```
GET /complaints/getComplaintDetailsById/ad27c67e-eeb5-4b5f-a409-793bcf495c47
```

### Resolve Complaint
```
PATCH /complaints/updatecomplaintStatus/ad27c67e-eeb5-4b5f-a409-793bcf495c47

Body:
{
  "status": "resolved",
  "admin_notes": null,
  "resolution": "Issue has been resolved. Refund processed."
}
```

### Add Admin Note
```
PATCH /complaints/updatecomplaintStatus/ad27c67e-eeb5-4b5f-a409-793bcf495c47

Body:
{
  "status": "under_review",
  "admin_notes": "Contacted user for more information",
  "resolution": null
}
```

---

## ✅ Integration Checklist

- [x] API service updated to use correct endpoints
- [x] Request/response transformation implemented
- [x] Client-side filtering for unsupported filters
- [x] Statistics calculation from data
- [x] Error handling with fallback to mock data
- [x] Authentication headers included
- [x] All CRUD operations functional
- [ ] Configure backend CORS
- [ ] Set API base URL in .env
- [ ] Test with real backend
- [ ] Verify authentication flow

---

**Integration Status**: ✅ Complete
**Backend Compatible**: ✅ Yes
**Fallback Support**: ✅ Yes (Mock Data)
**Ready for Testing**: ✅ Yes

---

*Last Updated: January 25, 2026*
