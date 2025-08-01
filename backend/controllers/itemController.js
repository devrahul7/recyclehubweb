import Item from '../models/Item.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const createItem = async (req, res) => {
  try {
    const { title, description, category, weight, estimatedValue } = req.body;
    const image = req.file ? req.file.filename : null;

    const item = await Item.create({
      title,
      description,
      category,
      weight,
      estimatedValue,
      image,
      userId: req.user.id
    });

    res.status(201).json({
      message: 'Item created successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPublicItems = async (req, res) => {
  try {
    const { status = 'approved', search = '', sortBy = 'newest', page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = { status };
    
    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`
      };
    }

    let orderClause;
    switch (sortBy) {
      case 'oldest':
        orderClause = [['createdAt', 'ASC']];
        break;
      case 'mostLiked':
        orderClause = [['likesCount', 'DESC']];
        break;
      case 'newest':
      default:
        orderClause = [['createdAt', 'DESC']];
        break;
    }

    const items = await Item.findAndCountAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: orderClause
    });

    res.json({
      items: items.rows,
      totalPages: Math.ceil(items.count / limit),
      currentPage: parseInt(page),
      totalItems: items.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await item.update({ status, adminNotes });

    res.json({
      message: 'Item status updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (req.user.role === 'user' && item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await item.destroy();
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, weight, estimatedValue } = req.body;
    
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const image = req.file ? req.file.filename : item.image;

    await item.update({
      title,
      description,
      category,
      weight,
      estimatedValue,
      image
    });

    res.json({
      message: 'Item updated successfully',
      item
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};