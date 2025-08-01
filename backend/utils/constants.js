// User Roles
export const USER_ROLES = {
  USER: 'user',
  COLLECTOR: 'collector',
  ADMIN: 'admin'
};

// Item Categories
export const ITEM_CATEGORIES = {
  PAPER: 'Paper',
  GLASS_PLASTIC: 'Glass and Plastic',
  METAL_STEEL: 'Metal & Steel',
  E_WASTE: 'E-waste',
  BRASS: 'Brass',
  OTHERS: 'Others'
};

// Item Conditions
export const ITEM_CONDITIONS = {
  EXCELLENT: 'Excellent',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor'
};

// Collection Request Types
export const REQUEST_TYPES = {
  USER_POSTED: 'user_posted',
  BROWSED_ITEMS: 'browsed_items',
  SCHEDULED: 'scheduled'
};

// Collection Request Status
export const REQUEST_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
};

// Posted Item Status
export const POSTED_ITEM_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  COLLECTED: 'Collected',
  REJECTED: 'Rejected'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  COLLECTION_REQUEST: 'collection_request',
  PAYMENT: 'payment',
  REVIEW: 'review'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

// Review Status
export const REVIEW_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

// Rate Limiting
export const RATE_LIMITS = {
  GENERAL: { windowMs: 15 * 60 * 1000, max: 100 },
  AUTH: { windowMs: 15 * 60 * 1000, max: 5 },
  UPLOAD: { windowMs: 60 * 60 * 1000, max: 10 },
  SEARCH: { windowMs: 5 * 60 * 1000, max: 30 },
  COLLECTION_REQUEST: { windowMs: 60 * 60 * 1000, max: 20 },
  REVIEW: { windowMs: 24 * 60 * 60 * 1000, max: 10 }
};

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  RECYCLING_ITEMS: 600, // 10 minutes
  POSTED_ITEMS: 300, // 5 minutes
  USER_PROFILE: 1800, // 30 minutes
  DASHBOARD: 300, // 5 minutes
  CATEGORIES: 3600, // 1 hour
  STATS: 900 // 15 minutes
};

// Database Constraints
export const DB_CONSTRAINTS = {
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 15,
  ADDRESS_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 500
};

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please provide a valid email address',
  INVALID_PHONE: 'Please provide a valid phone number',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long',
  INVALID_CATEGORY: 'Please select a valid category',
  INVALID_CONDITION: 'Please select a valid condition',
  INVALID_STATUS: 'Please select a valid status',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Only image files are allowed',
  INVALID_URL: 'Please provide a valid URL'
};

// Error Messages
export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  ITEM_NOT_FOUND: 'Item not found',
  REQUEST_NOT_FOUND: 'Collection request not found',
  REVIEW_NOT_FOUND: 'Review not found',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  VALIDATION_ERROR: 'Validation error',
  DATABASE_ERROR: 'Database error',
  FILE_UPLOAD_ERROR: 'File upload error',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INVALID_TOKEN: 'Invalid or expired token',
  DUPLICATE_ENTRY: 'Record already exists',
  FOREIGN_KEY_CONSTRAINT: 'Referenced record does not exist'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  ITEM_CREATED: 'Item created successfully',
  ITEM_UPDATED: 'Item updated successfully',
  ITEM_DELETED: 'Item deleted successfully',
  REQUEST_CREATED: 'Collection request created successfully',
  REQUEST_UPDATED: 'Collection request updated successfully',
  REQUEST_COMPLETED: 'Collection request completed successfully',
  REVIEW_CREATED: 'Review submitted successfully',
  REVIEW_UPDATED: 'Review updated successfully',
  REVIEW_DELETED: 'Review deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PASSWORD_CHANGED: 'Password changed successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh'
  },
  USERS: {
    BASE: '/api/users',
    PROFILE: '/api/users/me',
    STATS: '/api/users/stats'
  },
  RECYCLING_ITEMS: {
    BASE: '/api/recycling-items',
    CATEGORIES: '/api/recycling-items/categories',
    SEARCH: '/api/recycling-items/search'
  },
  POSTED_ITEMS: {
    BASE: '/api/posted-items',
    USER_ITEMS: '/api/posted-items/user/items',
    SEARCH: '/api/posted-items/search'
  },
  COLLECTION_REQUESTS: {
    BASE: '/api/collection-requests',
    USER_REQUESTS: '/api/collection-requests/user/requests',
    COLLECTOR_REQUESTS: '/api/collection-requests/collector/requests'
  },
  REVIEWS: {
    BASE: '/api/reviews',
    USER_REVIEWS: '/api/reviews/user/reviews',
    COLLECTOR_REVIEWS: '/api/reviews/collector'
  },
  NOTIFICATIONS: {
    BASE: '/api/notifications',
    UNREAD_COUNT: '/api/notifications/unread-count'
  },
  WISHLIST: {
    BASE: '/api/wishlist',
    CHECK_ITEM: '/api/wishlist/check'
  },
  DASHBOARD: {
    USER: '/api/dashboard/user',
    COLLECTOR: '/api/dashboard/collector',
    ADMIN: '/api/dashboard/admin'
  }
};

// Default Values
export const DEFAULT_VALUES = {
  USER_ROLE: USER_ROLES.USER,
  ITEM_STATUS: POSTED_ITEM_STATUS.PENDING,
  REQUEST_STATUS: REQUEST_STATUS.PENDING,
  PAYMENT_STATUS: PAYMENT_STATUS.PENDING,
  REVIEW_STATUS: REVIEW_STATUS.PENDING,
  NOTIFICATION_TYPE: NOTIFICATION_TYPES.INFO,
  ITEM_CONDITION: ITEM_CONDITIONS.GOOD,
  ITEM_CATEGORY: ITEM_CATEGORIES.OTHERS
};

// Sorting Options
export const SORT_OPTIONS = {
  CREATED_AT: 'createdAt',
  UPDATED_AT: 'updatedAt',
  NAME: 'name',
  PRICE: 'price',
  STATUS: 'status',
  RATING: 'rating',
  DATE: 'date'
};

// Sort Orders
export const SORT_ORDERS = {
  ASC: 'asc',
  DESC: 'desc'
};

// Filter Options
export const FILTER_OPTIONS = {
  STATUS: 'status',
  CATEGORY: 'category',
  CONDITION: 'condition',
  DATE_RANGE: 'dateRange',
  PRICE_RANGE: 'priceRange',
  LOCATION: 'location',
  USER: 'user',
  COLLECTOR: 'collector'
};

// Search Options
export const SEARCH_OPTIONS = {
  NAME: 'name',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
  LOCATION: 'location',
  USER: 'user',
  COLLECTOR: 'collector'
}; 