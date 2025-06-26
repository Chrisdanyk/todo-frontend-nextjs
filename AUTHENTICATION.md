# Authentication System

This document describes the authentication system implemented in the Todo app frontend.

## Overview

The authentication system provides:
- User registration and login
- JWT token management with refresh tokens
- Protected routes with role-based access control
- User profile management
- Admin user management

## Architecture

### Core Components

1. **Auth API (`lib/auth.ts`)**
   - Handles all API communication with the backend
   - Manages JWT tokens (access and refresh)
   - Provides methods for all auth operations

2. **Auth Context (`contexts/auth-context.tsx`)**
   - React context for managing authentication state
   - Provides auth methods to components
   - Handles automatic token refresh

3. **Protected Route (`components/protected-route.tsx`)**
   - Route guard component
   - Handles authentication and role-based access
   - Shows appropriate loading and error states

### Authentication Flow

1. **Login**
   - User enters credentials
   - API call to `/auth/login`
   - Tokens stored in localStorage
   - User redirected to dashboard

2. **Token Management**
   - Access tokens expire after 1 hour
   - Refresh tokens expire after 7 days
   - Automatic token refresh on API calls
   - Logout revokes all tokens

3. **Protected Routes**
   - Check authentication status
   - Redirect to login if not authenticated
   - Check admin role for admin-only routes

## API Endpoints

The frontend communicates with these backend endpoints:

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/me` - Update current user
- `GET /auth/users` - List users (admin only)
- `GET /auth/users/:id` - Get user (admin only)
- `PUT /auth/users/:id` - Update user (admin only)
- `DELETE /auth/users/:id` - Delete user (admin only)

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Usage Examples

### Using Auth Context

```tsx
import { useAuth } from '@/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please log in</div>
  }
  
  return <div>Welcome, {user?.name}!</div>
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/components/protected-route'

// Require authentication
<ProtectedRoute>
  <MyComponent />
</ProtectedRoute>

// Require admin role
<ProtectedRoute requireAdmin>
  <AdminComponent />
</ProtectedRoute>
```

### Direct API Usage

```tsx
import { authAPI } from '@/lib/auth'

// Login
await authAPI.login({ email, password })

// Get current user
const user = await authAPI.getCurrentUser()

// Update profile
await authAPI.updateProfile({ name: 'New Name' })
```

## Security Features

- JWT tokens with expiration
- Automatic token refresh
- Secure token storage in localStorage
- Role-based access control
- CSRF protection (handled by backend)
- Input validation and sanitization

## Error Handling

The system provides comprehensive error handling:
- Network errors
- Authentication failures
- Token expiration
- Permission denied errors
- User-friendly error messages

## Future Enhancements

- Two-factor authentication
- Password reset functionality
- Email verification
- Social login integration
- Session management
- Audit logging 