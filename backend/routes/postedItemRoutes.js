import express from 'express';
import {
  getAllPostedItems,
  getPostedItemById,
  createPostedItem,
  updatePostedItem,
  deletePostedItem,
  getUserPostedItems,
  searchPostedItems,
  getPostedItemStats
} from '../controllers/postedItemController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllPostedItems);
router.get('/search', searchPostedItems);
router.get('/stats', getPostedItemStats);
router.get('/:id', getPostedItemById);

// Protected routes
router.post('/', authenticateToken, createPostedItem);
router.get('/user/items', authenticateToken, getUserPostedItems);
router.put('/:id', authenticateToken, updatePostedItem);
router.delete('/:id', authenticateToken, deletePostedItem);

export default router; 