import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './config/database.js';
import './models/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import itemRoutes from './routes/item.js';
import likeRoutes from './routes/like.js';
import reviewRoutes from './routes/review.js';
import categoryRoutes from './routes/category.js';
import notificationRoutes from './routes/notification.js';
import transactionRoutes from './routes/transaction.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/transactions', transactionRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Recycle Management System API' });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');
    
    await sequelize.sync({ force: false });
    console.log('Database synced');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

startServer();