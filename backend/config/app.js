import dotenv from 'dotenv';

dotenv.config();

const appConfig = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Logging Configuration
  logLevel: process.env.LOG_LEVEL || 'INFO',
  
  // CORS Configuration
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // API Configuration
  apiKeys: process.env.API_KEYS ? process.env.API_KEYS.split(',') : [],
  
  // File Upload Configuration
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  uploadPath: process.env.UPLOAD_PATH || 'uploads/',
  
  // Rate Limiting Configuration
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  
  // Cache Configuration
  cacheTTL: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
  cacheCheckPeriod: parseInt(process.env.CACHE_CHECK_PERIOD) || 600, // 10 minutes
  
  // Email Configuration (for future use)
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  
  // Payment Configuration (for future use)
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  },
  
  // Security Configuration
  bcryptRounds: 12,
  sessionSecret: process.env.SESSION_SECRET || 'your-session-secret',
  
  // Pagination Defaults
  defaultPageSize: 10,
  maxPageSize: 100,
  
  // File Upload Limits
  maxFiles: 5,
  allowedImageTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  
  // Cache Keys
  cacheKeys: {
    recyclingItems: 'recycling-items',
    postedItems: 'posted-items',
    userProfile: 'user-profile',
    dashboard: 'dashboard',
    categories: 'categories'
  }
};

export default appConfig; 