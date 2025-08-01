# EcoSajha API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication Routes
**Base Path:** `/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |
| POST | `/refresh` | Refresh access token | Yes |

### Recycling Items Routes
**Base Path:** `/recycling-items`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all recycling items | No |
| GET | `/categories` | Get all categories | No |
| GET | `/category/:category` | Get items by category | No |
| GET | `/search` | Search recycling items | No |
| GET | `/:id` | Get item by ID | No |
| POST | `/` | Create new recycling item | Yes (Admin) |
| PUT | `/:id` | Update recycling item | Yes (Admin) |
| DELETE | `/:id` | Delete recycling item | Yes (Admin) |

### Posted Items Routes
**Base Path:** `/posted-items`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all posted items | No |
| GET | `/search` | Search posted items | No |
| GET | `/stats` | Get posted items statistics | No |
| GET | `/:id` | Get posted item by ID | No |
| POST | `/` | Create new posted item | Yes |
| GET | `/user/items` | Get user's posted items | Yes |
| PUT | `/:id` | Update posted item | Yes |
| DELETE | `/:id` | Delete posted item | Yes |

### Collection Requests Routes
**Base Path:** `/collection-requests`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get collection request statistics | No |
| GET | `/` | Get all collection requests | Yes |
| GET | `/user/requests` | Get user's collection requests | Yes |
| GET | `/collector/requests` | Get collector's assigned requests | Yes |
| GET | `/:id` | Get collection request by ID | Yes |
| POST | `/from-wishlist` | Create collection request from wishlist | Yes |
| PUT | `/:id/status` | Update collection request status | Yes |
| PUT | `/:id/complete` | Complete collection request | Yes |
| PUT | `/:id/cancel` | Cancel collection request | Yes |

### Reviews Routes
**Base Path:** `/reviews`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all reviews | No |
| GET | `/collector/:collectorId` | Get reviews by collector | No |
| GET | `/stats` | Get review statistics | No |
| GET | `/:id` | Get review by ID | No |
| POST | `/` | Create new review | Yes |
| GET | `/user/reviews` | Get user's reviews | Yes |
| PUT | `/:id` | Update review | Yes |
| DELETE | `/:id` | Delete review | Yes |
| PUT | `/:id/verify` | Verify review (Admin) | Yes (Admin) |

### Notifications Routes
**Base Path:** `/notifications`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's notifications | Yes |
| GET | `/unread-count` | Get unread notification count | Yes |
| GET | `/stats` | Get notification statistics | Yes |
| GET | `/:id` | Get notification by ID | Yes |
| POST | `/` | Create new notification | Yes |
| PUT | `/:id/read` | Mark notification as read | Yes |
| PUT | `/mark-all-read` | Mark all notifications as read | Yes |
| DELETE | `/:id` | Delete notification | Yes |
| DELETE | `/clear-old` | Clear old notifications | Yes |

### Wishlist Routes
**Base Path:** `/wishlist`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user's wishlist | Yes |
| GET | `/stats` | Get wishlist statistics | Yes |
| GET | `/search` | Search wishlist items | Yes |
| GET | `/check/:itemId` | Check if item is in wishlist | Yes |
| POST | `/` | Add item to wishlist | Yes |
| PUT | `/:id` | Update wishlist item | Yes |
| DELETE | `/:id` | Remove item from wishlist | Yes |
| DELETE | `/` | Clear entire wishlist | Yes |

### Users Routes
**Base Path:** `/users`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/me` | Get current user profile | Yes |
| GET | `/stats` | Get user statistics | Yes |
| PUT | `/profile` | Update user profile | Yes |
| GET | `/` | Get all users (Admin) | Yes (Admin) |
| GET | `/collectors` | Get all collectors (Admin) | Yes (Admin) |
| GET | `/collector/:id` | Get collector details (Admin) | Yes (Admin) |
| GET | `/system-stats` | Get system statistics (Admin) | Yes (Admin) |
| GET | `/:id` | Get user by ID (Admin) | Yes (Admin) |
| PUT | `/:id` | Update user (Admin) | Yes (Admin) |
| PUT | `/:id/role` | Change user role (Admin) | Yes (Admin) |
| PUT | `/:id/status` | Toggle user status (Admin) | Yes (Admin) |
| DELETE | `/:id` | Delete user (Admin) | Yes (Admin) |

### Dashboard Routes
**Base Path:** `/dashboard`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/user` | Get user dashboard data | Yes |
| GET | `/collector` | Get collector dashboard data | Yes |
| GET | `/admin` | Get admin dashboard data | Yes |
| GET | `/analytics` | Get analytics data | Yes |
| GET | `/chart-data` | Get chart data | Yes |

## Query Parameters

### Pagination
Most list endpoints support pagination:
```
?page=1&limit=10
```

### Filtering
Many endpoints support filtering:
```
?status=pending&category=paper&dateFrom=2024-01-01&dateTo=2024-12-31
```

### Sorting
List endpoints support sorting:
```
?sortBy=createdAt&sortOrder=desc
```

### Search
Search endpoints support:
```
?q=search_term&category=paper&priceMin=10&priceMax=100
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## User Roles

- `user` - Regular user who can post items and request collections
- `collector` - User who can collect items and manage collection requests
- `admin` - Administrator with full system access

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## File Upload

For endpoints that accept file uploads (images), use `multipart/form-data`:
```
Content-Type: multipart/form-data
```

## WebSocket Events (Future)

The API will support real-time updates via WebSocket:
- Collection request status updates
- New notification alerts
- Real-time chat between users and collectors 