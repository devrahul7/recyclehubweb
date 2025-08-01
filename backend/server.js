import express from 'express';
import { connectDB } from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import recyclingItemRoutes from './routes/recyclingItemRoutes.js';
import postedItemRoutes from './routes/postedItemRoutes.js';
import collectionRequestRoutes from './routes/collectionRequestRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import userRoutes from './routes/userRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import './models/index.js';
import { seedRecyclingItems } from './seeders/recyclingItemsSeeder.js';

// Import middleware
import {
  securityHeaders,
  corsOptions,
  requestLogger,
  errorLogger,
  performanceLogger,
  securityLogger,
  generalLimiter,
  errorHandler,
  notFound
} from './middleware/index.js';

const app = express();
const PORT = 5000;

// Apply security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply logging and monitoring middleware
app.use(requestLogger);
app.use(performanceLogger);
app.use(securityLogger);

// Apply rate limiting
app.use(generalLimiter);

// API Routes
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/recycling-items', recyclingItemRoutes);
app.use('/api/posted-items', postedItemRoutes);
app.use('/api/collection-requests', collectionRequestRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorLogger);
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    await seedRecyclingItems();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
