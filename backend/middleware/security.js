import helmet from 'helmet';
import cors from 'cors';

// Security headers middleware
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  frameguard: { action: 'deny' }
});

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL
    ].filter(Boolean);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Rate limiting for brute force protection
export const bruteForceProtection = (req, res, next) => {
  const attempts = req.session?.loginAttempts || 0;
  const lastAttempt = req.session?.lastLoginAttempt || 0;
  const now = Date.now();
  
  // Reset attempts after 15 minutes
  if (now - lastAttempt > 15 * 60 * 1000) {
    req.session.loginAttempts = 0;
  }
  
  // Block if too many attempts
  if (attempts >= 5) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again later.'
    });
  }
  
  next();
};

// SQL Injection protection
export const sqlInjectionProtection = (req, res, next) => {
  const sqlPatterns = [
    /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
    /(\b(or|and)\b\s+\d+\s*=\s*\d+)/i,
    /(\b(union|select|insert|update|delete|drop|create|alter)\b.*\b(union|select|insert|update|delete|drop|create|alter)\b)/i
  ];

  const userInput = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  });

  for (const pattern of sqlPatterns) {
    if (pattern.test(userInput)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input detected'
      });
    }
  }

  next();
};

// XSS Protection
export const xssProtection = (req, res, next) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi
  ];

  const sanitizeInput = (input) => {
    if (typeof input === 'string') {
      return input.replace(/[<>]/g, '');
    }
    return input;
  };

  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      req.body[key] = sanitizeInput(req.body[key]);
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitizeInput(req.query[key]);
    });
  }

  next();
};

// Content Type validation
export const validateContentType = (req, res, next) => {
  const allowedContentTypes = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data'
  ];

  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.get('Content-Type');
    if (!contentType || !allowedContentTypes.some(type => contentType.includes(type))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid content type'
      });
    }
  }

  next();
};

// Request size limiting
export const requestSizeLimit = (req, res, next) => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  let dataSize = 0;

  req.on('data', (chunk) => {
    dataSize += chunk.length;
    if (dataSize > maxSize) {
      return res.status(413).json({
        success: false,
        message: 'Request too large'
      });
    }
  });

  next();
};

// IP whitelist middleware (optional)
export const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    if (allowedIPs.length > 0) {
      const clientIP = req.ip || req.connection.remoteAddress;
      if (!allowedIPs.includes(clientIP)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }
    next();
  };
};

// API key validation middleware
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKeys = process.env.API_KEYS?.split(',') || [];

  if (validApiKeys.length > 0 && !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }

  next();
};

// Request logging for security
export const securityLogging = (req, res, next) => {
  const securityEvents = [
    'login',
    'logout',
    'password_change',
    'role_change',
    'admin_action'
  ];

  const event = req.path.split('/').pop();
  if (securityEvents.includes(event)) {
    console.log(`Security Event: ${event}`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

export default {
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
}; 