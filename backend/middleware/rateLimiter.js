import rateLimit from 'express-rate-limit';

// General rate limiter for all routes
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: {
    success: false,
    message: 'Too many file uploads, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for search operations
export const searchLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // limit each IP to 30 searches per 5 minutes
  message: {
    success: false,
    message: 'Too many search requests, please try again after 5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for collection requests
export const collectionRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each user to 20 collection requests per hour
  message: {
    success: false,
    message: 'Too many collection requests, please try again after 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise use IP
    return req.user ? req.user.id : req.ip;
  }
});

// Rate limiter for reviews
export const reviewLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // limit each user to 10 reviews per day
  message: {
    success: false,
    message: 'Too many reviews, please try again tomorrow'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  }
});

// Rate limiter for admin operations
export const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // limit each admin to 50 operations per 5 minutes
  message: {
    success: false,
    message: 'Too many admin operations, please try again after 5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.user ? req.user.id : req.ip;
  },
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

// Dynamic rate limiter based on user role
export const roleBasedLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    user: { max: 50 },
    collector: { max: 100 },
    admin: { max: 200 },
    anonymous: { max: 20 }
  };

  const config = { ...defaultOptions, ...options };

  return rateLimit({
    windowMs: config.windowMs,
    max: (req) => {
      if (!req.user) return config.anonymous.max;
      
      switch (req.user.role) {
        case 'admin':
          return config.admin.max;
        case 'collector':
          return config.collector.max;
        case 'user':
        default:
          return config.user.max;
      }
    },
    message: {
      success: false,
      message: 'Rate limit exceeded for your user type'
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user ? req.user.id : req.ip;
    }
  });
}; 