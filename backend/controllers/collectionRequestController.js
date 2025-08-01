import { CollectionRequest, CollectionRequestItem, User, PostedItem, RecyclingItem, Notification } from '../models/index.js';
import { Op } from 'sequelize';

// Get all collection requests (with filters)
export const getAllCollectionRequests = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      requestType, 
      userId,
      collectorId 
    } = req.query;
    
    const offset = (page - 1) * limit;
    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (requestType) whereClause.requestType = requestType;
    if (userId) whereClause.userId = userId;
    if (collectorId) whereClause.collectorId = collectorId;
    
    const { count, rows } = await CollectionRequest.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone']
        },
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'phone', 'rating']
        },
        {
          model: CollectionRequestItem,
          as: 'items',
          include: [
            {
              model: PostedItem,
              as: 'postedItem'
            },
            {
              model: RecyclingItem,
              as: 'recyclingItem'
            }
          ]
        }
      ],
      order: [['requestDate', 'DESC']],
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
    console.error('Error fetching collection requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection requests',
      error: error.message
    });
  }
};

// Get collection request by ID
export const getCollectionRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const request = await CollectionRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'email', 'phone', 'address']
        },
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'phone', 'rating']
        },
        {
          model: CollectionRequestItem,
          as: 'items',
          include: [
            {
              model: PostedItem,
              as: 'postedItem'
            },
            {
              model: RecyclingItem,
              as: 'recyclingItem'
            }
          ]
        }
      ]
    });
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching collection request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection request',
      error: error.message
    });
  }
};

// Create collection request from wishlist items
export const createCollectionRequestFromWishlist = async (req, res) => {
  try {
    const { items, preferredPickupDate, notes } = req.body;
    const userId = req.user.id;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    let totalEstimatedValue = 0;
    const requestItems = [];
    
    // Calculate total value and prepare items
    for (const item of items) {
      const recyclingItem = await RecyclingItem.findByPk(item.recyclingItemId);
      if (!recyclingItem) {
        return res.status(404).json({
          success: false,
          message: `Recycling item ${item.recyclingItemId} not found`
        });
      }
      
      const itemValue = parseFloat(item.quantity) * parseFloat(item.pricePerUnit || 0);
      totalEstimatedValue += itemValue;
      
      requestItems.push({
        recyclingItemId: item.recyclingItemId,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        estimatedValue: itemValue,
        condition: item.condition,
        notes: item.notes
      });
    }
    
    // Create collection request
    const collectionRequest = await CollectionRequest.create({
      requestType: 'browsed_items',
      status: 'Pending',
      totalEstimatedValue,
      preferredPickupDate,
      userName: user.fullName,
      userAddress: user.address,
      userCity: user.city,
      userPhone: user.phone,
      userEmail: user.email,
      userId
    });
    
    // Create collection request items
    for (const item of requestItems) {
      await CollectionRequestItem.create({
        ...item,
        collectionRequestId: collectionRequest.id
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Collection request created successfully',
      data: collectionRequest
    });
  } catch (error) {
    console.error('Error creating collection request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create collection request',
      error: error.message
    });
  }
};

// Update collection request status (Collector/Admin)
export const updateCollectionRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, estimatedCollectionDate } = req.body;
    const collectorId = req.user.id;
    
    const request = await CollectionRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }
    
    const collector = await User.findByPk(collectorId);
    if (!collector) {
      return res.status(404).json({
        success: false,
        message: 'Collector not found'
      });
    }
    
    // Update status history
    const statusHistory = request.statusHistory || [];
    statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      message: notes || `Status changed to ${status}`,
      changedBy: collector.fullName
    });
    
    const updateData = {
      status,
      statusHistory
    };
    
    if (status === 'Accepted') {
      updateData.collectorId = collectorId;
      updateData.collectorName = collector.fullName;
      updateData.collectorPhone = collector.phone;
      updateData.collectorRating = collector.rating;
      updateData.estimatedCollectionDate = estimatedCollectionDate;
    }
    
    if (status === 'Completed') {
      updateData.actualCollectionDate = new Date();
    }
    
    await request.update(updateData);
    
    // Create notification for user
    await Notification.create({
      title: `Collection Request ${status}`,
      message: `Your collection request has been ${status.toLowerCase()}. ${notes || ''}`,
      type: 'collection_request',
      userId: request.userId,
      collectionRequestId: request.id
    });
    
    res.status(200).json({
      success: true,
      message: 'Collection request status updated successfully',
      data: request
    });
  } catch (error) {
    console.error('Error updating collection request status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update collection request status',
      error: error.message
    });
  }
};

// Complete collection with actual values
export const completeCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, actualValue, collectionNotes } = req.body;
    const collectorId = req.user.id;
    
    const request = await CollectionRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }
    
    // Update collection request
    await request.update({
      status: 'Completed',
      actualValue,
      collectionNotes,
      actualCollectionDate: new Date(),
      paymentStatus: 'Paid',
      paymentAmount: actualValue,
      paymentDate: new Date()
    });
    
    // Update collection request items with actual values
    for (const item of items) {
      const requestItem = await CollectionRequestItem.findByPk(item.id);
      if (requestItem) {
        await requestItem.update({
          actualValue: item.actualValue,
          notes: item.notes
        });
      }
    }
    
    // Update user statistics
    const user = await User.findByPk(request.userId);
    if (user) {
      await user.update({
        totalRecycledItems: (user.totalRecycledItems || 0) + 1,
        totalRecycledValue: (user.totalRecycledValue || 0) + parseFloat(actualValue),
        lastActivity: new Date()
      });
    }
    
    // Update collector statistics
    const collector = await User.findByPk(collectorId);
    if (collector) {
      await collector.update({
        totalCollections: (collector.totalCollections || 0) + 1,
        totalEarnings: (collector.totalEarnings || 0) + parseFloat(actualValue),
        lastActivity: new Date()
      });
    }
    
    // Create notification
    await Notification.create({
      title: 'Collection Completed',
      message: `Your collection has been completed. Amount: Rs. ${actualValue}`,
      type: 'payment',
      userId: request.userId,
      collectionRequestId: request.id
    });
    
    res.status(200).json({
      success: true,
      message: 'Collection completed successfully',
      data: request
    });
  } catch (error) {
    console.error('Error completing collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete collection',
      error: error.message
    });
  }
};

// Get user's collection requests
export const getUserCollectionRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    const whereClause = { userId };
    if (status) whereClause.status = status;
    
    const requests = await CollectionRequest.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'phone', 'rating']
        },
        {
          model: CollectionRequestItem,
          as: 'items'
        }
      ],
      order: [['requestDate', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching user collection requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user collection requests',
      error: error.message
    });
  }
};

// Get collector's assigned requests
export const getCollectorRequests = async (req, res) => {
  try {
    const collectorId = req.user.id;
    const { status } = req.query;
    
    const whereClause = { collectorId };
    if (status) whereClause.status = status;
    
    const requests = await CollectionRequest.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'phone', 'address']
        },
        {
          model: CollectionRequestItem,
          as: 'items'
        }
      ],
      order: [['requestDate', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching collector requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collector requests',
      error: error.message
    });
  }
};

// Cancel collection request
export const cancelCollectionRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const request = await CollectionRequest.findByPk(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Collection request not found'
      });
    }
    
    // Check if user owns this request or is admin
    if (request.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this request'
      });
    }
    
    await request.update({
      status: 'Cancelled',
      statusHistory: [
        ...(request.statusHistory || []),
        {
          status: 'Cancelled',
          timestamp: new Date().toISOString(),
          message: 'Request cancelled by user'
        }
      ]
    });
    
    res.status(200).json({
      success: true,
      message: 'Collection request cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling collection request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel collection request',
      error: error.message
    });
  }
};

// Get collection statistics
export const getCollectionStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let whereClause = {};
    if (userRole === 'user') {
      whereClause.userId = userId;
    } else if (userRole === 'collector') {
      whereClause.collectorId = userId;
    }
    
    const stats = await CollectionRequest.findAll({
      where: whereClause,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalEstimatedValue')), 'totalEstimatedValue'],
        [sequelize.fn('SUM', sequelize.col('actualValue')), 'totalActualValue']
      ],
      group: ['status']
    });
    
    const totalRequests = await CollectionRequest.count({ where: whereClause });
    const totalEstimatedValue = await CollectionRequest.sum('totalEstimatedValue', { where: whereClause });
    const totalActualValue = await CollectionRequest.sum('actualValue', { where: whereClause });
    
    res.status(200).json({
      success: true,
      data: {
        stats,
        totalRequests,
        totalEstimatedValue: totalEstimatedValue || 0,
        totalActualValue: totalActualValue || 0
      }
    });
  } catch (error) {
    console.error('Error fetching collection stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collection statistics',
      error: error.message
    });
  }
}; 