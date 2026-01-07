# Design Guidelines: Mobile GRN Application for SAP S/4HANA

## Architecture Decisions

### Authentication
**Auth Required** - The application explicitly requires user authentication with role-based access control.

**Implementation:**
- Primary: SAP IAS (Identity Authentication Service) integration
- Fallback: SSO via Active Directory
- Mock implementation: Simulate role-based authentication (Warehouse/Operations roles)
- Login screen must include:
  - Corporate logo placeholder at top
  - SSO button (primary action)
  - "Remember this device" checkbox
  - Security disclaimer text
  - Privacy policy & terms links
- Session persistence: Maintain auth token locally for quick re-entry
- Account screen:
  - User profile with role badge (Warehouse/Ops)
  - Logout with confirmation
  - App version and sync status

### Navigation
**Tab Navigation** - 3 tabs positioned with core action in center:

1. **Dashboard** (Left tab) - List of pending GRNs
2. **Create GR** (Center tab) - Primary action, visually distinct
3. **Profile** (Right tab) - User settings and notifications

**Navigation Stack:**
- Login → Dashboard (initial)
- Dashboard → GRN Detail (modal)
- Create GR → Attachment Upload (stack)
- Profile → Notification Settings (stack)

### Screen Specifications

#### 1. Login Screen
- **Purpose:** Secure authentication for warehouse users
- **Layout:**
  - Stack-only navigation (no tabs)
  - Centered content area with logo
  - SSO button at vertical center
  - Footer with security text
- **Safe Area:** Top inset: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

#### 2. Dashboard Screen
- **Purpose:** View and filter pending GRNs from SAP VIM
- **Layout:**
  - Transparent header with search bar in header
  - Left button: Filter icon, Right button: Sync icon
  - Root view: FlatList (scrollable)
  - Floating refresh indicator when syncing
- **Components:**
  - Search bar (PO number, invoice number)
  - Filter chips (Date, Vertical, Account, Geography)
  - GRN cards with status badges (Pending/Completed/Error)
  - Empty state when no pending GRNs
- **Safe Area:** Top: headerHeight + Spacing.xl, Bottom: tabBarHeight + Spacing.xl

#### 3. Create GR Screen
- **Purpose:** Submit goods receipt with validation
- **Layout:**
  - Default header with "Create GR" title
  - Left button: Cancel, Right button: Submit (disabled until valid)
  - Root view: ScrollView with KeyboardAvoidingView
  - Form fields grouped in cards
  - Submit button fixed at bottom (outside scroll area)
- **Components:**
  - PO Number input (with validation icon)
  - PO Line Item picker
  - GR Quantity input (numeric keypad)
  - Storage Location picker
  - Attachment upload button (camera icon)
  - Validation error messages inline
- **Safe Area:** Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl
- **Form submission:** Primary button below form with confirmation modal before posting

#### 4. GRN Detail Screen (Modal)
- **Purpose:** View full details of selected GRN
- **Layout:**
  - Native modal presentation
  - Custom header with close button (left)
  - ScrollView content
  - Action button at bottom if GR pending
- **Components:**
  - PO details card
  - Status timeline (Received → GR Pending → Posted)
  - Attachment thumbnails
  - Error messages if applicable
- **Safe Area:** Top: insets.top + Spacing.xl, Bottom: insets.bottom + Spacing.xl

#### 5. Attachment Upload Screen
- **Purpose:** Capture delivery challan and goods photos
- **Layout:**
  - Default header with "Attachments" title
  - Grid view of captured images
  - Floating action button for camera/file picker
- **Components:**
  - Image grid (2 columns)
  - Camera button (floating, bottom-right)
  - File type labels (Challan/Goods/Inspection)
  - Delete option on long-press
- **Safe Area:** Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl + 80 (for FAB clearance)

#### 6. Profile Screen
- **Purpose:** User settings, notifications, sync status
- **Layout:**
  - Default header with "Profile" title
  - ScrollView with grouped settings
  - No header buttons
- **Components:**
  - User info card (name, role, location)
  - Notification preferences
  - Sync status indicator
  - Offline mode toggle
  - Logout button (destructive)
- **Safe Area:** Top: Spacing.xl, Bottom: tabBarHeight + Spacing.xl

## Design System

### Color Palette
**Primary Theme:** Corporate Blue & White
- Primary Blue: #0070F3 (SAP-inspired, professional)
- Primary Blue Dark: #0051B8 (pressed state)
- Background: #F5F7FA (light gray, enterprise feel)
- Surface: #FFFFFF (cards, inputs)
- Text Primary: #1A1A1A
- Text Secondary: #6B7280
- Success: #10B981 (GR posted)
- Warning: #F59E0B (pending validation)
- Error: #EF4444 (quantity mismatch, blocked PO)
- Border: #E5E7EB

**Status Colors:**
- Pending: #F59E0B (amber)
- Completed: #10B981 (green)
- Error: #EF4444 (red)
- In Progress: #0070F3 (blue)

### Typography
- Heading 1: Bold, 24px, Text Primary
- Heading 2: Semibold, 20px, Text Primary
- Heading 3: Semibold, 16px, Text Primary
- Body: Regular, 16px, Text Primary (optimized for warehouse readability)
- Body Small: Regular, 14px, Text Secondary
- Caption: Regular, 12px, Text Secondary
- Button: Semibold, 16px
- Input: Regular, 16px

### Visual Design
- **Icons:** Use Feather icons from @expo/vector-icons for consistency
  - Dashboard: list, search, filter, refresh-cw
  - Create GR: plus-circle, camera, upload
  - Status: check-circle, alert-circle, x-circle
  - Navigation: home, plus, user
- **Cards:** Use subtle elevation with soft shadows
  - backgroundColor: Surface
  - borderRadius: 12px
  - No drop shadow for static cards
- **Buttons:**
  - Primary: Filled with Primary Blue, white text, 48px height for easy tapping
  - Secondary: Outlined with Primary Blue border, blue text
  - Destructive: Filled with Error color
  - Pressed state: Reduce opacity to 0.8
- **Floating Action Button (Camera):**
  - Size: 56x56px
  - backgroundColor: Primary Blue
  - Drop shadow (EXACT specifications):
    - shadowOffset: {width: 0, height: 2}
    - shadowOpacity: 0.10
    - shadowRadius: 2
  - Position: bottom-right, 16px from edges
- **Status Badges:**
  - Small pill shape (borderRadius: 12px)
  - Colored background with white text
  - Bold typography for clarity
- **Input Fields:**
  - Height: 48px minimum for touch accessibility
  - Border: 1px solid Border color
  - Focus state: Primary Blue border
  - Error state: Error color border with inline message
- **Touch Feedback:**
  - All touchable elements use activeOpacity: 0.7
  - Buttons show scale animation (0.98) on press

### Critical Assets
1. **Corporate Logo** (SVG)
   - Usage: Login screen, splash screen
   - Style: Simplified, professional wordmark
   
2. **Status Icons** (System)
   - check-circle (success)
   - alert-circle (warning)
   - x-circle (error)
   - clock (pending)
   
3. **Empty State Illustration** (SVG)
   - Usage: Dashboard when no pending GRNs
   - Style: Minimalist line art, warehouse theme
   
4. **Offline Indicator Icon** (System)
   - wifi-off icon with warning color

### Accessibility Requirements
- **Minimum touch target:** 44x44px for all interactive elements
- **Contrast ratio:** WCAG AA compliant (4.5:1 for text)
- **Large text:** 16px minimum for warehouse workers (may wear gloves, use in bright/dim conditions)
- **Error handling:**
  - Visual indicators (icons + color)
  - Toast notifications for success/error
  - Modal confirmation for destructive actions
- **Loading states:**
  - Skeleton screens for data fetching
  - Progress indicator during SAP sync
  - Disabled state for buttons during submission
- **Offline mode:**
  - Clear visual indicator when offline
  - Queue actions locally
  - Show sync status on reconnection

### Interaction Patterns
- **Pull-to-refresh:** Dashboard list refreshes from SAP
- **Swipe actions:** None (use tap for simplicity)
- **Modal confirmations:** Required before GR submission and logout
- **Toast notifications:**
  - Success: Green background, 3s duration
  - Error: Red background, 5s duration, dismissible
  - Info: Blue background, 3s duration
- **Camera integration:**
  - Request permissions on first use
  - Show preview before saving
  - Allow retake option