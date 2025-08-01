import express from 'express';
import { createItem, getUserItems, getAllItems, getPublicItems, updateItemStatus, deleteItem, updateItem } from '../controllers/itemController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('image'), createItem);
router.get('/my-items', authenticateToken, getUserItems);
router.get('/all', authenticateToken, requireAdmin, getAllItems);
router.get('/', getPublicItems);
router.put('/:id/status', authenticateToken, requireAdmin, updateItemStatus);
router.put('/:id', authenticateToken, upload.single('image'), updateItem);
router.delete('/:id', authenticateToken, deleteItem);

export default router;