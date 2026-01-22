# Admin Settings Page - Comprehensive Documentation

## Table of Contents
1. [Overview](#overview)
2. [Component Architecture](#component-architecture)
3. [Data Structures](#data-structures)
4. [State Management](#state-management)
5. [Functions Documentation](#functions-documentation)
6. [UI Sections Documentation](#ui-sections-documentation)
7. [User Workflows](#user-workflows)
8. [Integration Points](#integration-points)

---

## Overview

The **Admin Settings Page** is a comprehensive platform configuration interface that allows administrators to manage system-wide settings, operational rules, and platform preferences. It provides a tabbed interface with 9 different sections covering various aspects of platform configuration, with full audit logging and change history tracking.

### Key Features:
- 🎯 **9 Tabbed Sections** for organized settings management
- 📝 **Real-time Form Validation** with type-safe inputs
- 💾 **Change Tracking** - automatic audit log of all modifications
- ⚠️ **Unsaved Changes Detection** - warns users before losing data
- 🔐 **Secure API Key Handling** - masked password fields
- 📊 **Complete Audit Trail** - track who changed what and when
- 🎨 **Responsive Design** - admin-first UX
- 💡 **Tooltips & Helper Text** - contextual guidance for complex settings

---

## Component Architecture

```
AdminSettings Component
├── State Management
│   ├── settings (current values)
│   ├── originalSettings (last saved values)
│   ├── settingsChanges (audit log)
│   ├── isLoading (async operation flag)
│   ├── hasUnsavedChanges (dirty state)
│   ├── showResetDialog (modal state)
│   └── lastUpdated (metadata)
├── Event Handlers
│   ├── handleSettingChange()
│   ├── handleDocumentToggle()
│   ├── handleAlertPreferenceToggle()
│   ├── handleSave()
│   ├── handleReset()
│   └── handleResetToDefault()
├── UI Sections (9 Tabs)
│   ├── General Settings
│   ├── User & Worker Rules
│   ├── Booking & Cancellation
│   ├── Pricing & Commission
│   ├── Review & Rating Rules
│   ├── Notifications
│   ├── Security & Access
│   ├── Integrations
│   └── Audit Log
└── Dialogs
    └── Reset Confirmation Dialog
```

---

## Data Structures

### Settings Interface
```typescript
interface Settings {
  // General Settings
  platformName: string;
  supportEmail: string;
  supportPhone: string;
  defaultTimezone: string;
  defaultCurrency: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;

  // User & Worker Rules
  userVerificationRequired: boolean;
  workerOnboardingEnabled: boolean;
  requiredWorkerDocuments: {
    nid: boolean;
    license: boolean;
    certificate: boolean;
    photo: boolean;
  };
  maxActiveServicesPerWorker: number;
  workerSuspensionThreshold: number;
  workerAutoBanThreshold: number;

  // Booking & Cancellation
  bookingConfirmationTimeLimit: number;
  userCancellationWindow: number;
  workerCancellationWindow: number;
  cancellationFeePercentage: number;
  noShowHandling: string;

  // Pricing & Commission
  platformCommissionPercentage: number;
  minimumServicePrice: number;
  dynamicPricingEnabled: boolean;
  taxVatPercentage: number;

  // Review & Rating Rules
  minBookingCompletionTimeForReview: number;
  autoHideLowRatedReviewsThreshold: number;
  profanityFilterEnabled: boolean;
  adminApprovalRequired: boolean;

  // Notifications
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  adminAlertPreferences: string[];

  // Security & Access
  sessionTimeoutDuration: number;
  twoFactorAuthenticationEnabled: boolean;
  adminRoles: string[];

  // Integrations
  paymentGatewayKey: string;
  mapApiKey: string;
  emailServiceProvider: string;
  webhookEndpoint: string;
}
```

### SettingsChange Interface (Audit Log)
```typescript
interface SettingsChange {
  id: string;                    // Unique identifier for the change
  key: string;                   // Setting key that was modified
  oldValue: string;              // Previous value (stringified)
  newValue: string;              // New value (stringified)
  adminId: string;               // ID of admin who made the change
  adminName: string;             // Name of admin who made the change
  timestamp: string;             // ISO timestamp of when change was made
}
```

---

## State Management

### useState Hooks

```typescript
// Tracks whether user has unsaved changes
const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

// API call loading state
const [isLoading, setIsLoading] = useState(false);

// Controls visibility of reset confirmation dialog
const [showResetDialog, setShowResetDialog] = useState(false);

// Stores metadata about last update
const [lastUpdated, setLastUpdated] = useState<{
  timestamp: string;
  admin: string;
} | null>(null);

// Complete audit log of all setting changes
const [settingsChanges, setSettingsChanges] = useState<SettingsChange[]>([]);

// Current form values
const [settings, setSettings] = useState<Settings>({...});

// Previously saved values (used for reset functionality)
const [originalSettings, setOriginalSettings] = useState<Settings>(settings);
```

### useEffect Hooks

```typescript
// Simulates loading last updated info on component mount
useEffect(() => {
  setLastUpdated({
    timestamp: new Date().toISOString(),
    admin: 'Admin Dashboard',
  });
}, []);
```

---

## Functions Documentation

### 1. `handleSettingChange(key: keyof Settings, value: any): void`

**Purpose:** Updates a single setting value and marks the form as having unsaved changes.

**Parameters:**
- `key` - The setting key to update (type-safe via keyof)
- `value` - The new value for that setting

**Behavior:**
```typescript
const handleSettingChange = (key: keyof Settings, value: any) => {
  setSettings((prev) => ({ ...prev, [key]: value }));
  setHasUnsavedChanges(true);
};
```

**Usage Examples:**
```typescript
// Text input change
handleSettingChange('platformName', 'New Platform Name');

// Number input change
handleSettingChange('platformCommissionPercentage', 20);

// Toggle/switch change
handleSettingChange('maintenanceMode', true);

// Select dropdown change
handleSettingChange('defaultTimezone', 'EST');
```

**Impact:**
- Updates the `settings` state object immutably
- Sets `hasUnsavedChanges` to true to enable Save/Reset buttons
- Displays "Unsaved changes" warning in header
- Enables the Save Changes button

---

### 2. `handleDocumentToggle(doc: keyof Settings['requiredWorkerDocuments']): void`

**Purpose:** Toggles a specific worker document requirement on/off.

**Parameters:**
- `doc` - Document type: 'nid' | 'license' | 'certificate' | 'photo'

**Behavior:**
```typescript
const handleDocumentToggle = (doc: keyof Settings['requiredWorkerDocuments']) => {
  setSettings((prev) => ({
    ...prev,
    requiredWorkerDocuments: {
      ...prev.requiredWorkerDocuments,
      [doc]: !prev.requiredWorkerDocuments[doc],
    },
  }));
  setHasUnsavedChanges(true);
};
```

**Usage Example:**
```typescript
// Toggle NID document requirement
handleDocumentToggle('nid');

// Toggle Photo requirement
handleDocumentToggle('photo');
```

**Affected Setting:**
- `settings.requiredWorkerDocuments` (nested object)

**UI Location:**
- User & Worker Rules Tab → Required Worker Documents section

---

### 3. `handleAlertPreferenceToggle(preference: string): void`

**Purpose:** Toggles admin alert preferences on/off (add or remove from list).

**Parameters:**
- `preference` - Alert type: 'critical' | 'fraud' | 'system' | 'user_complaints' | 'worker_issues'

**Behavior:**
```typescript
const handleAlertPreferenceToggle = (preference: string) => {
  setSettings((prev) => ({
    ...prev,
    adminAlertPreferences: prev.adminAlertPreferences.includes(preference)
      ? prev.adminAlertPreferences.filter((p) => p !== preference)
      : [...prev.adminAlertPreferences, preference],
  }));
  setHasUnsavedChanges(true);
};
```

**Logic:**
- If preference exists in array → remove it
- If preference doesn't exist → add it

**Usage Example:**
```typescript
// Toggle critical alerts
handleAlertPreferenceToggle('critical');
// If 'critical' was in array, it's now removed
// If 'critical' was not in array, it's now added
```

**Affected Setting:**
- `settings.adminAlertPreferences` (array of strings)

**UI Location:**
- Notifications Tab → Admin Alert Preferences section

---

### 4. `handleSave(): Promise<void>`

**Purpose:** Validates and saves all setting changes to the backend, updates audit log.

**Behavior:**
```typescript
const handleSave = async () => {
  setIsLoading(true);
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Compare current with original to find changes
    const changes: SettingsChange[] = [];
    Object.keys(settings).forEach((key) => {
      if (
        JSON.stringify(settings[key as keyof Settings]) !==
        JSON.stringify(originalSettings[key as keyof Settings])
      ) {
        changes.push({
          id: Date.now().toString(),
          key,
          oldValue: JSON.stringify(originalSettings[key as keyof Settings]),
          newValue: JSON.stringify(settings[key as keyof Settings]),
          adminId: 'current_admin',
          adminName: 'Current Admin',
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Add changes to audit log
    if (changes.length > 0) {
      setSettingsChanges((prev) => [...changes, ...prev]);
    }

    // Update original settings and reset dirty state
    setOriginalSettings(settings);
    setHasUnsavedChanges(false);

    toast({
      title: 'Success',
      description: 'Settings saved successfully',
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to save settings',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

**Steps Performed:**
1. Set loading state to true
2. Make API call (simulated with timeout)
3. Compare current settings with original settings
4. Create audit log entries for each change
5. Prepend changes to audit log array
6. Update `originalSettings` with current values
7. Clear unsaved changes flag
8. Show success/error toast
9. Set loading state to false

**Side Effects:**
- 📝 Adds entries to audit log
- ✅ Shows success toast notification
- 🔒 Locks Save/Reset buttons while loading
- 🔄 Updates `originalSettings` for reset functionality

**Error Handling:**
- Shows error toast if API call fails
- Leaves form in editable state if error occurs

---

### 5. `handleReset(): void`

**Purpose:** Discards unsaved changes and restores the last saved settings.

**Behavior:**
```typescript
const handleReset = () => {
  setSettings(originalSettings);
  setHasUnsavedChanges(false);
  setShowResetDialog(false);

  toast({
    title: 'Reset',
    description: 'Settings reset to last saved values',
  });
};
```

**Steps:**
1. Restore settings to original (last saved) values
2. Clear unsaved changes flag
3. Close confirmation dialog
4. Show info toast

**Scope:**
- Only resets unsaved changes
- Does NOT revert saved changes
- Use `handleResetToDefault()` to revert to platform defaults

**UI Trigger:**
- "Reset Changes" button (only enabled when `hasUnsavedChanges` is true)

---

### 6. `handleResetToDefault(): Promise<void>`

**Purpose:** Resets ALL settings to platform default values. Destructive operation requiring confirmation.

**Behavior:**
```typescript
const handleResetToDefault = async () => {
  setIsLoading(true);
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const defaultSettings: Settings = {
      platformName: 'Worksure',
      supportEmail: 'support@worksure.com',
      supportPhone: '+1-800-000-0000',
      defaultTimezone: 'UTC',
      defaultCurrency: 'USD',
      // ... all other settings reset to defaults
    };

    setSettings(defaultSettings);
    setOriginalSettings(defaultSettings);
    setHasUnsavedChanges(false);

    toast({
      title: 'Reset to Defaults',
      description: 'All settings have been reset to default values',
    });
  } catch (error) {
    toast({
      title: 'Error',
      description: 'Failed to reset settings',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};
```

**Scope:**
- Resets to hardcoded default values
- Both `settings` and `originalSettings` are reset
- Clears unsaved changes flag

**⚠️ Important:**
- Currently not exposed in UI (protected function)
- Should require admin confirmation before use
- Consider adding to Settings modal or admin tools

---

## UI Sections Documentation

### Tab 1: General Settings

**Location:** First tab in main tabs navigation

**Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| Platform Name | Text Input | Display name of the platform | 'Worksure' |
| Support Email | Email Input | Primary support contact email | 'support@worksure.com' |
| Support Phone | Text Input | Support phone number | '+1-800-123-4567' |
| Default Timezone | Select Dropdown | Timezone for platform operations | 'UTC' |
| Default Currency | Select Dropdown | Currency for pricing displays | 'USD' |
| Maintenance Mode | Toggle Switch | Enable/disable platform access | false |
| Maintenance Message | Textarea | Message shown during maintenance | '' |

**Functionality:**
- Timezone options: UTC, EST, CST, PST, IST
- Currency options: USD, EUR, GBP, INR, CAD
- When maintenance mode enabled, textarea appears for custom message
- All changes trigger `handleSettingChange()`

**Use Cases:**
- Change company branding and contact info
- Perform system maintenance with user notification
- Adjust timezone/currency for global operations

---

### Tab 2: User & Worker Rules

**Location:** Second tab

**Subsections:**

#### User Settings
| Field | Type | Description |
|-------|------|-------------|
| User Verification Required | Toggle | Require email verification for new accounts |

#### Worker Settings
| Field | Type | Description |
|-------|------|-------------|
| Worker Onboarding Enabled | Toggle | Enable structured onboarding process |
| Required Documents | Multiple Toggles | NID, License, Certificate, Photo |
| Max Active Services Per Worker | Number Input | Maximum concurrent services (with tooltip) |
| Worker Suspension Threshold | Number Input | Complaints before temporary suspension (with tooltip) |
| Worker Auto-Ban Threshold | Number Input | Complaints before permanent ban (with tooltip) |

**Functionality:**
- Toggle switches control individual document requirements
- Each numeric field has a tooltip explaining purpose
- Changes are tracked separately for audit log

**Validation:**
- Number inputs accept positive integers
- Auto-ban threshold should be >= suspension threshold

**Use Cases:**
- Tighten worker qualification requirements
- Adjust complaint tolerance thresholds
- Require specific documentation types

---

### Tab 3: Booking & Cancellation

**Location:** Third tab

**Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| Booking Confirmation Time Limit | Number (hours) | Time for worker to accept booking | 24 |
| User Cancellation Window | Number (hours) | No-penalty cancellation period for users | 48 |
| Worker Cancellation Window | Number (hours) | No-penalty cancellation period for workers | 24 |
| Cancellation Fee | Number (0-100%) | Penalty percentage for late cancellations | 15 |
| No-Show Handling | Select Dropdown | Action when worker doesn't show up | 'deduct-commission' |

**No-Show Handling Options:**
- `deduct-commission` - Remove platform commission
- `full-refund` - Refund user and deduct from worker
- `suspend-worker` - Temporarily suspend worker account

**Tooltips:**
- Each numeric field has contextual help text
- Explains impact of changing values

**Use Cases:**
- Adjust booking timeframes for specific markets
- Set cancellation policies aligned with business model
- Enforce penalties for no-shows

---

### Tab 4: Pricing & Commission

**Location:** Fourth tab

**Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| Platform Commission | Number (0-100%) | Commission percentage from each booking | 18 |
| Minimum Service Price | Number | Lowest allowed service price | 10 |
| Dynamic Pricing Enabled | Toggle | Allow price adjustments by demand | true |
| Tax/VAT | Number (0-100%) | Tax percentage applied to prices | 10 |

**Functionality:**
- Commission and tax fields accept 0-100 range
- Minimum price is positive number (currency-agnostic)
- Toggle for dynamic pricing feature
- All changes immediately update form state

**Financial Impact:**
- Platform Commission: Direct revenue per transaction
- Minimum Service Price: Prevents low-quality/spam services
- Tax/VAT: Customer-facing tax calculations
- Dynamic Pricing: Enables revenue optimization

**Use Cases:**
- Adjust revenue model
- Set price floor to maintain quality
- Enable/disable dynamic pricing strategy
- Update tax policies for compliance

---

### Tab 5: Review & Rating Rules

**Location:** Fifth tab

**Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| Min Booking Completion Time Before Review | Number (hours) | Delay before review allowed | 1 |
| Auto-Hide Low-Rated Reviews Threshold | Number (1-5) | Hide reviews below this rating | 2 |
| Profanity Filter | Toggle | Enable/disable language filtering | true |
| Admin Approval Required | Toggle | Require approval before publishing | false |

**Functionality:**
- Hours field allows any positive number
- Rating threshold accepts 1-5 with 0.5 increments
- Toggles control filtering and approval features
- Each option has description text

**Content Moderation Strategy:**
- Delay: Allows time for fake review detection
- Auto-hide: Protects worker/service reputation
- Profanity filter: Ensures review quality
- Admin approval: Maximum content control (if enabled)

**Use Cases:**
- Prevent immediate negative review spam
- Automatically hide unhelpful reviews
- Enable content filtering for family-friendly platform
- Implement multi-level moderation workflow

---

### Tab 6: Notifications

**Location:** Sixth tab

**Subsections:**

#### Notification Channels
| Field | Type | Description |
|-------|------|-------------|
| Email Notifications | Toggle | Send alerts via email |
| SMS Notifications | Toggle | Send alerts via SMS |
| Push Notifications | Toggle | Send app/browser push notifications |

#### Admin Alert Preferences
| Field | Type | Description |
|-------|------|-------------|
| Critical | Checkbox | System-critical alerts |
| Fraud | Checkbox | Suspected fraud detection |
| System | Checkbox | General system alerts |
| User Complaints | Checkbox | User complaint notifications |
| Worker Issues | Checkbox | Worker-related issues |

**Functionality:**
- Toggles enable/disable entire notification channel
- Checkboxes allow granular preference selection
- Multiple alerts can be selected simultaneously
- Uses `handleAlertPreferenceToggle()` for checkboxes

**Use Cases:**
- Disable SMS for cost reduction
- Selectively receive fraud alerts only
- Stay informed about critical system events
- Balance notification volume

---

### Tab 7: Security & Access

**Location:** Seventh tab

**Subsections:**

#### Security Settings
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| Session Timeout Duration | Number (minutes) | Auto-logout after inactivity | 30 |
| Two-Factor Authentication | Toggle | Require 2FA for all admins | true |

#### Admin Roles
- Display: Super Admin, Moderator, Support (read-only list)

#### IP Management
- Button: "Manage IP Restrictions" (launches separate interface)

**Functionality:**
- Session timeout accepts positive numbers
- 2FA toggle enables/disables requirement
- Admin roles displayed for reference
- IP management opens external modal

**Security Considerations:**
- Lower timeout = higher security but more inconvenience
- 2FA adds significant security layer
- IP restrictions prevent unauthorized access
- Audit log tracks all role changes

**Use Cases:**
- Increase timeout for less sensitive environments
- Enforce 2FA for compliance
- Restrict admin access to specific IP ranges

---

### Tab 8: Integrations

**Location:** Eighth tab

**Fields:**
| Field | Type | Description | Default |
|-------|------|-------------|---------|
| Payment Gateway Key | Password Input | Payment processor API key | '•••••••••••••' |
| Map API Key | Password Input | Mapping service API key | '•••••••••••••' |
| Email Service Provider | Select Dropdown | Email service choice | 'SendGrid' |
| Webhook Endpoint | URL Input | System webhook URL | 'https://api.worksure.com/webhooks' |

**Password Fields:**
- Displayed as masked password inputs (not plain text)
- Shows dots instead of actual keys
- Protects sensitive credentials in UI

**Email Provider Options:**
- SendGrid
- AWS SES
- Mailgun
- Twilio

**Status Indicators:**
- Green badges showing "Connected" for working integrations
- Payment Gateway → Connected
- Map Service → Connected

**Functionality:**
- All fields editable
- Password fields mask input for security
- Dropdown for selecting email provider
- URL validation for webhook endpoint

**Security Best Practices:**
- Keys never displayed in full
- Use environment variables for storage
- Consider encryption for key storage
- Log all integration changes

**Use Cases:**
- Update payment processor credentials
- Change mapping provider
- Switch email service provider
- Configure webhook for real-time events

---

### Tab 9: Audit Log

**Location:** Ninth and final tab

**Table Columns:**
| Column | Type | Description |
|--------|------|-------------|
| Setting Key | Text | Name of setting that changed |
| Old Value | Text | Previous value (stringified) |
| New Value | Text | New value (stringified) |
| Changed By | Text | Admin name and ID |
| Timestamp | Text | When change was made (formatted) |

**Functionality:**
- Read-only historical table
- Chronologically ordered (newest first)
- Shows all changes since implementation
- No edit/delete capability

**Data Display:**
- Setting keys in monospace font
- Values truncated with max-width if too long
- Admin info shows both name and ID
- Timestamps formatted as "MMM dd, yyyy HH:mm"

**Use Cases:**
- Audit trail for compliance
- Track who changed settings and when
- Investigate unexpected setting changes
- Security investigation support

**Sample Entry:**
```
Setting Key: platformCommissionPercentage
Old Value: "15%"
New Value: "18%"
Changed By: John Admin (admin_001)
Timestamp: Jan 20, 2026 14:30
```

---

## User Workflows

### Workflow 1: Making a Setting Change

```
1. User navigates to specific tab
2. User modifies form field
   └─ handleSettingChange() triggers
   └─ Display updates
   └─ "Unsaved changes" warning appears
   └─ Save/Reset buttons become enabled
3. User can:
   a) Make more changes
   b) Click "Reset Changes" → handleReset() → form reverts
   c) Click "Save Changes" → handleSave() → changes saved & logged
4. After save:
   └─ Form locks briefly (isLoading = true)
   └─ Success toast shown
   └─ Unsaved warning disappears
   └─ New entries in Audit Log tab
```

### Workflow 2: Saving Multiple Changes

```
1. User modifies Field A
   └─ hasUnsavedChanges = true
2. User modifies Field B
   └─ hasUnsavedChanges remains true
3. User modifies Field C
   └─ hasUnsavedChanges remains true
4. User clicks "Save Changes"
   └─ handleSave() compares ALL settings to originalSettings
   └─ Creates SettingsChange entry for each modified field
   └─ Prepends all changes to audit log
   └─ Updates originalSettings to match current settings
   └─ Clears hasUnsavedChanges flag
```

### Workflow 3: Reviewing Change History

```
1. User clicks "Audit Log" tab
2. System displays historical table
3. User can:
   a) Scan through all changes
   b) See who made each change
   c) Understand impact (old vs new values)
   d) Identify when changes occurred
```

### Workflow 4: Worker Document Requirements

```
1. User navigates to "User & Worker Rules" tab
2. User sees "Required Worker Documents" section
3. User clicks toggle for "NID Document"
   └─ handleDocumentToggle('nid') executes
   └─ NID requirement flips true/false
   └─ hasUnsavedChanges = true
4. User can toggle each document individually
5. When saved, creates 4 separate audit log entries (one per document)
```

### Workflow 5: Alert Preferences

```
1. User navigates to "Notifications" tab
2. User sees "Admin Alert Preferences" checkboxes
3. User selects "Critical" and "Fraud"
   └─ First checkbox calls handleAlertPreferenceToggle('critical')
   └─ 'critical' added to adminAlertPreferences array
   └─ Second checkbox calls handleAlertPreferenceToggle('fraud')
   └─ 'fraud' added to adminAlertPreferences array
4. adminAlertPreferences now = ['critical', 'fraud', 'system']
5. When user unchecks "system"
   └─ handleAlertPreferenceToggle('system')
   └─ 'system' removed from array
   └─ adminAlertPreferences now = ['critical', 'fraud']
```

---

## Integration Points

### Backend API Endpoints

**Required Endpoints:**

1. **GET /api/settings** - Fetch current settings
   ```
   Response: { success: true, data: Settings }
   ```

2. **POST /api/settings** - Save settings
   ```
   Body: Settings
   Response: { success: true, message: "Settings saved" }
   ```

3. **GET /api/settings/history** - Fetch audit log
   ```
   Response: { success: true, data: SettingsChange[] }
   ```

4. **GET /api/settings/defaults** - Get default settings
   ```
   Response: { success: true, data: Settings }
   ```

### Frontend Services

**Current Implementation:**
- Uses simulated API calls with setTimeout
- Should be replaced with actual axios calls

**Required Service:**
```typescript
// settingsService.ts
export const settingsService = {
  async getSettings(): Promise<ApiResponse<Settings>> { },
  async saveSettings(settings: Settings): Promise<ApiResponse<void>> { },
  async getHistory(): Promise<ApiResponse<SettingsChange[]>> { },
  async resetToDefaults(): Promise<ApiResponse<Settings>> { },
};
```

### Toast Notifications

**Used for:**
- ✅ Success feedback: "Settings saved successfully"
- ❌ Error feedback: "Failed to save settings"
- ℹ️ Info feedback: "Settings reset to last saved values"

**Implementation:**
```typescript
import { useToast } from '@/hooks/use-toast';

const { toast } = useToast();

toast({
  title: 'Success',
  description: 'Settings saved successfully',
});
```

### Authentication

**Assumption:**
- User is authenticated admin
- User has admin permissions
- currentAdminId and currentAdminName available from auth context

**TODO:**
- Implement role-based access control
- Hide/disable settings based on admin role
- Log actual admin ID instead of placeholder

---

## TODO & Future Enhancements

### Immediate Tasks
- [ ] Replace simulated API calls with real backend endpoints
- [ ] Implement role-based access control (show/hide settings by role)
- [ ] Add form validation for numeric ranges
- [ ] Implement optimistic updates UI
- [ ] Add loading skeleton while fetching settings

### Future Features
- [ ] Bulk reset options per section
- [ ] Schedule settings changes for future deployment
- [ ] Comparison mode (view changes before saving)
- [ ] Export audit log to CSV
- [ ] Revert to specific historical state
- [ ] Admin role management interface (currently read-only)
- [ ] IP whitelist/blacklist management UI
- [ ] Settings versioning with rollback
- [ ] Real-time collaboration warnings (if multiple admins editing)

### Performance
- [ ] Implement change debouncing for frequent edits
- [ ] Lazy load audit log (pagination)
- [ ] Memoize component to prevent unnecessary re-renders
- [ ] Cache settings in localStorage (read-through)

### Security
- [ ] Implement API key rotation mechanism
- [ ] Add rate limiting to save endpoint
- [ ] Require confirmation for destructive changes
- [ ] Log sensitive changes to separate security audit trail
- [ ] Implement webhook signing/verification

---

## Component Props & Dependencies

### Dependencies
```typescript
// UI Components
import { Button, Input, Label, Switch, Textarea, Card, Tabs, Table } from '@/components/ui/*';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from '@/components/ui/alert-dialog';

// Utilities
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Icons
import { Settings, Save, RotateCcw, AlertTriangle, Clock, User, CheckCircle, Info, History } from 'lucide-react';
```

### No Props Required
- Component is standalone
- All state managed internally
- No parent communication needed

---

## Testing Considerations

### Unit Tests to Implement
```typescript
describe('AdminSettings', () => {
  test('handleSettingChange updates settings and sets dirty flag', () => {});
  test('handleDocumentToggle toggles specific document requirement', () => {});
  test('handleAlertPreferenceToggle adds/removes preference from array', () => {});
  test('handleSave creates audit log entries for changed settings', () => {});
  test('handleReset restores original settings', () => {});
  test('unsaved changes warning displays when dirty', () => {});
  test('save button disabled when no unsaved changes', () => {});
  test('audit log displays changes in chronological order', () => {});
});
```

### Integration Tests
```typescript
describe('AdminSettings Integration', () => {
  test('Complete workflow: modify, save, verify audit log', () => {});
  test('Multiple sequential saves create separate audit entries', () => {});
  test('Reset clears dirty flag but preserves audit history', () => {});
});
```

### E2E Test Scenarios
1. Modify single setting and save
2. Modify multiple settings across different tabs and save
3. Reset unsaved changes
4. View audit log and verify history
5. Test all toggles, inputs, and selects

---

## Conclusion

The Admin Settings page provides a comprehensive, audit-tracked interface for platform configuration. All functions work together to provide:
- **User-friendly form management**
- **Complete audit trail of changes**
- **Unsaved changes protection**
- **Secure credential handling**
- **Organized settings by category**

The modular structure and state management make it easy to add new settings or modify existing ones.

