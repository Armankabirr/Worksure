# Visual UI Guide - Admin Bookings Page

This document describes what the Admin Bookings page looks like when rendered.

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Bookings Management                                    [Refresh] [Export]   │
│  Monitor and manage all service bookings                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ 📅 Total     │ 🕐 Pending   │ 🔄 Ongoing   │ ✅ Completed │ ❌ Cancelled │
│ Bookings     │ Bookings     │ Bookings     │ Bookings     │ Bookings     │
│              │              │              │              │              │
│    10        │     2        │     1        │     6        │     1        │
└──────────────┴──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  🔍 Filters & Search                                        [Hide Filters]  │
│                                                                             │
│  Search by Booking ID, User Name, Phone, or Worker Name...                 │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ 🔍 [                                                               ] │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────┬──────────────┬──────────────┬──────────┬──────────┐    │
│  │ Booking      │ Service      │ Payment      │ From     │ To       │    │
│  │ Status ▼     │ Category ▼   │ Status ▼     │ Date     │ Date     │    │
│  └──────────────┴──────────────┴──────────────┴──────────┴──────────┘    │
│                                                                             │
│                                                      [× Clear Filters]      │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  All Bookings                                                               │
│  Showing 10 of 10 bookings                                                  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │ Booking ID  │ User        │ Worker      │ Service  │ ... │ Actions   │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ BK-2026-0001│ Rahul Ahmed │ Karim Khan  │ AC Doctor│ ... │ ⋮         │ │
│  │             │ +880 1712.. │ ✅ Verified │ Split AC │ ... │           │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ BK-2026-0002│ Fatima Sul..│ Rahim Mia   │ Cleaning │ ... │ ⋮         │ │
│  │             │ +880 1912.. │ ✅ Verified │ Deep     │ ... │           │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ BK-2026-0003│ Tanvir Has..│ Shakil Ahm..│ Electric │ ... │ ⋮         │ │
│  │ ...more rows...                                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Showing 1 to 8 of 10 bookings      [◀ Previous] [1] [2] [Next ▶]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Details

### 1. Statistics Cards (Top Row)

```
┌──────────────────────────┐
│ 📅 Total Bookings        │
│                          │
│         10               │  ← Large number
│                          │
└──────────────────────────┘
    Blue background

┌──────────────────────────┐
│ 🕐 Pending Bookings      │
│                          │
│         2                │
│                          │
└──────────────────────────┘
    Yellow background

┌──────────────────────────┐
│ 🔄 Ongoing Bookings      │
│                          │
│         1                │
│                          │
└──────────────────────────┘
    Purple background

┌──────────────────────────┐
│ ✅ Completed Bookings    │
│                          │
│         6                │
│                          │
└──────────────────────────┘
    Green background

┌──────────────────────────┐
│ ❌ Cancelled Bookings    │
│                          │
│         1                │
│                          │
└──────────────────────────┘
    Red background
```

**Features:**
- Hover effect: Shadow lifts on hover
- Icons with matching color backgrounds
- Responsive: Stack on mobile, 2 columns on tablet, 5 columns on desktop

---

### 2. Filters Panel

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Filters & Search              [Show/Hide Filters]   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🔍 Search...                                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  Status      Category    Payment     From Date  To Date │
│  [All ▼ ]    [All ▼ ]    [All ▼ ]   [____]     [____]  │
│                                                          │
│                                   [× Clear Filters]      │
└─────────────────────────────────────────────────────────┘
```

**Filter Options:**
- **Status**: All, Pending, Accepted, Ongoing, Completed, Cancelled
- **Category**: All, Cleaning, Electrician, Plumbing, Catering, Babysitting, Pet Care, AC Doctor
- **Payment**: All, Paid, Unpaid, Refunded
- **Date Range**: From/To date pickers

**Behavior:**
- Clear Filters button only shows when filters are active
- Can collapse/expand entire section
- Real-time filtering as you type/select

---

### 3. Bookings Table

**Full Table Structure:**

| Booking ID | User | Worker | Service | Scheduled | Status | Payment | Amount | Created | Actions |
|------------|------|--------|---------|-----------|--------|---------|--------|---------|---------|
| BK-2026-0001 | Rahul Ahmed<br>+880 1712-... | Karim Khan<br>✅ Verified<br>⭐ 4.8 | AC Doctor<br>AC Repair | Jan 25, 2026<br>10:00 AM | 🟦 Accepted | 🟩 Paid | ৳1,500 | Jan 22 | ⋮ |
| BK-2026-0002 | Fatima Sultana<br>+880 1912-... | Rahim Mia<br>✅ Verified<br>⭐ 4.6 | Cleaning<br>Deep Cleaning | Jan 23, 2026<br>2:00 PM | 🟪 Ongoing | 🟩 Paid | ৳2,800 | Jan 21 | ⋮ |

**Status Badge Colors:**
- 🟨 **Yellow** = Pending
- 🟦 **Blue** = Accepted
- 🟪 **Purple** = Ongoing
- 🟩 **Green** = Completed
- 🟥 **Red** = Cancelled

**Payment Badge Colors:**
- 🟩 **Green** = Paid
- 🟧 **Orange** = Unpaid
- ⬜ **Gray** = Refunded

**Worker Status:**
- ✅ Green checkmark = Verified
- 🚫 Red badge = Not Assigned

**Action Menu (⋮):**
```
┌─────────────────────────┐
│ Actions                 │
├─────────────────────────┤
│ 👁️ View Details         │
│ 👤 Assign Worker        │
│ 🔄 Reassign Worker      │
│ ✅ Mark Completed       │
│ ❌ Cancel Booking       │
│ 💰 Process Refund       │
└─────────────────────────┘
```

---

### 4. Booking Details Drawer (Side Panel)

When clicking "View Details", a drawer slides from the right:

```
                    ┌────────────────────────────────────┐
                    │ Booking Details              [×]   │
                    │ Complete information about         │
                    │ booking BK-2026-0001              │
                    ├────────────────────────────────────┤
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │ ✅ Booking Status Timeline     │ │
                    │ │                                │ │
                    │ │ • Pending (Jan 22, 08:30)     │ │
                    │ │ • Accepted (Jan 22, 09:15)    │ │
                    │ │   Worker accepted the booking │ │
                    │ │                                │ │
                    │ │ Change Status: [Accepted ▼]   │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │ 💼 Service Information         │ │
                    │ │                                │ │
                    │ │ Category: AC Doctor            │ │
                    │ │ Section: AC Repair             │ │
                    │ │ Service: Split AC Gas Refill   │ │
                    │ │                                │ │
                    │ │ 📅 Jan 25, 2026  🕐 10:00 AM  │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │ 👤 Customer Information        │ │
                    │ │                                │ │
                    │ │ Name: Rahul Ahmed              │ │
                    │ │ 📞 +880 1712-345678            │ │
                    │ │ ✉️ rahul@example.com           │ │
                    │ │ 📍 House 23, Road 5, Dhanmondi │ │
                    │ │ ⭐ Rating: 4.5 / 5.0           │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │ 💼 Worker Information          │ │
                    │ │                                │ │
                    │ │ Karim Khan ✅ Verified         │ │
                    │ │ 📞 +880 1823-456789            │ │
                    │ │ ⭐ 4.8 / 5.0                   │ │
                    │ │ Completed Jobs: 145            │ │
                    │ │                                │ │
                    │ │ Specialization:                │ │
                    │ │ [AC Repair] [Installation]     │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │ 💰 Payment Information         │ │
                    │ │                                │ │
                    │ │ Status: [Paid]  Amount: ৳1,500│ │
                    │ │ 💳 Method: bKash               │ │
                    │ │ Transaction: TRX20260122001    │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    │ ┌────────────────────────────────┐ │
                    │ │ 📝 Admin Notes                 │ │
                    │ │                                │ │
                    │ │ Internal notes (not visible    │ │
                    │ │ to customer or worker)         │ │
                    │ │                                │ │
                    │ │ [Current notes displayed]      │ │
                    │ │                                │ │
                    │ │ ┌──────────────────────────┐  │ │
                    │ │ │ Add notes here...        │  │ │
                    │ │ │                          │  │ │
                    │ │ └──────────────────────────┘  │ │
                    │ │                                │ │
                    │ │ [💾 Save Notes]               │ │
                    │ └────────────────────────────────┘ │
                    │                                    │
                    └────────────────────────────────────┘
```

**Drawer Features:**
- Scrollable content
- Closes on clicking outside or [×] button
- All information cards are clearly separated
- Inline status change dropdown
- Admin notes textarea with save button

---

## Color-Coding System

### Status Colors
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Pending | Yellow 100 | Yellow 800 | Yellow 300 |
| Accepted | Blue 100 | Blue 800 | Blue 300 |
| Ongoing | Purple 100 | Purple 800 | Purple 300 |
| Completed | Green 100 | Green 800 | Green 300 |
| Cancelled | Red 100 | Red 800 | Red 300 |

### Payment Colors
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Paid | Green 100 | Green 800 | Green 300 |
| Unpaid | Orange 100 | Orange 800 | Orange 300 |
| Refunded | Gray 100 | Gray 800 | Gray 300 |

---

## Interactive Elements

### Buttons
- **Primary Actions**: Blue background, white text (Export, Refresh, Save)
- **Secondary Actions**: White background, gray border (Previous, Next)
- **Danger Actions**: Red text (Cancel Booking)

### Hover Effects
- Cards: Shadow elevation
- Table rows: Light gray background
- Buttons: Slight darkening
- Links: Underline appears

### Loading States
- Statistics cards show skeleton loaders
- Table shows "Loading..." message
- Buttons show spinner icons during async operations

---

## Responsive Behavior

### Mobile (< 768px)
- Statistics cards: 1 column (stacked)
- Filter controls: 1 column (stacked)
- Table: Horizontal scroll
- Pagination: Compact view
- Drawer: Full width

### Tablet (768px - 1024px)
- Statistics cards: 2 columns
- Filter controls: 2 columns
- Table: Visible with scroll if needed
- Drawer: 90% width

### Desktop (> 1024px)
- Statistics cards: 5 columns (full row)
- Filter controls: 5 columns (full row)
- Table: Fully visible
- Pagination: Full controls
- Drawer: Max 50% width (fixed at 672px)

---

## Empty States

### No Bookings Found
```
┌─────────────────────────────────────┐
│                                     │
│         📭                          │
│                                     │
│     No bookings found               │
│                                     │
│  Try adjusting your filters         │
│                                     │
└─────────────────────────────────────┘
```

### No Worker Assigned
```
🚫 Not Assigned
    (Red badge with warning icon)
```

---

## Confirmation Dialogs

### Cancel Booking
```
┌──────────────────────────────────────────┐
│  Cancel Booking                          │
│                                          │
│  Are you sure you want to cancel         │
│  booking BK-2026-0001? This action       │
│  cannot be undone.                       │
│                                          │
│  [Cancel]  [Yes, Cancel Booking]         │
└──────────────────────────────────────────┘
```

### Process Refund
```
┌──────────────────────────────────────────┐
│  Process Refund                          │
│                                          │
│  Are you sure you want to process a      │
│  refund of ৳1,500 for booking            │
│  BK-2026-0001?                          │
│                                          │
│  [Cancel]  [Process Refund]              │
└──────────────────────────────────────────┘
```

---

## Toast Notifications

Appear in bottom-right corner:

```
┌────────────────────────────┐
│ ✅ Status Updated          │
│ Booking BK-2026-0001       │
│ status changed to accepted │
└────────────────────────────┘
    (Auto-dismisses after 3s)

┌────────────────────────────┐
│ ❌ Error                   │
│ Failed to load bookings    │
└────────────────────────────┘
    (Red variant)
```

---

## Icons Used

- 📅 Calendar - Total bookings, scheduled date
- 🕐 Clock - Pending status, time
- 🔄 Loader - Ongoing status, refresh
- ✅ CheckCircle - Completed status, verified
- ❌ XCircle - Cancelled status
- 🔍 Search - Search functionality
- 🔽 Filter - Filters section
- 👁️ Eye - View details
- 👤 UserCog - Assign worker
- ✏️ Edit - Edit actions
- 💰 DollarSign - Payment info
- 💳 CreditCard - Payment method
- 📝 FileText - Admin notes
- 🛡️ ShieldCheck - Verified badge
- ⚠️ ShieldAlert - Unverified alert
- ⭐ Star - Ratings
- 💼 Briefcase - Service/Worker info
- 📞 Phone - Contact
- ✉️ Mail - Email
- 📍 MapPin - Address
- ⋮ MoreVertical - Action menu
- ◀ ChevronLeft - Previous page
- ▶ ChevronRight - Next page
- 📥 Download - Export
- 🔃 RefreshCcw - Refresh data

---

## Key UX Features

1. **Visual Hierarchy**: Important info (booking ID, status) stands out
2. **Color Coding**: Quick status recognition at a glance
3. **Contextual Actions**: Only relevant actions shown per booking state
4. **Confirmation Dialogs**: Prevent accidental critical actions
5. **Toast Feedback**: Immediate feedback on all actions
6. **Loading States**: Clear indicators when data is being fetched
7. **Empty States**: Helpful messages when no data found
8. **Pagination**: Easy navigation through large datasets
9. **Sorting**: Click headers to sort data
10. **Filtering**: Multiple filter options for precise results

---

This UI design follows modern admin dashboard patterns with a clean, professional look that prioritizes usability and efficiency for admin users managing bookings at scale.
