# 🎨 Admin Dashboard - Visual Preview

This document provides a text-based preview of what the admin dashboard looks like.

## 🖥️ Dashboard Overview (/admin/dashboard)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  Worksure                                                                       │
│  Admin Panel                                                                    │
│                                                                                 │
│  📊 Dashboard     ◄────────────────────────────────────────────────────────────│
│  👥 Users                                                                       │
│  💼 Workers                                                                     │
│  📦 Services                                                                    │
│  📅 Bookings                                                                    │
│  💳 Payments                                                                    │
│  ⭐ Reviews                                                                     │
│  💬 Complaints                                                                  │
│  📍 Addresses                                                                   │
│  📄 Reports                                                                     │
│  ⚙️  Settings                                                                   │
│                                                                                 │
│  ─────────────                                                                  │
│                                                                                 │
│  👤 Admin User                                                                  │
│     admin@worksure.com                                                          │
└─────────────────────────────────────────────────────────────────────────────────┘
         SIDEBAR                                    MAIN CONTENT
                                   ┌──────────────────────────────────────┐
                                   │  Dashboard                           │
                                   │  Welcome back! Here's your overview. │
                                   │                                      │
                                   │  ┌─────────┐ ┌─────────┐ ┌─────────┐│
                                   │  │👥       │ │💼       │ │📅       ││
                                   │  │Total    │ │Active   │ │Total    ││
                                   │  │Users    │ │Workers  │ │Bookings ││
                                   │  │2,543    │ │1,247    │ │5,892    ││
                                   │  │↑ +12.5% │ │↑ +8.2%  │ │↑ +15.3% ││
                                   │  └─────────┘ └─────────┘ └─────────┘│
                                   │                                      │
                                   │  ┌─────────┐                         │
                                   │  │💰       │                         │
                                   │  │Revenue  │                         │
                                   │  │$45,231  │                         │
                                   │  │↓ -3.1%  │                         │
                                   │  └─────────┘                         │
                                   │                                      │
                                   │  Recent Activity                     │
                                   │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
                                   │  🔵 New user registered              │
                                   │     John Doe joined the platform     │
                                   │                      2 minutes ago   │
                                   │                                      │
                                   │  🟢 Booking completed                │
                                   │     Electrician service #5892        │
                                   │                      15 minutes ago  │
                                   │                                      │
                                   │  🟡 New review posted                │
                                   │     5-star rating for AC Doctor      │
                                   │                      1 hour ago      │
                                   └──────────────────────────────────────┘
```

## 👥 Users Page (/admin/users)

```
┌─────────────────┐ ┌──────────────────────────────────────────────────────────────┐
│  Worksure       │ │  Users                                                       │
│  Admin Panel    │ │  Manage platform customers                                   │
│                 │ │                                                              │
│  📊 Dashboard   │ │  ╔═══════════════════════════════════════════════════════╗  │
│  👥 Users   ◄───┼─│  ║ Filters                                            ║  │
│  💼 Workers     │ │  ║ Search and filter users                            ║  │
│  📦 Services    │ │  ║                                                     ║  │
│  📅 Bookings    │ │  ║ 🔍 [Search by name, email, phone, or ID...      ] ║  │
│  💳 Payments    │ │  ║                                                     ║  │
│  ⭐ Reviews     │ │  ║ [Status ▼]  [Address ▼]                            ║  │
│  💬 Complaints  │ │  ║                                                     ║  │
│  📍 Addresses   │ │  ║ [🔧 More Filters]  [📥 Export]                     ║  │
│  📄 Reports     │ │  ╚═══════════════════════════════════════════════════════╝  │
│  ⚙️  Settings   │ │                                                              │
│                 │ │  Showing 5 of 5 users                                        │
│  ─────────────  │ │                                                              │
│                 │ │  ╔══════════════════════════════════════════════════════════╗│
│  👤 Admin User  │ │  ║ Users Table                                           ║│
│  admin@...com   │ │  ╠══╦════════════╦═══════════════╦═══════════╦════════╦═══╣│
└─────────────────┘ │  ║☐ ║ User       ║ Email         ║ Phone     ║ Status ║...║│
                    │  ╠══╬════════════╬═══════════════╬═══════════╬════════╬═══╣│
                    │  ║☐ ║ 👤 JD      ║ john.doe@...  ║ +1 234... ║[Active]║ ⋮ ║│
                    │  ║  ║ John Doe   ║               ║           ║        ║   ║│
                    │  ║  ║ USR001     ║               ║           ║        ║   ║│
                    │  ╠──╬────────────╬───────────────╬───────────╬────────╬───╣│
                    │  ║☐ ║ 👤 JS      ║ jane.smith@...║ +1 234... ║[Active]║ ⋮ ║│
                    │  ║  ║ Jane Smith ║               ║           ║        ║   ║│
                    │  ║  ║ USR002     ║               ║           ║        ║   ║│
                    │  ╠──╬────────────╬───────────────╬───────────╬────────╬───╣│
                    │  ║☐ ║ 👤 MJ      ║ mike.j@...    ║ +1 234... ║[Susp.] ║ ⋮ ║│
                    │  ║  ║ Mike John. ║               ║           ║        ║   ║│
                    │  ║  ║ USR003     ║               ║           ║        ║   ║│
                    │  ╠──╬────────────╬───────────────╬───────────╬────────╬───╣│
                    │  ║☐ ║ 👤 SW      ║ sarah.w@...   ║ +1 234... ║[Active]║ ⋮ ║│
                    │  ║  ║ Sarah Will.║               ║           ║        ║   ║│
                    │  ║  ║ USR004     ║               ║           ║        ║   ║│
                    │  ╠──╬────────────╬───────────────╬───────────╬────────╬───╣│
                    │  ║☐ ║ 👤 DB      ║ david.b@...   ║ +1 234... ║[Active]║ ⋮ ║│
                    │  ║  ║ David Br.  ║               ║           ║        ║   ║│
                    │  ║  ║ USR005     ║               ║           ║        ║   ║│
                    │  ╚══╩════════════╩═══════════════╩═══════════╩════════╩═══╝│
                    │                                                              │
                    │  Rows per page: [10▼]         [◄ Previous] Page 1 [Next ►] │
                    └──────────────────────────────────────────────────────────────┘
```

## 📊 Full Table View (Users Page)

```
╔═══╦════════════════════╦════════════════════════╦════════════════╦═════════╦═══╦═══╦════════════╦════════╗
║ ☐ ║ User               ║ Email                  ║ Phone          ║ Status  ║ 📍║ 📅║ Joined     ║ Actions║
╠═══╬════════════════════╬════════════════════════╬════════════════╬═════════╬═══╬═══╬════════════╬════════╣
║ ☐ ║ 👤 JD              ║ john.doe@example.com   ║ +1 234 567 890 ║ Active  ║ 2 ║ 15║ Jan 15,2024║   ⋮    ║
║   ║    John Doe        ║                        ║                ║         ║   ║   ║            ║        ║
║   ║    USR001          ║                        ║                ║         ║   ║   ║            ║        ║
╠───╬────────────────────╬────────────────────────╬────────────────╬─────────╬───╬───╬────────────╬────────╣
║ ☐ ║ 👤 JS              ║ jane.smith@example.com ║ +1 234 567 891 ║ Active  ║ 1 ║ 8 ║ Feb 20,2024║   ⋮    ║
║   ║    Jane Smith      ║                        ║                ║         ║   ║   ║            ║        ║
║   ║    USR002          ║                        ║                ║         ║   ║   ║            ║        ║
╠───╬────────────────────╬────────────────────────╬────────────────╬─────────╬───╬───╬────────────╬────────╣
║ ☐ ║ 👤 MJ              ║ mike.j@example.com     ║ +1 234 567 892 ║Suspended║ 0 ║ 3 ║ Mar 10,2024║   ⋮    ║
║   ║    Mike Johnson    ║                        ║                ║         ║   ║   ║            ║        ║
║   ║    USR003          ║                        ║                ║         ║   ║   ║            ║        ║
╠───╬────────────────────╬────────────────────────╬────────────────╬─────────╬───╬───╬────────────╬────────╣
║ ☐ ║ 👤 SW              ║ sarah.w@example.com    ║ +1 234 567 893 ║ Active  ║ 3 ║ 22║ Dec 05,2023║   ⋮    ║
║   ║    Sarah Williams  ║                        ║                ║         ║   ║   ║            ║        ║
║   ║    USR004          ║                        ║                ║         ║   ║   ║            ║        ║
╠───╬────────────────────╬────────────────────────╬────────────────╬─────────╬───╬───╬────────────╬────────╣
║ ☐ ║ 👤 DB              ║ david.b@example.com    ║ +1 234 567 894 ║ Active  ║ 1 ║ 12║ Jan 28,2024║   ⋮    ║
║   ║    David Brown     ║                        ║                ║         ║   ║   ║            ║        ║
║   ║    USR005          ║                        ║                ║         ║   ║   ║            ║        ║
╚═══╩════════════════════╩════════════════════════╩════════════════╩═════════╩═══╩═══╩════════════╩════════╝

Legend:
📍 = Address count
📅 = Booking count
⋮  = Actions menu (View, Suspend/Activate)
```

## 🎯 Action Dropdown Menu

When clicking the ⋮ button:

```
                                  ┌───────────────────┐
                                  │ 👁️  View Details   │
                                  ├───────────────────┤
                                  │ 🚫 Suspend User   │
                                  └───────────────────┘

Or (for suspended user):

                                  ┌───────────────────┐
                                  │ 👁️  View Details   │
                                  ├───────────────────┤
                                  │ ✅ Activate User  │
                                  └───────────────────┘
```

## 🔍 Search & Filter States

### Active Search:
```
╔════════════════════════════════════════════════════════════╗
║ Filters                                                    ║
║ Search and filter users                                    ║
║                                                            ║
║ 🔍 [john                                                 ]║
║                                                            ║
║ [Status ▼]  [Address ▼]                                   ║
╚════════════════════════════════════════════════════════════╝

Showing 1 of 5 users

Results: Only "John Doe" displayed
```

### Active Filter:
```
╔════════════════════════════════════════════════════════════╗
║ Filters                                                    ║
║ Search and filter users                                    ║
║                                                            ║
║ 🔍 [Search by name, email, phone, or ID...              ]║
║                                                            ║
║ [Suspended ▼]  [All Addresses ▼]                          ║
╚════════════════════════════════════════════════════════════╝

Showing 1 of 5 users

Results: Only "Mike Johnson" (suspended user) displayed
```

## 📭 Empty State

When no results found:

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                          👥                                ║
║                        ╱   ╲                              ║
║                       │     │                              ║
║                        ╲___╱                               ║
║                                                            ║
║                    No users found                          ║
║                                                            ║
║            Try adjusting your search or filters            ║
║                                                            ║
║                    [Clear Filters]                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

## ⏳ Loading State

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                          ⏳                                 ║
║                         ╱│╲                                ║
║                        ╱ │ ╲                               ║
║                       ─────                                ║
║                      (spinning)                            ║
║                                                            ║
║                   Loading users...                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

## 🎨 Color Legend

```
┌────────────────────────────────────────┐
│ Status Badges                          │
├────────────────────────────────────────┤
│ [Active]    = Green background         │
│ [Suspended] = Red background           │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Sidebar Active State                   │
├────────────────────────────────────────┤
│ Active item = Blue background          │
│ Hover item  = Light gray background    │
│ Normal item = White background         │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Table Elements                         │
├────────────────────────────────────────┤
│ Header      = Gray background          │
│ Rows        = White/alternating        │
│ Borders     = Light gray               │
│ Hover row   = Very light gray          │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Counts & Indicators                    │
├────────────────────────────────────────┤
│ Address count = Gray circle            │
│ Booking count = Blue circle            │
│ Trend up      = Green ↑                │
│ Trend down    = Red ↓                  │
└────────────────────────────────────────┘
```

## 📱 Responsive Behavior

### Desktop (> 1024px):
- Sidebar: Fixed width (256px)
- Main content: Fills remaining space
- Table: Full width, all columns visible

### Tablet (768px - 1024px):
- Sidebar: Collapsible or always visible
- Main content: Adjusted padding
- Table: Scrollable horizontally

### Mobile (< 768px):
- Sidebar: Hamburger menu
- Main content: Full width
- Table: Converts to card layout:

```
┌─────────────────────────┐
│ 👤 JD                   │
│    John Doe             │
│    USR001               │
├─────────────────────────┤
│ 📧 john.doe@example.com │
│ 📱 +1 234 567 8900      │
│ ✅ Active               │
│ 📍 2 addresses          │
│ 📅 15 bookings          │
│ 📆 Joined Jan 15, 2024  │
├─────────────────────────┤
│ [View]  [Suspend]       │
└─────────────────────────┘
```

## 🎬 Interaction Flow

### User Suspends an Account:

```
1. User clicks ⋮ on a row
   └─ Dropdown appears
   
2. User clicks "Suspend User"
   └─ handleToggleStatus(userId) called
      └─ setUsers() updates state
         └─ Component re-renders
            └─ Badge changes: Active → Suspended
               └─ Badge color: Green → Red
               
3. Action menu updates
   └─ "Suspend User" → "Activate User"
```

### User Searches:

```
1. User types in search box
   └─ onChange event fires
      └─ setSearchQuery(value) called
         └─ Component re-renders
            └─ filteredUsers recalculates
               └─ Table updates with filtered results
                  └─ Result count updates
```

## ✨ Polish & Details

### Hover States:
- Sidebar items: Light gray background
- Table rows: Very light gray background
- Buttons: Slightly darker shade
- Checkboxes: Blue border

### Focus States:
- Inputs: Blue border (2px)
- Buttons: Blue outline
- Checkboxes: Blue ring

### Transitions:
- Sidebar active state: 150ms ease
- Button hover: 200ms ease
- Dropdown appear: 150ms ease-out

### Animations:
- Loading spinner: Continuous rotation
- Dropdown menu: Slide down (100ms)
- Badge: Subtle pulse on change

---

This visual preview gives you a clear picture of what the admin dashboard looks like
without needing to run the application. The actual implementation uses modern React
components with Tailwind CSS for a polished, professional appearance.
