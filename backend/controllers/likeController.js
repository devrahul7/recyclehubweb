import Like from '../models/Like.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { sequelize } from '../config/database.js';

export const toggleLike = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const existingLike = await Like.findOne({
      where: { userId, itemId }
    });

    if (existingLike) {
      await existingLike.destroy({ transaction });
      await Item.decrement('likesCount', { 
        where: { id: itemId },
        transaction 
      });
      
      await transaction.commit();
      return res.json({ 
        success: true, 
        liked: false, 
        message: 'Like removed' 
      });
    } else {
      await Like.create({ userId, itemId }, { transaction });
      await Item.increment('likesCount', { 
        where: { id: itemId },
        transaction 
      });
      
      await transaction.commit();
      return res.json({ 
        success: true, 
        liked: true, 
        message: 'Item liked' 
      });
    }
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserLikes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const likes = await Like.findAndCountAll({
      where: { userId },
      include: [{
        model: Item,
        as: 'item',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }]
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      likes: likes.rows,
      totalPages: Math.ceil(likes.count / limit),
      currentPage: parseInt(page),
      totalLikes: likes.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getItemLikes = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const likes = await Like.findAndCountAll({
      where: { itemId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      likes: likes.rows,
      totalPages: Math.ceil(likes.count / limit),
      currentPage: parseInt(page),
      totalLikes: likes.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkUserLike = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const like = await Like.findOne({
      where: { userId, itemId }
    });

    res.json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllLikes = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const likes = await Like.findAndCountAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        },
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'image']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      likes: likes.rows,
      totalPages: Math.ceil(likes.count / limit),
      currentPage: parseInt(page),
      totalLikes: likes.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};