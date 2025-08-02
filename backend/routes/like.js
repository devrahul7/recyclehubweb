import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  toggleLike,
  getUserLikes,
  getItemLikes,
  checkUserLike,
  getAllLikes
} from '../controllers/likeController.js';

const router = express.Router();

router.post('/:itemId/toggle', authenticateToken, toggleLike);
router.get('/user', authenticateToken, getUserLikes);
router.get('/all', authenticateToken, getAllLikes);
router.get('/item/:itemId', getItemLikes);
router.get('/check/:itemId', authenticateToken, checkUserLike);

export default router;