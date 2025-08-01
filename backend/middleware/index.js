// Authentication middleware
export { 
  authenticateToken, 
  requireRole, 
  requireAdmin, 
  requireCollector, 
  requireUser 
} from './auth.js';

// Validation middleware
export {
  validate,
  validateQuery,
  userRegistrationSchema,
  userLoginSchema,
  recyclingItemSchema,
  postedItemSchema,
  collectionRequestSchema,
  reviewSchema,
  wishlistItemSchema,
  notificationSchema,
  paginationSchema,
  searchSchema
} from './validation.js';

// Error handling middleware
export { 
  errorHandler, 
  AppError, 
  asyncHandler, 
  notFound 
} from './errorHandler.js';

// Rate limiting middleware
export {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  searchLimiter,
  collectionRequestLimiter,
  reviewLimiter,
  adminLimiter,
  roleBasedLimiter
} from './rateLimiter.js';

// File upload middleware
export {
  uploadSingle,
  uploadMultiple,
  uploadFields,
  handleUploadError,
  optimizeImage,
  validateFile,
  cleanupUploads
} from './upload.js';

// Logging middleware
export {
  requestLogger,
  errorLogger,
  performanceLogger,
  securityLogger,
  queryLogger,
  activityLogger
} from './logger.js';

// Caching middleware
export {
  cacheMiddleware,
  invalidateCache,
  cacheRecyclingItems,
  cachePostedItems,
  cacheUserProfile,
  cacheDashboard,
  getCacheStats,
  clearAllCache,
  clearCacheByPattern,
  warmCache,
  apiCache
} from './cache.js';

// Security middleware
export {
  securityHeaders,
  corsOptions,
  bruteForceProtection,
  sqlInjectionProtection,
  xssProtection,
  validateContentType,
  requestSizeLimit,
  ipWhitelist,
  validateApiKey,
  securityLogging
} from './security.js';

// Default exports
export { default as logger } from './logger.js';
export { default as cache } from './cache.js'; 