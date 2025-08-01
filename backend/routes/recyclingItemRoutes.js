import express from 'express';
import {
  getAllRecyclingItems,
  getRecyclingItemById,
  createRecyclingItem,
  updateRecyclingItem,
  deleteRecyclingItem,
  getRecyclingItemsByCategory,
  searchRecyclingItems,
  getRecyclingItemCategories
} from '../controllers/recyclingItemController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllRecyclingItems);
router.get('/categories', getRecyclingItemCategories);
router.get('/category/:category', getRecyclingItemsByCategory);
router.get('/search', searchRecyclingItems);
router.get('/:id', getRecyclingItemById);

// Protected routes (admin only)
router.post('/', authenticateToken, createRecyclingItem);
router.put('/:id', authenticateToken, updateRecyclingItem);
router.delete('/:id', authenticateToken, deleteRecyclingItem);

export default router; 