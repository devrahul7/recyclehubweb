import express from 'express';
import {
  getUserWishlist,
  addToWishlist,
  updateWishlistItem,
  removeFromWishlist,
  clearWishlist,
  checkWishlistItem,
  getWishlistStats,
  searchWishlist
} from '../controllers/wishlistController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Protected routes
router.get('/', authenticateToken, getUserWishlist);
router.get('/stats', authenticateToken, getWishlistStats);
router.get('/search', authenticateToken, searchWishlist);
router.get('/check/:itemId', authenticateToken, checkWishlistItem);
router.post('/', authenticateToken, addToWishlist);
router.put('/:id', authenticateToken, updateWishlistItem);
router.delete('/:id', authenticateToken, removeFromWishlist);
router.delete('/', authenticateToken, clearWishlist);

export default router; 