# Habit Tracker Progressive Web App

A mobile-first Progressive Web App for building and tracking daily habits. Built with Next.js, React, TypeScript, and Tailwind CSS with local persistence using localStorage.

## Project Overview

This Habit Tracker PWA enables users to:

- Sign up and log in with email and password
- Create, edit, and delete habits
- Mark habits as complete for the day
- View current streaks for habits
- Install the app as a PWA
- Use the app offline after the first load

The application uses localStorage for all persistence, ensuring all data remains local and deterministic.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **UI**: React 19 with Tailwind CSS
- **Testing**:
  - Unit tests: Vitest
  - Integration tests: React Testing Library + Vitest
  - E2E tests: Playwright
- **Persistence**: localStorage (local only)
- **PWA**: Service Worker for offline support and app installation

## Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn. I personlly used Bun for this project, but npm/yarn will work just fine.

### Installation

```bash
# Install dependencies
bun install

# or
npm install

# or
yarn install
```

## Run Instructions

### Development Server

```bash
bun dev

# or
npm run dev
```

The app will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run start
```

## Test Instructions

### Run All Tests

```bash
bun test

# or
npm test
```

This runs unit tests, integration tests, and e2e tests in sequence.

### Run Specific Test Suites

```bash
# Unit tests with coverage report
bun test:unit

# or
npm run test:unit

# Integration tests
bun test:integration

# or
npm run test:integration

# E2E tests
bun test:e2e

# or
npm run test:e2e
```

### Test Coverage

Unit tests target 80% line coverage for all utilities in `src/lib/`. Coverage reports are generated in HTML format after running unit tests.

## Local Persistence Structure

### Storage Keys

The app uses three localStorage keys for data persistence:

#### `habit-tracker-users`

Stores an array of user objects. Each user has:

```typescript
{
  id: string;
  email: string;
  password: string;
  createdAt: string; // ISO timestamp
}
```

#### `habit-tracker-session`

Stores the current logged-in session or null:

```typescript
{
  userId: string;
  email: string;
} | null
```

#### `habit-tracker-habits`

Stores an array of habit objects:

```typescript
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string; // ISO timestamp
  completions: string[]; // Array of YYYY-MM-DD dates
}
```

### Persistence Behavior

- All data persists across page reloads
- Session is maintained until logout
- Habits are scoped to the logged-in user
- Completions are stored as unique ISO dates (YYYY-MM-DD format)

## PWA Support

### Service Worker

The app registers a service worker (`/public/sw.js`) that:

- Caches the app shell on first load
- Enables offline access to the cached app after it has been loaded once
- Uses a network-first strategy for dynamic content
- Falls back to cache when offline

### Manifest

The app includes a web manifest (`/public/manifest.json`) that defines:

- App name and metadata
- Display mode (standalone)
- Theme and background colors
- PWA icons (192x192 and 512x512)

### Installation

Users can install the app as a PWA through:

- Browser's "Install app" button (when available)
- Three-dot menu → "Install app"
- Adding to home screen (mobile)

## Folder and File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with PWA setup
│   ├── page.tsx                # Splash screen and redirect logic
│   ├── login/page.tsx          # Login route
│   ├── signup/page.tsx         # Signup route
│   ├── dashboard/page.tsx      # Dashboard route (protected)
│   └── components/
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   └── SignupForm.tsx
│       ├── habits/
│       │   ├── HabitForm.tsx
│       │   ├── HabitList.tsx
│       │   └── HabitCard.tsx
│       └── shared/
│           ├── SplashScreen.tsx
│           ├── ProtectedRoute.tsx
│           └── ServiceWorkerRegistration.tsx
├── lib/
│   ├── auth.ts                 # Authentication functions
│   ├── storage.ts              # localStorage utilities
│   ├── habits.ts               # Habit utilities
│   ├── streaks.ts              # Streak calculation
│   ├── slug.ts                 # Slug generation for habits
│   ├── validators.ts           # Input validation
│   └── constants.ts            # Constants (storage keys)
├── types/
│   ├── auth.ts                 # Auth types
│   └── habit.ts                # Habit types
└── globals.css                 # Global styles

public/
├── manifest.json               # PWA manifest
├── sw.js                       # Service worker
└── icons/
    ├── icon-192.png
    └── icon-512.png

tests/
├── unit/
│   ├── slug.test.ts
│   ├── validators.test.ts
│   ├── streaks.test.ts
│   └── habits.test.ts
├── integration/
│   ├── auth-flow.test.tsx
│   └── habit-form.test.tsx
└── e2e/
    └── app.spec.ts
```

## Naming Conventions

- **React Components**: PascalCase (e.g., `HabitCard.tsx`)
- **Utility Files**: lowercase (e.g., `slug.ts`, `validators.ts`)
- **Type Files**: PascalCase exports (e.g., `User`, `Habit`)
- **Test Files**: `.test.ts` or `.test.tsx` suffix

## Authentication & Authorization

### Signup

- Email and password are required
- Duplicate emails are rejected
- A session is automatically created on successful signup
- User is redirected to `/dashboard`

### Login

- Email and password must match an existing user
- Invalid credentials show an error message
- A session is created on successful login
- User is redirected to `/dashboard`

### Protected Routes

- `/dashboard` requires a valid session
- Unauthenticated users are redirected to `/login`
- Session is checked on mount

### Logout

- Clears the session from localStorage
- Redirects to `/login`

## Habit Management

### Create Habit

- Habit name is required (max 60 characters)
- Description is optional
- Frequency defaults to "daily" (only option for this stage)
- Habit belongs to the logged-in user

### Edit Habit

- Name and description can be updated
- Immutable fields: id, userId, createdAt, completions
- Completions are preserved during edit

### Delete Habit

- Requires explicit confirmation
- Deleted habits are removed from user's list

### Complete Habit

- Completion is per date (YYYY-MM-DD format)
- Toggles today's date only
- Duplicate dates are automatically removed
- Streak updates immediately after completion change

## UI Test IDs Reference

### Auth

- `auth-login-email`: Email input on login form
- `auth-login-password`: Password input on login form
- `auth-login-submit`: Login form submit button
- `auth-signup-email`: Email input on signup form
- `auth-signup-password`: Password input on signup form
- `auth-signup-submit`: Signup form submit button
- `auth-logout-button`: Logout button

### Dashboard

- `dashboard-page`: Main dashboard container
- `empty-state`: Empty state message when no habits exist

### Habit Creation

- `create-habit-button`: Button to open create habit form
- `habit-form`: Habit form container
- `habit-name-input`: Habit name input
- `habit-description-input`: Habit description textarea
- `habit-frequency-select`: Frequency dropdown
- `habit-save-button`: Save/update button

### Habit Cards

For a habit named "Drink Water" (slug: "drink-water"):

- `habit-card-drink-water`: Habit card container
- `habit-streak-drink-water`: Streak display
- `habit-complete-drink-water`: Toggle completion button
- `habit-edit-drink-water`: Edit button
- `habit-delete-drink-water`: Delete button
- `confirm-delete-button`: Confirm deletion button (shown on delete)

### Splash

- `splash-screen`: Splash screen container

## Routes

### `/`

- **Purpose**: Splash/boot route
- **Behavior**: Shows splash screen for 800-2000ms, then redirects based on auth status
- **Public**: Yes

### `/signup`

- **Purpose**: User registration
- **Behavior**: Creates user and session, redirects to /dashboard on success
- **Public**: Yes

### `/login`

- **Purpose**: User authentication
- **Behavior**: Creates session, redirects to /dashboard on success
- **Public**: Yes

### `/dashboard`

- **Purpose**: Main application
- **Behavior**: Protected route, displays user's habits and habit management UI
- **Public**: No (requires session)

## Test File Locations and Coverage

### [tests/unit/slug.test.ts](tests/unit/slug.test.ts)

Tests the `getHabitSlug` utility function:

- Converts habit names to lowercase, hyphenated slugs
- Handles spaces, special characters, and trimming
- **Coverage**: slug utility function

### [tests/unit/validators.test.ts](tests/unit/validators.test.ts)

Tests the `validateHabitName` utility function:

- Validates required fields
- Enforces 60-character limit
- Returns normalized values
- **Coverage**: habit name validation

### [tests/unit/streaks.test.ts](tests/unit/streaks.test.ts)

Tests the `calculateCurrentStreak` utility function:

- Calculates current streaks from completion dates
- Handles edge cases (missing days, duplicates, empty list)
- Returns correct streak count
- **Coverage**: streak calculation logic

### [tests/unit/habits.test.ts](tests/unit/habits.test.ts)

Tests the `toggleHabitCompletion` utility function:

- Adds and removes completion dates
- Prevents mutations
- Removes duplicates
- **Coverage**: habit completion toggle logic

### [tests/integration/auth-flow.test.tsx](tests/integration/auth-flow.test.tsx)

Tests authentication flows:

- Signup creates user and session
- Duplicate email signup is rejected
- Login authenticates and creates session
- Invalid login shows error
- **Coverage**: Complete auth flow from signup to login

### [tests/integration/habit-form.test.tsx](tests/integration/habit-form.test.tsx)

Tests habit management flows:

- Validates habit name before creation
- Creates new habits
- Edits habits while preserving immutable fields
- Confirms deletion before removing habit
- Toggles completion and updates streak
- **Coverage**: Habit creation, editing, deletion, and completion flows

### [tests/e2e/app.spec.ts](tests/e2e/app.spec.ts)

End-to-end tests covering complete user flows:

- Splash screen and unauthenticated redirect
- Authenticated user redirect
- Dashboard protection
- Signup flow
- Login flow with user-scoped data
- Habit creation
- Habit completion and streak updates
- Persistence after page reload
- Logout flow
- Offline app shell loading
- **Coverage**: Complete user journeys from signup through PWA offline usage

## Trade-offs and Limitations

### Authentication

- **Trade-off**: No server-side validation or real authentication
- **Limitation**: Passwords are stored in plain text in localStorage (development only, not production-safe)
- **Reason**: Focus on frontend structure and testing

### Persistence

- **Trade-off**: All data is local to the browser
- **Limitation**: Data is lost if browser storage is cleared; no cross-device sync
- **Reason**: Requirements specify local persistence only

### PWA Offline Support

- **Limitation**: Offline access only works after the app has been loaded once (app shell caching)
- **Reason**: Service worker must be registered and cache populated before offline access

### Deployment

- **Note**: For production deployment, consider:
  - Using a real backend with proper authentication
  - Encrypting sensitive data
  - Adding proper error tracking and logging
  - Implementing automatic sync when back online

## Assumptions

1. Users access the app primarily on mobile devices (mobile-first design)
2. localStorage is available and has sufficient quota (typically 5-10MB per origin)
3. Service workers are supported (coverage: ~95% of modern browsers)
4. Users will reload the app at least once before expecting offline functionality
5. All habit names are unique per user (based on slug generation for UI tests)

## Development Notes

### Running Tests in CI/CD

For automated testing in CI:

```bash
npm run test
```

This runs all three test suites sequentially. Coverage reports are generated in the `coverage/` directory after unit tests complete.

### Service Worker Development

The service worker file is at `public/sw.js`. To test changes:

1. Unregister the existing service worker in DevTools
2. Clear the app cache
3. Reload the page

### localStorage Debugging

To inspect stored data in browser DevTools:

```javascript
// View all stored data
console.log({
  users: JSON.parse(localStorage.getItem('habit-tracker-users')),
  session: JSON.parse(localStorage.getItem('habit-tracker-session')),
  habits: JSON.parse(localStorage.getItem('habit-tracker-habits')),
});

// Clear all data (for testing)
localStorage.clear();
```

## Responsive Design

- **Mobile First**: Optimized for 320px width and up
- **Breakpoints**: Uses Tailwind CSS defaults (sm, md, lg, xl)
- **Accessibility**: Semantic HTML, keyboard navigation, visible focus states
- **Visual Design**: Clean, minimal UI with clear distinction between completed and incomplete habits

## Future Enhancements

Potential improvements for future stages:

- Backend API integration for cross-device sync
- More habit frequencies (weekly, monthly, etc.)
- Habit statistics and analytics
- Dark mode support
- Habit categories or tags
- Reminder notifications
- Export/import habit data
- Social sharing of streaks
