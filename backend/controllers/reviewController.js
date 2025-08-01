import Review from '../models/Review.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import { sequelize } from '../config/database.js';

export const createReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { itemId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const existingReview = await Review.findOne({
      where: { userId, itemId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const review = await Review.create({
      userId,
      itemId,
      rating,
      comment
    }, { transaction });

    await Item.increment('reviewsCount', { 
      where: { id: itemId },
      transaction 
    });

    const reviews = await Review.findAll({
      where: { itemId },
      attributes: ['rating']
    });
    
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Item.update(
      { averageRating: averageRating.toFixed(2) },
      { where: { id: itemId }, transaction }
    );

    await transaction.commit();

    const newReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    res.status(201).json(newReview);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getItemReviews = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { itemId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [[sortBy, 'DESC']]
    });

    res.json({
      reviews: reviews.rows,
      totalPages: Math.ceil(reviews.count / limit),
      currentPage: parseInt(page),
      totalReviews: reviews.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
      where: { userId },
      include: [{
        model: Item,
        as: 'item',
        attributes: ['id', 'title', 'image']
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      reviews: reviews.rows,
      totalPages: Math.ceil(reviews.count / limit),
      currentPage: parseInt(page),
      totalReviews: reviews.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const reviews = await Review.findAndCountAll({
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
      reviews: reviews.rows,
      totalPages: Math.ceil(reviews.count / limit),
      currentPage: parseInt(page),
      totalReviews: reviews.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id, userId }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    await review.update({ rating, comment }, { transaction });

    const reviews = await Review.findAll({
      where: { itemId: review.itemId },
      attributes: ['rating']
    });
    
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Item.update(
      { averageRating: averageRating.toFixed(2) },
      { where: { id: review.itemId }, transaction }
    );

    await transaction.commit();

    const updatedReview = await Review.findByPk(review.id, {
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name']
      }]
    });

    res.json(updatedReview);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await Review.findOne({
      where: { id, userId }
    });

    if (!review) {
      return res.status(404).json({ message: 'Review not found or unauthorized' });
    }

    const itemId = review.itemId;
    await review.destroy({ transaction });

    await Item.decrement('reviewsCount', { 
      where: { id: itemId },
      transaction 
    });

    const remainingReviews = await Review.findAll({
      where: { itemId },
      attributes: ['rating']
    });
    
    const averageRating = remainingReviews.length > 0 
      ? remainingReviews.reduce((sum, review) => sum + review.rating, 0) / remainingReviews.length
      : 0;
    
    await Item.update(
      { averageRating: averageRating.toFixed(2) },
      { where: { id: itemId }, transaction }
    );

    await transaction.commit();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markReviewHelpful = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await review.update({ isHelpful: !review.isHelpful });
    res.json({ message: 'Review helpfulness updated', isHelpful: review.isHelpful });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};