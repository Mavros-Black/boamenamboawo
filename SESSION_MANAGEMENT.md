# Cookie-Based Session Management

## Overview

This application implements a secure cookie-based session management system that keeps users logged in until their session expires. The system uses both access tokens and refresh tokens for enhanced security.

## Features

- **Persistent Sessions**: Users stay logged in across browser sessions
- **Automatic Token Refresh**: Sessions are automatically renewed when needed
- **Secure Cookies**: All cookies are secure and use proper security flags
- **Session Expiration**: Configurable session and refresh token durations
- **Automatic Logout**: Users are automatically logged out when sessions expire

## Session Configuration

### Cookie Settings

- **Session Duration**: 7 days
- **Refresh Token Duration**: 30 days
- **Security**: HTTPS-only in production
- **SameSite**: Lax (allows cross-site requests from same site)
- **HttpOnly**: False (needed for client-side access)

### Cookie Names

- **Session Token**: `boa-me-session`
- **Refresh Token**: `boa-me-refresh`

## How It Works

### 1. Login/Registration

When a user logs in or registers:

1. Server validates credentials
2. Generates access token (7 days) and refresh token (30 days)
3. Stores refresh token in server memory/database
4. Returns both tokens to client
5. Client stores tokens in secure cookies

### 2. Session Validation

On each page load or API request:

1. Client checks if session token exists and is valid
2. If token is expired, attempts to refresh using refresh token
3. If refresh succeeds, updates session cookies
4. If refresh fails, clears cookies and redirects to login

### 3. Automatic Refresh

The system automatically refreshes sessions:

1. Checks token expiration before each request
2. Uses refresh token to get new access token
3. Updates cookies with new tokens
4. Continues with original request

### 4. Logout

When user logs out:

1. Clears all session cookies
2. Optionally invalidates refresh token on server
3. Redirects to login page

## Security Features

### Cookie Security

- **Secure Flag**: Cookies only sent over HTTPS in production
- **SameSite**: Prevents CSRF attacks
- **HttpOnly**: False (needed for client-side token access)
- **Path**: Restricted to application path

### Token Security

- **JWT Tokens**: Signed with secret key
- **Short Expiration**: Access tokens expire in 7 days
- **Refresh Rotation**: New refresh token issued with each refresh
- **Server Validation**: All tokens validated on server

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/register` - Register new user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info

### Request Headers

All authenticated requests should include:

```
Authorization: Bearer <access_token>
```

## Client-Side Usage

### AuthContext

The `AuthContext` provides session management:

```typescript
const { user, login, logout, checkAuth } = useAuth()

// Login
const result = await login(email, password)

// Check authentication
await checkAuth()

// Logout
logout()
```

### Automatic Session Management

The system automatically:

- Checks session on app load
- Refreshes expired tokens
- Handles authentication errors
- Redirects to login when needed

## Environment Variables

Required environment variables:

```env
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

## Production Considerations

### Database Storage

In production, refresh tokens should be stored in a database:

1. Create `refresh_tokens` table
2. Store token hash, user ID, expiration
3. Implement token rotation
4. Add token revocation

### Security Headers

Add security headers to your application:

```typescript
// In your Next.js config
const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

### HTTPS

Ensure your application runs on HTTPS in production:

- Use SSL certificates
- Redirect HTTP to HTTPS
- Set secure cookie flags

## Troubleshooting

### Common Issues

1. **Cookies Not Set**: Check browser settings and HTTPS
2. **Session Expires Immediately**: Verify JWT_SECRET is set
3. **Refresh Fails**: Check refresh token storage
4. **CORS Issues**: Configure proper CORS settings

### Debug Mode

Enable debug logging:

```typescript
// In development
console.log('Session check:', { token: getSessionToken(), expired: isSessionExpired() })
```

## Migration from localStorage

This system replaces localStorage-based authentication:

- **Before**: Tokens stored in localStorage
- **After**: Tokens stored in secure cookies
- **Benefits**: Better security, automatic expiration, cross-tab sync

## Testing

Test session management:

1. Login and verify cookies are set
2. Close browser and reopen
3. Verify user is still logged in
4. Wait for token expiration
5. Verify automatic refresh works
6. Test logout clears cookies

