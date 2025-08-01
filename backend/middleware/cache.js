import NodeCache from 'node-cache';

// Initialize cache with default settings
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 600, // Check for expired keys every 10 minutes
  useClones: false,
  deleteOnExpire: true
});

// Cache middleware factory
export const cacheMiddleware = (duration = 300, keyGenerator = null) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator ? keyGenerator(req) : `${req.originalUrl}`;

    // Check if data exists in cache
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: 'Data retrieved from cache',
        data: cachedData,
        cached: true
      });
    }

    // Store original send method
    const originalSend = res.json;

    // Override res.json to cache the response
    res.json = function(data) {
      if (data.success && data.data) {
        cache.set(cacheKey, data.data, duration);
      }
      return originalSend.call(this, data);
    };

    next();
  };
};

// Cache invalidation middleware
export const invalidateCache = (patterns = []) => {
  return (req, res, next) => {
    // Store original send method
    const originalSend = res.json;

    // Override res.json to invalidate cache after successful operations
    res.json = function(data) {
      if (data.success) {
        // Invalidate cache based on patterns
        patterns.forEach(pattern => {
          const keys = cache.keys();
          keys.forEach(key => {
            if (key.includes(pattern)) {
              cache.del(key);
            }
          });
        });
      }
      return originalSend.call(this, data);
    };

    next();
  };
};

// Specific cache middlewares for different endpoints
export const cacheRecyclingItems = cacheMiddleware(600, (req) => {
  const { category, search } = req.query;
  return `recycling-items:${category || 'all'}:${search || 'none'}`;
});

export const cachePostedItems = cacheMiddleware(300, (req) => {
  const { category, status } = req.query;
  return `posted-items:${category || 'all'}:${status || 'all'}`;
});

export const cacheUserProfile = cacheMiddleware(1800, (req) => {
  return `user-profile:${req.user?.id}`;
});

export const cacheDashboard = cacheMiddleware(300, (req) => {
  return `dashboard:${req.user?.role}:${req.user?.id}`;
});

// Cache statistics
export const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    keyspace: cache.keys()
  };
};

// Clear all cache
export const clearAllCache = () => {
  cache.flushAll();
};

// Clear cache by pattern
export const clearCacheByPattern = (pattern) => {
  const keys = cache.keys();
  keys.forEach(key => {
    if (key.includes(pattern)) {
      cache.del(key);
    }
  });
};

// Cache warming function
export const warmCache = async (key, data, ttl = 300) => {
  cache.set(key, data, ttl);
};

// Cache middleware for API responses
export const apiCache = (duration = 300) => {
  return (req, res, next) => {
    // Skip caching for authenticated requests that modify data
    if (req.user && ['POST', 'PUT', 'DELETE'].includes(req.method)) {
      return next();
    }

    const cacheKey = `api:${req.originalUrl}:${JSON.stringify(req.query)}`;
    
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        message: 'Cached response',
        data: cachedData,
        cached: true,
        timestamp: new Date().toISOString()
      });
    }

    const originalSend = res.json;
    res.json = function(data) {
      if (data.success && data.data) {
        cache.set(cacheKey, data.data, duration);
      }
      return originalSend.call(this, data);
    };

    next();
  };
};

// Export cache instance for direct access
export default cache; 