# Unit Test Documentation — Worksure (Frontend)

**Project:** Worksure — Home Service Booking Platform  
**Module:** Frontend (React + TypeScript)  
**Testing Framework:** Vitest v4.0.18 + React Testing Library  
**Environment:** jsdom  
**Date:** February 19, 2026  
**Total Test Files:** 10  
**Total Test Cases:** 99  
**Overall Result:** ✅ ALL PASSED  
**Execution Time:** 7.79s  

---

## Summary

| # | Test File | Category | Tests | Status | Duration |
|---|-----------|----------|-------|--------|----------|
| 1 | `utils.test.ts` | Utility Function | 7 | ✅ Passed | 15ms |
| 2 | `cart.test.tsx` | Hook & Context | 10 | ✅ Passed | 142ms |
| 3 | `Footer.test.tsx` | Component | 7 | ✅ Passed | 337ms |
| 4 | `ServiceCard.test.tsx` | Component | 7 | ✅ Passed | 776ms |
| 5 | `LoginDialog.test.tsx` | Component | 10 | ✅ Passed | 4563ms |
| 6 | `toast-reducer.test.ts` | State Management | 7 | ✅ Passed | 10ms |
| 7 | `bookingData.test.ts` | Data & Business Logic | 15 | ✅ Passed | 17ms |
| 8 | `electricianServices.test.ts` | Data Integrity | 10 | ✅ Passed | 21ms |
| 9 | `HowItWorks.test.tsx` | Component | 7 | ✅ Passed | 379ms |
| 10 | `registerValidation.test.ts` | Validation Logic | 19 | ✅ Passed | 56ms |

---

## 1. Utility Function Tests — `cn()` (`utils.test.ts`)

**File Under Test:** `src/lib/utils.ts`  
**Purpose:** Tests the `cn()` utility that merges and deduplicates Tailwind CSS class names.

| Test ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|---------|----------------------|-------|-----------------|---------------|--------|
| TC-U01 | Should merge class names correctly | `"bg-red-500", "text-white"` | `"bg-red-500 text-white"` | `"bg-red-500 text-white"` | ✅ Pass |
| TC-U02 | Should handle conflicting Tailwind classes (last wins) | `"bg-red-500", "bg-blue-500"` | `"bg-blue-500"` | `"bg-blue-500"` | ✅ Pass |
| TC-U03 | Should handle conditional classes | `"base-class", true && "active-class"` | `"base-class active-class"` | `"base-class active-class"` | ✅ Pass |
| TC-U04 | Should ignore falsy values | `"base-class", false, null, undefined, "real-class"` | `"base-class real-class"` | `"base-class real-class"` | ✅ Pass |
| TC-U05 | Should return empty string for no arguments | (none) | `""` | `""` | ✅ Pass |
| TC-U06 | Should handle object syntax | `{ "bg-red-500": true, "text-white": false }` | `"bg-red-500"` | `"bg-red-500"` | ✅ Pass |
| TC-U07 | Should handle array syntax | `["bg-red-500", "text-white"]` | `"bg-red-500 text-white"` | `"bg-red-500 text-white"` | ✅ Pass |

---

## 2. Cart Hook & Context Tests (`cart.test.tsx`)

**File Under Test:** `src/hooks/useCart.ts` & `src/context/CartContext.tsx`  
**Purpose:** Tests cart operations — add, remove, update quantity, clear, and computed values (totalItems, totalPrice).

| Test ID | Test Case Description | Input / Action | Expected Output | Actual Output | Status |
|---------|----------------------|----------------|-----------------|---------------|--------|
| TC-C01 | Should start with an empty cart | Initial render | cart = [], totalItems = 0, totalPrice = 0 | As expected | ✅ Pass |
| TC-C02 | Should add an item to the cart | Add "Wiring Repair" (₹500) | cart.length = 1, quantity = 1, totalPrice = 500 | As expected | ✅ Pass |
| TC-C03 | Should increase quantity when adding duplicate item | Add same item twice | cart.length = 1, quantity = 2, totalPrice = 1000 | As expected | ✅ Pass |
| TC-C04 | Should add multiple different items | Add 2 different items | cart.length = 2, totalItems = 2, totalPrice = 1500 | As expected | ✅ Pass |
| TC-C05 | Should remove an item from the cart | Add then remove item | cart.length = 0, totalItems = 0 | As expected | ✅ Pass |
| TC-C06 | Should update quantity of an item | Set quantity to 5 | quantity = 5, totalItems = 5, totalPrice = 2500 | As expected | ✅ Pass |
| TC-C07 | Should remove item when quantity is set to 0 | updateQuantity(id, 0) | cart.length = 0 | As expected | ✅ Pass |
| TC-C08 | Should clear the entire cart | clearCart() | cart = [], totalItems = 0, totalPrice = 0 | As expected | ✅ Pass |
| TC-C09 | Should throw error when useCart is used outside CartProvider | Render without provider | Throws "useCart must be used within a CartProvider" | Error thrown | ✅ Pass |
| TC-C10 | Should calculate totalPrice correctly with mixed quantities | 2 items, update first to qty 3 | totalPrice = 2500, totalItems = 4 | As expected | ✅ Pass |

---

## 3. Footer Component Tests (`Footer.test.tsx`)

**File Under Test:** `src/components/Footer.tsx`  
**Purpose:** Tests that the Footer renders all sections, links, and the newsletter form correctly.

| Test ID | Test Case Description | Expected Output | Actual Output | Status |
|---------|----------------------|-----------------|---------------|--------|
| TC-F01 | Should render the brand name 'WorkSure' | "WorkSure" visible | Rendered | ✅ Pass |
| TC-F02 | Should render company description | Description text visible | Rendered | ✅ Pass |
| TC-F03 | Should render Company section links | "Services", "About Us", "Our Team" visible | Rendered | ✅ Pass |
| TC-F04 | Should render Know More section links | "Our Story", "FAQs", "Get In Touch" visible | Rendered | ✅ Pass |
| TC-F05 | Should render Newsletter section with email input | Input + "Send" button visible | Rendered | ✅ Pass |
| TC-F06 | Should render copyright text | "© 2026 WorkSure. All Rights Reserved" | Rendered | ✅ Pass |
| TC-F07 | Should render the email input with correct type | `type="email"` | Attribute present | ✅ Pass |

---

## 4. ServiceCard Component Tests (`ServiceCard.test.tsx`)

**File Under Test:** `src/components/ServiceCard.tsx`  
**Purpose:** Tests rendering of service cards and authentication-based navigation behavior.

| Test ID | Test Case Description | Input / Action | Expected Output | Actual Output | Status |
|---------|----------------------|----------------|-----------------|---------------|--------|
| TC-S01 | Should render service card with title | title = "Electrician Service" | Title visible | Rendered | ✅ Pass |
| TC-S02 | Should render service card with description | description text | Description visible | Rendered | ✅ Pass |
| TC-S03 | Should render the image with correct alt text | alt = "Electrician working" | Image with alt text rendered | Rendered | ✅ Pass |
| TC-S04 | Should render 'Get Start' button | — | "Get Start" button visible | Rendered | ✅ Pass |
| TC-S05 | Should open login dialog when unauthenticated user clicks button | Click "Get Start" (not logged in) | `openLogin()` called | Called | ✅ Pass |
| TC-S06 | Should navigate to /profile when authenticated user clicks button | Click "Get Start" (logged in) | `navigate("/profile")` called | Called | ✅ Pass |
| TC-S07 | Should render with different props correctly | Different title/desc/alt | All rendered correctly | Rendered | ✅ Pass |

---

## 5. LoginDialog Component Tests (`LoginDialog.test.tsx`)

**File Under Test:** `src/components/LoginDialog.tsx`  
**Purpose:** Tests the login dialog — rendering, form validation, authentication flow, and error handling.

| Test ID | Test Case Description | Input / Action | Expected Output | Actual Output | Status |
|---------|----------------------|----------------|-----------------|---------------|--------|
| TC-L01 | Should render login dialog when open | open = true | Dialog visible with "Sign in" text | Rendered | ✅ Pass |
| TC-L02 | Should render email and password fields | open = true | Email & Password labels visible | Rendered | ✅ Pass |
| TC-L03 | Should show validation error for empty email | Submit with empty email | "Email is required." shown | Shown | ✅ Pass |
| TC-L04 | Should show validation error for invalid email format | Email = "invalid-email" | "Please enter a valid email." shown | Shown | ✅ Pass |
| TC-L05 | Should show validation error for empty password | Email valid, password empty | "Password is required." shown | Shown | ✅ Pass |
| TC-L06 | Should call login with correct credentials on valid submission | Email + password filled | `login("user@example.com", "password123")` called | Called | ✅ Pass |
| TC-L07 | Should navigate to home on successful login | Successful login | `navigate("/", { replace: true })` called | Called | ✅ Pass |
| TC-L08 | Should display error message on login failure | Login returns error | "Invalid credentials" shown | Shown | ✅ Pass |
| TC-L09 | Should not render when open is false | open = false | Dialog not in DOM | Not rendered | ✅ Pass |
| TC-L10 | Should clear errors when user types in fields | Trigger error, then type | Error message disappears | Cleared | ✅ Pass |

---

## 6. Toast Reducer Tests (`toast-reducer.test.ts`)

**File Under Test:** `src/hooks/use-toast.ts`  
**Purpose:** Tests the toast notification state reducer for add, update, dismiss, and remove actions.

| Test ID | Test Case Description | Input / Action | Expected Output | Actual Output | Status |
|---------|----------------------|----------------|-----------------|---------------|--------|
| TC-T01 | Should add a toast | ADD_TOAST action | toasts.length = 1, title = "Success" | As expected | ✅ Pass |
| TC-T02 | Should enforce toast limit of 1 | Add 2 toasts | toasts.length = 1, latest toast kept | As expected | ✅ Pass |
| TC-T03 | Should update an existing toast | UPDATE_TOAST with new title | title = "Updated Title", description unchanged | As expected | ✅ Pass |
| TC-T04 | Should dismiss a toast by id | DISMISS_TOAST with id | toast.open = false | As expected | ✅ Pass |
| TC-T05 | Should remove a toast by id | REMOVE_TOAST with id | toasts.length = 0 | As expected | ✅ Pass |
| TC-T06 | Should remove all toasts when no toastId provided | REMOVE_TOAST without id | toasts.length = 0 | As expected | ✅ Pass |
| TC-T07 | Should not modify state for non-existent toast update | UPDATE_TOAST with id "999" | Original toast unchanged | Unchanged | ✅ Pass |

---

## 7. Booking Data & Stats Tests (`bookingData.test.ts`)

**File Under Test:** `src/lib/mockBookingData.ts`  
**Purpose:** Tests booking data integrity and the `calculateBookingStats()` business logic function.

### Mock Booking Data

| Test ID | Test Case Description | Expected Output | Actual Output | Status |
|---------|----------------------|-----------------|---------------|--------|
| TC-B01 | Should have at least 10 bookings | length ≥ 10 | 10 | ✅ Pass |
| TC-B02 | Each booking should have a unique id | All ids unique | Unique | ✅ Pass |
| TC-B03 | Each booking should have required fields | id, serviceCategory, serviceName, status, totalAmount, scheduledDate defined | All defined | ✅ Pass |
| TC-B04 | Booking status should be one of the valid values | Status ∈ {pending, accepted, ongoing, ...} | Valid | ✅ Pass |
| TC-B05 | totalAmount should always be a positive number | > 0 | All positive | ✅ Pass |
| TC-B06 | Each booking should have a valid user object | user.name, email, phone defined | All defined | ✅ Pass |
| TC-B07 | Paid bookings should have a payment method | paymentMethod defined | Defined | ✅ Pass |
| TC-B08 | Each booking should have a statusHistory array | Array with length ≥ 1 | Valid arrays | ✅ Pass |

### calculateBookingStats()

| Test ID | Test Case Description | Expected Output | Actual Output | Status |
|---------|----------------------|-----------------|---------------|--------|
| TC-BS01 | Should return correct totalBookings count | Matches array length | Matched | ✅ Pass |
| TC-BS02 | Should calculate totalRevenue from paid bookings only | Sum of paid amounts | Correct sum | ✅ Pass |
| TC-BS03 | statusCounts should sum to totalBookings | Sum = totalBookings | Equal | ✅ Pass |
| TC-BS04 | Should have paymentStats for paid and unpaid | 2 entries | 2 entries | ✅ Pass |
| TC-BS05 | Paid + unpaid + refunded count should equal total bookings | Sum = total | Equal | ✅ Pass |
| TC-BS06 | Should return zero revenue for empty bookings array | totalRevenue = 0 | 0 | ✅ Pass |
| TC-BS07 | Pending bookings count should match filtered data | Matches manual filter | Matched | ✅ Pass |

---

## 8. Electrician Services Data Tests (`electricianServices.test.ts`)

**File Under Test:** `src/lib/electricianServices.ts`  
**Purpose:** Tests the structure and completeness of electrician service definitions.

| Test ID | Test Case Description | Expected Output | Actual Output | Status |
|---------|----------------------|-----------------|---------------|--------|
| TC-ES01 | Should have at least 3 service categories | length ≥ 3 | ≥ 3 | ✅ Pass |
| TC-ES02 | Each service should have required fields | slug, title, subtitle, description, startingPrice, duration defined | All defined | ✅ Pass |
| TC-ES03 | Slug should match the object key | service.slug === key | Matched | ✅ Pass |
| TC-ES04 | Each service should have non-empty included items | included.length > 0 | Non-empty | ✅ Pass |
| TC-ES05 | Each service should have non-empty notIncluded items | notIncluded.length > 0 | Non-empty | ✅ Pass |
| TC-ES06 | Each service should have FAQs with question and answer | faqs[].question & answer non-empty | Valid | ✅ Pass |
| TC-ES07 | Each service should have pricing factors | pricingFactors[].factor & description defined | Defined | ✅ Pass |
| TC-ES08 | 'electrical-repair' service should exist with correct title | title = "Electrical Repair" | Matched | ✅ Pass |
| TC-ES09 | Each service should have coveredAreas | coveredAreas.length > 0 | Non-empty | ✅ Pass |
| TC-ES10 | startingPrice should contain the currency symbol ৳ | Contains "৳" | Contains | ✅ Pass |

---

## 9. HowItWorks Component Tests (`HowItWorks.test.tsx`)

**File Under Test:** `src/components/HowItWorks.tsx`  
**Purpose:** Tests the "How It Works" section renders all 3 steps correctly.

| Test ID | Test Case Description | Expected Output | Actual Output | Status |
|---------|----------------------|-----------------|---------------|--------|
| TC-H01 | Should render the section heading | "How It Works" visible | Rendered | ✅ Pass |
| TC-H02 | Should render the section description | Description text visible | Rendered | ✅ Pass |
| TC-H03 | Should render step 1 — Choose a Service | Title + description visible | Rendered | ✅ Pass |
| TC-H04 | Should render step 2 — Book a Professional | Title + description visible | Rendered | ✅ Pass |
| TC-H05 | Should render step 3 — Relax — Job Done Right | Title + description visible | Rendered | ✅ Pass |
| TC-H06 | Should render all three step numbers | "01", "02", "03" visible | Rendered | ✅ Pass |
| TC-H07 | Should render exactly 3 step cards | 3 titles visible | Rendered | ✅ Pass |

---

## 10. Registration Validation Tests (`registerValidation.test.ts`)

**File Under Test:** `src/components/RegisterDialog.tsx` (validation logic)  
**Purpose:** Tests the multi-step registration form validation — Step 1 (email/password), Step 2 (OTP), Step 3 (profile).

### Step 1 — Email & Password Validation

| Test ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|---------|----------------------|-------|-----------------|---------------|--------|
| TC-R01 | Should pass with valid email, password, and confirm password | Valid data | No errors | {} | ✅ Pass |
| TC-R02 | Should fail when email is empty | email = "" | "Email is required." | Matched | ✅ Pass |
| TC-R03 | Should fail when email is invalid | email = "not-an-email" | "Please enter a valid email." | Matched | ✅ Pass |
| TC-R04 | Should fail when password is empty | password = "" | "Password is required." | Matched | ✅ Pass |
| TC-R05 | Should fail when password is less than 8 characters | password = "short" | "Password must be at least 8 characters." | Matched | ✅ Pass |
| TC-R06 | Should fail when passwords don't match | password ≠ confirmPassword | "Passwords do not match." | Matched | ✅ Pass |
| TC-R07 | Should fail when confirmPassword is empty | confirmPassword = "" | "Please confirm your password." | Matched | ✅ Pass |
| TC-R08 | Should return multiple errors for all empty fields | All empty | 3 errors returned | 3 errors | ✅ Pass |
| TC-R09 | Should trim whitespace from email before validation | email = "  user@example.com  " | No errors | {} | ✅ Pass |

### Step 2 — OTP Verification

| Test ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|---------|----------------------|-------|-----------------|---------------|--------|
| TC-R10 | Should pass with a valid 6-digit OTP | "123456" | No errors | {} | ✅ Pass |
| TC-R11 | Should fail when OTP is empty | "" | Error about 6-digit code | Matched | ✅ Pass |
| TC-R12 | Should fail when OTP is less than 6 digits | "12345" | "Code must be exactly 6 digits." | Matched | ✅ Pass |
| TC-R13 | Should fail when OTP is more than 6 digits | "1234567" | "Code must be exactly 6 digits." | Matched | ✅ Pass |
| TC-R14 | Should trim whitespace from OTP | "  123456  " | No errors | {} | ✅ Pass |

### Step 3 — Profile Completion

| Test ID | Test Case Description | Input | Expected Output | Actual Output | Status |
|---------|----------------------|-------|-----------------|---------------|--------|
| TC-R15 | Should pass with valid name, phone, and role | Valid data | No errors | {} | ✅ Pass |
| TC-R16 | Should fail when name is empty | name = "" | "Name is required." | Matched | ✅ Pass |
| TC-R17 | Should fail when phone is empty | phone = "" | "Phone is required." | Matched | ✅ Pass |
| TC-R18 | Should fail when role is not selected | role = "" | "Please select a role." | Matched | ✅ Pass |
| TC-R19 | Should return all errors when all fields empty | All empty | 3 errors returned | 3 errors | ✅ Pass |

---

## Test Execution Command

```bash
npm run test:run
```

## Test Result Screenshot (Terminal Output)

```
 RUN  v4.0.18 /home/nayeem/UIU/12th trimester/SE Lab/Worksure

 ✓ src/test/registerValidation.test.ts    (19 tests)  56ms
 ✓ src/test/electricianServices.test.ts   (10 tests)  58ms
 ✓ src/test/cart.test.tsx                 (10 tests)  142ms
 ✓ src/test/Footer.test.tsx              (7 tests)   337ms
 ✓ src/test/HowItWorks.test.tsx          (7 tests)   379ms
 ✓ src/test/ServiceCard.test.tsx         (7 tests)   776ms
 ✓ src/test/bookingData.test.ts          (15 tests)  17ms
 ✓ src/test/utils.test.ts               (7 tests)   15ms
 ✓ src/test/toast-reducer.test.ts        (7 tests)   10ms
 ✓ src/test/LoginDialog.test.tsx         (10 tests)  4563ms

 Test Files  10 passed (10)
      Tests  99 passed (99)
   Duration  7.79s
```

---

## Conclusion

All **99 unit test cases** across **10 test files** have **passed successfully**. The tests cover:

- **Utility functions** — class name merging
- **React hooks & context** — cart state management
- **UI components** — Footer, ServiceCard, LoginDialog, HowItWorks
- **State management** — toast notification reducer
- **Business logic** — booking stats calculation
- **Data integrity** — service data structure validation
- **Form validation** — registration multi-step form (email, OTP, profile)

No test failures were detected. The frontend application's core logic and components are functioning as expected.
