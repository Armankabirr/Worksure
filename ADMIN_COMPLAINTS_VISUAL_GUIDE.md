# Admin Complaints Page - Visual Component Guide

## 🎨 Component Hierarchy

```
AdminComplaints (Main Page)
│
├── Page Header
│   ├── Title + Icon
│   ├── Subtitle
│   └── Action Buttons (Refresh, Export)
│
├── ComplaintStatsCards
│   ├── Total Card
│   ├── Open Card
│   ├── Under Review Card
│   ├── Awaiting Response Card
│   ├── Resolved Card
│   ├── Rejected Card
│   └── Closed Card
│
├── ComplaintFilters
│   ├── Search Input
│   ├── Status Select
│   ├── Category Select
│   ├── Sub-Category Select
│   ├── Priority Select
│   ├── Raised By Select
│   ├── Date From Input
│   ├── Date To Input
│   └── Clear Filters Button
│
├── ComplaintTable
│   ├── Table Header
│   │   ├── ID Column
│   │   ├── Category Column
│   │   ├── Sub-Category Column
│   │   ├── Booking ID Column
│   │   ├── Raised By Column
│   │   ├── Against Column
│   │   ├── Status Column
│   │   ├── Priority Column
│   │   ├── Created Column
│   │   ├── Updated Column
│   │   └── Actions Column
│   │
│   ├── Table Rows
│   │   └── DropdownMenu (per row)
│   │       ├── View Details
│   │       ├── Change Status
│   │       ├── Assign Admin
│   │       ├── Add Note
│   │       ├── Resolve
│   │       └── Reject
│   │
│   └── Pagination Controls
│       ├── Results Info
│       ├── Previous Button
│       ├── Page Numbers
│       └── Next Button
│
├── ComplaintDetailDrawer
│   ├── Drawer Header
│   │   ├── Title
│   │   └── Complaint ID
│   │
│   ├── Status & Priority Badges
│   │
│   ├── Tabs
│   │   ├── Overview Tab
│   │   │   ├── Category
│   │   │   ├── Sub-Category
│   │   │   ├── Subject
│   │   │   ├── Description
│   │   │   ├── Attachments
│   │   │   └── Timestamps
│   │   │
│   │   ├── Parties Tab
│   │   │   ├── Raised By Card
│   │   │   │   ├── Avatar
│   │   │   │   ├── Name
│   │   │   │   ├── Role
│   │   │   │   ├── Email
│   │   │   │   └── Phone
│   │   │   │
│   │   │   └── Against Card
│   │   │       ├── Avatar
│   │   │       ├── Name
│   │   │       ├── Role
│   │   │       ├── Email
│   │   │       └── Phone
│   │   │
│   │   ├── Booking Tab
│   │   │   ├── Booking Details
│   │   │   │   ├── ID
│   │   │   │   ├── Status
│   │   │   │   ├── Service
│   │   │   │   ├── Scheduled Time
│   │   │   │   ├── Address
│   │   │   │   ├── Amount
│   │   │   │   └── Description
│   │   │   │
│   │   │   └── Payment Details
│   │   │       ├── Amount
│   │   │       ├── Status
│   │   │       ├── Method
│   │   │       └── Transaction ID
│   │   │
│   │   └── Admin Tab
│   │       ├── Internal Notes
│   │       │   ├── Note List
│   │       │   └── Add Note Form
│   │       │
│   │       ├── Resolution (if resolved)
│   │       ├── Rejection Reason (if rejected)
│   │       │
│   │       └── Timeline
│   │           └── Event List
│   │
│   └── Action Buttons
│       ├── Mark Under Review
│       ├── Awaiting Response
│       ├── Resolve
│       └── Reject
│
└── Dialogs
    ├── Status Change Dialog
    │   ├── Status Select
    │   ├── Reason Textarea
    │   └── Confirm/Cancel
    │
    ├── Assign Admin Dialog
    │   ├── Admin ID Input
    │   └── Confirm/Cancel
    │
    ├── Add Note Dialog
    │   ├── Note Textarea
    │   └── Confirm/Cancel
    │
    ├── Resolve Dialog
    │   ├── Resolution Textarea
    │   └── Confirm/Cancel
    │
    └── Reject Dialog
        ├── Rejection Reason Textarea
        └── Confirm/Cancel
```

## 🎨 Color Scheme

### Status Colors
| Status | Background | Text | Border | Use Case |
|--------|-----------|------|--------|----------|
| Open | `bg-orange-100` | `text-orange-800` | `border-orange-300` | New complaints |
| Under Review | `bg-purple-100` | `text-purple-800` | `border-purple-300` | Being investigated |
| Awaiting Response | `bg-yellow-100` | `text-yellow-800` | `border-yellow-300` | Need info from user/worker |
| Resolved | `bg-green-100` | `text-green-800` | `border-green-300` | Successfully resolved |
| Rejected | `bg-red-100` | `text-red-800` | `border-red-300` | Invalid/rejected |
| Closed | `bg-gray-100` | `text-gray-800` | `border-gray-300` | Archived/final |

### Priority Colors
| Priority | Background | Text | Border | Icon |
|----------|-----------|------|--------|------|
| High | `bg-red-100` | `text-red-800` | `border-red-300` | 🔴 |
| Medium | `bg-orange-100` | `text-orange-800` | `border-orange-300` | 🟠 |
| Low | `bg-green-100` | `text-green-800` | `border-green-300` | 🟢 |

### Component Colors
| Component | Background | Border | Text |
|-----------|-----------|--------|------|
| Stats Card | `bg-white` | `border-gray-200` | `text-gray-900` |
| Filter Card | `bg-white` | `border-gray-200` | `text-gray-700` |
| Table | `bg-white` | `border-gray-200` | `text-gray-900` |
| Drawer | `bg-white` | - | `text-gray-900` |

## 🔤 Typography

### Headings
```css
Page Title: text-3xl font-bold tracking-tight
Section Title: text-xl font-semibold
Card Title: text-sm font-medium
Label: text-xs font-medium text-gray-500
```

### Body Text
```css
Primary: text-sm text-gray-900
Secondary: text-sm text-gray-600
Muted: text-xs text-gray-500
Error: text-sm text-red-600
Success: text-sm text-green-600
```

## 📐 Spacing

### Grid Layouts
```css
Stats Cards: grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7
Filters: grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6
```

### Card Padding
```css
Stats Card: p-6
Filter Card: p-6
Table Cell: px-4 py-3
Drawer Content: p-6
```

### Gaps
```css
Section Gap: space-y-6
Card Content Gap: space-y-4
Form Field Gap: space-y-2
Inline Items Gap: gap-2
```

## 🎭 Icons

### Lucide React Icons Used
| Icon | Component | Purpose |
|------|-----------|---------|
| `AlertCircle` | Page Header, Drawer | Complaint indicator |
| `ClipboardList` | Stats Card | Total complaints |
| `Clock` | Stats Card, Timeline | Under review, time |
| `MessageSquare` | Stats Card | Awaiting response |
| `CheckCircle` | Stats Card, Actions | Resolved |
| `XCircle` | Stats Card, Actions | Rejected |
| `Archive` | Stats Card | Closed |
| `Search` | Filter | Search input |
| `Calendar` | Filter | Date inputs |
| `X` | Filter | Clear filters |
| `Download` | Header | Export |
| `RefreshCcw` | Header | Refresh |
| `Eye` | Table Actions | View details |
| `MoreVertical` | Table | Actions menu |
| `UserPlus` | Table Actions | Assign admin |
| `FileText` | Table Actions | Add note |
| `User` | Drawer | User info |
| `Briefcase` | Drawer | Booking info |
| `CreditCard` | Drawer | Payment info |
| `MapPin` | Drawer | Address |
| `DollarSign` | Drawer | Amount |
| `Image` | Drawer | Attachments |
| `ChevronLeft` | Pagination | Previous |
| `ChevronRight` | Pagination | Next |

## 📱 Responsive Breakpoints

### Mobile (< 768px)
```
- Single column stats
- Single column filters
- Horizontal scroll table
- Full-screen drawer
- Stacked action buttons
```

### Tablet (768px - 1024px)
```
- 2-column stats
- 2-column filters
- Reduced table columns
- Partial drawer
- Inline action buttons
```

### Desktop (> 1024px)
```
- 4-7 column stats
- 4-6 column filters
- Full table display
- Side drawer (60% width)
- Full action buttons
```

## 🎬 Animations

### Loading States
```css
Skeleton: animate-pulse
Spinner: animate-spin (RefreshCcw icon)
```

### Transitions
```css
Card Hover: hover:shadow-md transition-shadow
Button Hover: hover:bg-primary/80
Badge: transition-colors
```

### Dialog Animations
- Fade in/out for overlay
- Slide in from right for drawer
- Scale for alert dialogs

## 🎯 Interactive States

### Buttons
```css
Default: bg-white border-gray-200
Hover: hover:bg-gray-50
Active: active:bg-gray-100
Disabled: opacity-50 cursor-not-allowed
```

### Inputs
```css
Default: border-gray-200
Focus: ring-2 ring-primary
Error: border-red-500
Disabled: bg-gray-100
```

### Table Rows
```css
Default: bg-white
Hover: hover:bg-gray-50
Selected: bg-blue-50
```

## 📊 Data Visualization

### Stats Cards Layout
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│  📋 Total   │  🟠 Open    │  🟣 Review  │  🟡 Await   │
│    15       │     5       │     3       │     2       │
└─────────────┴─────────────┴─────────────┴─────────────┘
┌─────────────┬─────────────┬─────────────┐
│ ✅ Resolved │ ❌ Rejected │  📦 Closed  │
│     3       │     1       │     1       │
└─────────────┴─────────────┴─────────────┘
```

### Table Structure
```
┌────┬──────────┬──────────┬─────────┬──────────┬─────────┬────────┬──────────┬─────────┬──────────┬─────────┐
│ ID │ Category │   Sub    │ Booking │ Raised   │ Against │ Status │ Priority │ Created │ Updated  │ Actions │
├────┼──────────┼──────────┼─────────┼──────────┼─────────┼────────┼──────────┼─────────┼──────────┼─────────┤
│001 │ Service  │ Poor...  │ BK-001  │ John D.  │ Mike W. │ [Open] │ [High]   │ Jan 22  │ Jan 22   │   ⋮    │
│002 │ Payment  │ Over...  │ BK-002  │ Sarah A. │ James B.│[Review]│ [Medium] │ Jan 22  │ Jan 23   │   ⋮    │
│003 │ Conduct  │ Rude...  │ BK-003  │ Robert K.│ David L.│[Resolv]│ [High]   │ Jan 23  │ Jan 23   │   ⋮    │
└────┴──────────┴──────────┴─────────┴──────────┴─────────┴────────┴──────────┴─────────┴──────────┴─────────┘
```

### Detail Drawer Tabs
```
┌───────────────────────────────────────┐
│  [Overview] [Parties] [Booking] [Admin] │
├───────────────────────────────────────┤
│  📋 Category: Service Quality         │
│  🔖 Sub: Poor service quality         │
│  📝 Subject: Incomplete electrical... │
│                                       │
│  Description:                         │
│  The electrician left the job...      │
│                                       │
│  📎 Attachments: [img] [img]          │
└───────────────────────────────────────┘
```

## 🔍 Search & Filter UI

### Filter Panel Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  [Search: ID, booking, user...]  [Status ▼]  [Category ▼]          │
│  [Sub-Category ▼]  [Priority ▼]  [Raised By ▼]                     │
│  [From: 📅]  [To: 📅]  [❌ Clear Filters]                          │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎨 Accessibility Features

### ARIA Labels
- Buttons have descriptive labels
- Form inputs have associated labels
- Tables have proper headers
- Dialogs have titles and descriptions

### Keyboard Navigation
- Tab through all interactive elements
- Enter to submit forms
- Escape to close dialogs
- Arrow keys in dropdowns

### Screen Reader Support
- Semantic HTML elements
- Hidden text for icon-only buttons
- Status announcements for actions
- Error messages linked to inputs

---

**Design System**: Tailwind CSS + shadcn/ui
**Icon Library**: Lucide React
**Font**: System font stack
**Color Palette**: Tailwind default + custom status colors
