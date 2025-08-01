# EcoSajha Backend Middleware Documentation

## Overview
This document describes all middleware functions available in the EcoSajha backend application. Middleware functions are organized by category and provide various functionalities including authentication, validation, security, logging, caching, and more.

## Table of Contents
1. [Authentication Middleware](#authentication-middleware)
2. [Validation Middleware](#validation-middleware)
3. [Error Handling Middleware](#error-handling-middleware)
4. [Rate Limiting Middleware](#rate-limiting-middleware)
5. [File Upload Middleware](#file-upload-middleware)
6. [Logging Middleware](#logging-middleware)
7. [Caching Middleware](#caching-middleware)
8. [Security Middleware](#security-middleware)

## Authentication Middleware

### `authenticateToken`
Verifies JWT tokens and sets user information in request object.

**Usage:**
```javascript
import { authenticateToken } from './middleware/auth.js';

router.get('/protected', authenticateToken, (req, res) => {
  // req.user contains the authenticated user
});
```

**Features:**
- Validates JWT tokens from Authorization header
- Checks user account status
- Sets `req.user` with user information
- Returns 401 for invalid/expired tokens

### `requireRole(roles)`
Role-based access control middleware.

**Usage:**
```javascript
import { requireAdmin, requireCollector, requireUser } from './middleware/auth.js';

router.get('/admin-only', requireAdmin, (req, res) => {});
router.get('/collector-only', requireCollector, (req, res) => {});
router.get('/user-only', requireUser, (req, res) => {});
```

## Validation Middleware

### `validate(schema)`
Validates request body using Joi schemas.

**Usage:**
```javascript
import { validate, userRegistrationSchema } from './middleware/validation.js';

router.post('/register', validate(userRegistrationSchema), (req, res) => {
  // req.validatedData contains validated data
});
```

### Available Schemas:
- `userRegistrationSchema` - User registration validation
- `userLoginSchema` - User login validation
- `recyclingItemSchema` - Recycling item validation
- `postedItemSchema` - Posted item validation
- `collectionRequestSchema` - Collection request validation
- `reviewSchema` - Review validation
- `wishlistItemSchema` - Wishlist item validation
- `notificationSchema` - Notification validation

### `validateQuery(schema)`
Validates query parameters using Joi schemas.

**Usage:**
```javascript
import { validateQuery, paginationSchema } from './middleware/validation.js';

router.get('/items', validateQuery(paginationSchema), (req, res) => {
  // req.validatedQuery contains validated query parameters
});
```

## Error Handling Middleware

### `errorHandler`
Global error handling middleware that formats all errors consistently.

**Features:**
- Handles Sequelize validation errors
- Handles JWT errors
- Handles file upload errors
- Handles rate limiting errors
- Provides detailed error information in development

### `AppError`
Custom error class for operational errors.

**Usage:**
```javascript
import { AppError } from './middleware/errorHandler.js';

throw new AppError('User not found', 404);
```

### `asyncHandler`
Wraps async route handlers to catch errors.

**Usage:**
```javascript
import { asyncHandler } from './middleware/errorHandler.js';

router.get('/users', asyncHandler(async (req, res) => {
  // Async code here
}));
```

### `notFound`
Handles 404 errors for undefined routes.

## Rate Limiting Middleware

### `generalLimiter`
General rate limiter for all routes (100 requests per 15 minutes).

### `authLimiter`
Strict rate limiter for authentication routes (5 attempts per 15 minutes).

### `uploadLimiter`
Rate limiter for file uploads (10 uploads per hour).

### `searchLimiter`
Rate limiter for search operations (30 searches per 5 minutes).

### `collectionRequestLimiter`
Rate limiter for collection requests (20 requests per hour per user).

### `reviewLimiter`
Rate limiter for reviews (10 reviews per day per user).

### `adminLimiter`
Rate limiter for admin operations (50 operations per 5 minutes).

### `roleBasedLimiter(options)`
Dynamic rate limiter based on user role.

**Usage:**
```javascript
import { roleBasedLimiter } from './middleware/rateLimiter.js';

const customLimiter = roleBasedLimiter({
  user: { max: 30 },
  collector: { max: 60 },
  admin: { max: 100 }
});
```

## File Upload Middleware

### `uploadSingle`
Handles single file uploads.

**Usage:**
```javascript
import { uploadSingle } from './middleware/upload.js';

router.post('/upload', uploadSingle, (req, res) => {
  // req.file contains uploaded file
});
```

### `uploadMultiple`
Handles multiple file uploads (max 5 files).

### `uploadFields`
Handles specific field uploads with different limits.

### `handleUploadError`
Handles file upload errors.

### `validateFile`
Validates that files were uploaded.

### `optimizeImage`
Placeholder for image optimization (future implementation).

## Logging Middleware

### `requestLogger`
Logs all incoming requests and responses.

**Features:**
- Logs request method, URL, and user information
- Logs response status and duration
- Creates daily log files

### `errorLogger`
Logs unhandled errors with detailed information.

### `performanceLogger`
Monitors request performance and logs slow requests (>1s).

### `securityLogger`
Logs potential security threats and suspicious patterns.

### `activityLogger`
Logs user activity for authenticated requests.

### Logger Instance
```javascript
import logger from './middleware/logger.js';

logger.info('User logged in', { userId: 123 });
logger.error('Database connection failed', { error: err.message });
```

## Caching Middleware

### `cacheMiddleware(duration, keyGenerator)`
Generic caching middleware factory.

**Usage:**
```javascript
import { cacheMiddleware } from './middleware/cache.js';

const cacheFor5Minutes = cacheMiddleware(300);
router.get('/items', cacheFor5Minutes, (req, res) => {});
```

### `cacheRecyclingItems`
Specific cache for recycling items (10 minutes).

### `cachePostedItems`
Specific cache for posted items (5 minutes).

### `cacheUserProfile`
Specific cache for user profiles (30 minutes).

### `cacheDashboard`
Specific cache for dashboard data (5 minutes).

### `invalidateCache(patterns)`
Invalidates cache based on patterns.

**Usage:**
```javascript
import { invalidateCache } from './middleware/cache.js';

router.post('/items', invalidateCache(['recycling-items']), (req, res) => {});
```

### Cache Management Functions:
- `getCacheStats()` - Get cache statistics
- `clearAllCache()` - Clear all cache
- `clearCacheByPattern(pattern)` - Clear cache by pattern
- `warmCache(key, data, ttl)` - Pre-populate cache

## Security Middleware

### `securityHeaders`
Applies security headers using Helmet.

**Features:**
- Content Security Policy
- HSTS headers
- XSS protection
- Frame guard
- No sniff protection

### `corsOptions`
CORS configuration for cross-origin requests.

### `bruteForceProtection`
Protects against brute force attacks on authentication.

### `sqlInjectionProtection`
Detects and blocks SQL injection attempts.

### `xssProtection`
Sanitizes input to prevent XSS attacks.

### `validateContentType`
Validates content types for POST/PUT requests.

### `requestSizeLimit`
Limits request size to prevent DoS attacks.

### `ipWhitelist(allowedIPs)`
IP-based access control.

### `validateApiKey`
Validates API keys for external integrations.

### `securityLogging`
Logs security-related events.

## Usage Examples

### Complete Route with Multiple Middleware
```javascript
import express from 'express';
import {
  authenticateToken,
  requireAdmin,
  validate,
  recyclingItemSchema,
  uploadSingle,
  cacheRecyclingItems,
  invalidateCache
} from './middleware/index.js';

const router = express.Router();

// Get recycling items (cached, public)
router.get('/', cacheRecyclingItems, (req, res) => {
  // Handler code
});

// Create recycling item (admin only, validated, cached)
router.post('/',
  authenticateToken,
  requireAdmin,
  validate(recyclingItemSchema),
  uploadSingle,
  invalidateCache(['recycling-items']),
  (req, res) => {
    // Handler code
  }
);
```

### Error Handling Setup
```javascript
import express from 'express';
import {
  errorHandler,
  notFound,
  requestLogger,
  performanceLogger
} from './middleware/index.js';

const app = express();

// Apply middleware in order
app.use(requestLogger);
app.use(performanceLogger);

// Routes here...

// Error handling (must be last)
app.use(notFound);
app.use(errorHandler);
```

## Configuration

### Environment Variables
```bash
# Logging
LOG_LEVEL=INFO

# Security
JWT_SECRET=your-secret-key
API_KEYS=key1,key2,key3

# CORS
FRONTEND_URL=http://localhost:3000
```

### Cache Configuration
```javascript
// Default cache settings
const cacheConfig = {
  stdTTL: 300, // 5 minutes
  checkperiod: 600, // Check every 10 minutes
  useClones: false,
  deleteOnExpire: true
};
```

## Best Practices

1. **Order Matters**: Apply middleware in the correct order
2. **Error Handling**: Always include error handling middleware last
3. **Security First**: Apply security middleware early
4. **Caching Strategy**: Use appropriate cache durations
5. **Rate Limiting**: Apply rate limits based on endpoint sensitivity
6. **Logging**: Log important events and errors
7. **Validation**: Validate all user inputs
8. **File Uploads**: Always validate file types and sizes

## Performance Considerations

- Use caching for frequently accessed data
- Implement rate limiting to prevent abuse
- Monitor slow requests with performance logging
- Optimize database queries
- Use appropriate cache TTL values
- Implement request size limits

## Security Considerations

- Always validate user inputs
- Use HTTPS in production
- Implement proper authentication
- Apply rate limiting
- Log security events
- Sanitize user inputs
- Use secure headers
- Validate file uploads 