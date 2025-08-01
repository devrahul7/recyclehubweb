import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log levels
const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3
};

// Current log level (can be set via environment variable)
const CURRENT_LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || 'INFO'];

// Logger class
class Logger {
  constructor() {
    this.logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
    this.errorFile = path.join(logsDir, `error-${new Date().toISOString().split('T')[0]}.log`);
  }

  // Write to log file
  writeToFile(message, file = this.logFile) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    
    fs.appendFileSync(file, logEntry);
  }

  // Log method
  log(level, message, data = null) {
    if (LOG_LEVELS[level] <= CURRENT_LOG_LEVEL) {
      const logMessage = `[${level}] ${message}${data ? ` | ${JSON.stringify(data)}` : ''}`;
      console.log(logMessage);
      this.writeToFile(logMessage);
    }
  }

  // Convenience methods
  error(message, data = null) {
    this.log('ERROR', message, data);
    this.writeToFile(`[ERROR] ${message}${data ? ` | ${JSON.stringify(data)}` : ''}`, this.errorFile);
  }

  warn(message, data = null) {
    this.log('WARN', message, data);
  }

  info(message, data = null) {
    this.log('INFO', message, data);
  }

  debug(message, data = null) {
    this.log('DEBUG', message, data);
  }
}

const logger = new Logger();

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  logger.info(`Request: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous'
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'WARN' : 'INFO';
    
    logger.log(logLevel, `Response: ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`, {
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id || 'anonymous'
    });
  });

  next();
};

// Error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id || 'anonymous',
    ip: req.ip
  });
  
  next(err);
};

// Performance monitoring middleware
export const performanceLogger = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds
    
    if (duration > 1000) { // Log slow requests (>1s)
      logger.warn('Slow request detected', {
        url: req.originalUrl,
        method: req.method,
        duration: `${duration.toFixed(2)}ms`,
        userId: req.user?.id || 'anonymous'
      });
    }
  });
  
  next();
};

// Security logging middleware
export const securityLogger = (req, res, next) => {
  // Log potential security issues
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i
  ];

  const userInput = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params
  });

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(userInput)) {
      logger.warn('Potential security threat detected', {
        pattern: pattern.source,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      break;
    }
  }

  next();
};

// Database query logging middleware
export const queryLogger = (req, res, next) => {
  // This would be integrated with Sequelize hooks for query logging
  // For now, it's a placeholder
  next();
};

// User activity logging middleware
export const activityLogger = (req, res, next) => {
  if (req.user) {
    logger.info('User activity', {
      userId: req.user.id,
      email: req.user.email,
      role: req.user.role,
      action: `${req.method} ${req.originalUrl}`,
      ip: req.ip
    });
  }
  
  next();
};

// Export logger instance
export default logger; 