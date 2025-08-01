import { Review, User, CollectionRequest } from '../models/index.js';
import { Op } from 'sequelize';

// Get all reviews (with filters)
export const getAllReviews = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      collectorId, 
      userId, 
      rating,
      isVerified 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = { isActive: true };
    
    if (collectorId) whereClause.collectorId = collectorId;
    if (userId) whereClause.userId = userId;
    if (rating) whereClause.rating = rating;
    if (isVerified !== undefined) whereClause.isVerified = isVerified;
    
    const { count, rows } = await Review.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        },
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'rating']
        },
        {
          model: CollectionRequest,
          as: 'collectionRequest',
          attributes: ['id', 'requestDate']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// Get review by ID
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const review = await Review.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        },
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'rating']
        },
        {
          model: CollectionRequest,
          as: 'collectionRequest',
          attributes: ['id', 'requestDate', 'status']
        }
      ]
    });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review',
      error: error.message
    });
  }
};

// Create new review
export const createReview = async (req, res) => {
  try {
    const {
      collectorId,
      rating,
      comment,
      isAnonymous,
      collectionRequestId
    } = req.body;
    
    const userId = req.user.id;
    
    // Check if collector exists
    const collector = await User.findByPk(collectorId);
    if (!collector || collector.role !== 'collector') {
      return res.status(404).json({
        success: false,
        message: 'Collector not found'
      });
    }
    
    // Check if user has already reviewed this collector
    const existingReview = await Review.findOne({
      where: {
        userId,
        collectorId,
        isActive: true
      }
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this collector'
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    const review = await Review.create({
      userId,
      collectorId,
      rating,
      comment,
      isAnonymous,
      collectionRequestId
    });
    
    // Update collector's average rating
    const allReviews = await Review.findAll({
      where: {
        collectorId,
        isActive: true
      }
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / allReviews.length;
    
    await collector.update({ rating: averageRating });
    
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message
    });
  }
};

// Update review
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, isAnonymous } = req.body;
    const userId = req.user.id;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user owns this review or is admin
    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    await review.update({
      rating,
      comment,
      isAnonymous
    });
    
    // Update collector's average rating
    const collector = await User.findByPk(review.collectorId);
    if (collector) {
      const allReviews = await Review.findAll({
        where: {
          collectorId: review.collectorId,
          isActive: true
        }
      });
      
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / allReviews.length;
      
      await collector.update({ rating: averageRating });
    }
    
    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message
    });
  }
};

// Delete review
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Check if user owns this review or is admin
    if (review.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await review.update({ isActive: false });
    
    // Update collector's average rating
    const collector = await User.findByPk(review.collectorId);
    if (collector) {
      const allReviews = await Review.findAll({
        where: {
          collectorId: review.collectorId,
          isActive: true
        }
      });
      
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
      
      await collector.update({ rating: averageRating });
    }
    
    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message
    });
  }
};

// Get reviews by collector
export const getReviewsByCollector = async (req, res) => {
  try {
    const { collectorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Review.findAndCountAll({
      where: {
        collectorId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        },
        {
          model: CollectionRequest,
          as: 'collectionRequest',
          attributes: ['id', 'requestDate']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews by collector:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews by collector',
      error: error.message
    });
  }
};

// Get user's reviews
export const getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await Review.findAndCountAll({
      where: {
        userId,
        isActive: true
      },
      include: [
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'rating']
        },
        {
          model: CollectionRequest,
          as: 'collectionRequest',
          attributes: ['id', 'requestDate', 'status']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user reviews',
      error: error.message
    });
  }
};

// Verify review (Admin only)
export const verifyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;
    
    const review = await Review.findByPk(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    await review.update({ isVerified });
    
    res.status(200).json({
      success: true,
      message: `Review ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: review
    });
  } catch (error) {
    console.error('Error verifying review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify review',
      error: error.message
    });
  }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
  try {
    const { collectorId } = req.params;
    
    const stats = await Review.findAll({
      where: {
        collectorId,
        isActive: true
      },
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['rating'],
      order: [['rating', 'ASC']]
    });
    
    const totalReviews = await Review.count({
      where: {
        collectorId,
        isActive: true
      }
    });
    
    const verifiedReviews = await Review.count({
      where: {
        collectorId,
        isActive: true,
        isVerified: true
      }
    });
    
    const averageRating = await Review.findOne({
      where: {
        collectorId,
        isActive: true
      },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ]
    });
    
    res.status(200).json({
      success: true,
      data: {
        stats,
        totalReviews,
        verifiedReviews,
        averageRating: parseFloat(averageRating?.dataValues?.averageRating || 0).toFixed(2)
      }
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review statistics',
      error: error.message
    });
  }
}; 