# Mobile GRN Application

## Overview
A mobile application for performing Goods Receipts (GRN) for SAP S/4HANA + VIM Workplace. This allows warehouse and operations users to perform GRs from mobile/tablet without accessing SAP desktop VIM Workplace.

## Tech Stack
- **Frontend**: Expo React Native with TypeScript
- **Backend**: Express.js (for future SAP API integration)
- **State Management**: React Context API (AuthProvider, GRNProvider, ToastProvider)
- **Storage**: AsyncStorage for local persistence
- **Navigation**: React Navigation 7+

## Project Structure
```
client/
  ├── components/       # Reusable UI components (Card, GRNCard, StatusBadge, etc.)
  ├── constants/        # Theme, colors, typography, spacing
  ├── contexts/         # AuthContext, GRNContext, ToastContext
  ├── hooks/            # Custom hooks
  ├── lib/              # Storage, mock data, API utilities
  ├── navigation/       # Navigation structure (Root, Main, Tab navigators)
  ├── screens/          # App screens (Login, Dashboard, CreateGR, etc.)
  ├── types/            # TypeScript types
  └── App.tsx           # Main app component with providers
server/
  ├── templates/        # Landing page
  ├── index.ts          # Express server
  └── routes.ts         # API routes
```

## Key Features
1. **Login System**: SSO simulation with role-based access
2. **Dashboard**: List of pending GRNs with real-time stats, search, and status filters
3. **Create GR**: Form to submit goods receipt with PO search and validation
4. **Attachments**: Camera capture for delivery challan, goods photos, and inspection notes
5. **GRN Detail**: Full details view with quick post functionality
6. **Profile**: User settings, sync status, logout

## State Management
- **AuthContext**: User authentication and session management
- **GRNContext**: Centralized GRN data with real-time updates after mutations
- **ToastContext**: Global toast notifications for success/error feedback

## Running the App
- **Expo Dev Server**: Port 8081
- **Express Backend**: Port 5000
- Use `npm run dev` to start both servers
- Scan QR code with Expo Go app for mobile testing

## Mock Data
- The app uses mock GRN data stored in AsyncStorage
- 6 pre-loaded GRN items with various statuses (pending, completed, error)
- Mock SAP API simulates posting GRs with Movement Type 101 (1.5s delay)

## Data Persistence
- GRN data persisted via AsyncStorage
- Attachments stored locally with AsyncStorage and linked to GRNs
- Data updates reflected immediately across all screens

## Recent Changes
- January 2026: Complete MVP implementation
- Added centralized GRNContext for state management
- Implemented attachment persistence
- Added ToastProvider for global notifications
- Real-time data updates across Dashboard, CreateGR, and GRNDetail screens

## User Preferences
- Corporate blue-white theme (#0070F3)
- Mobile-first responsive design
- Large tap-friendly buttons for warehouse use
- iOS 26 liquid glass design language
