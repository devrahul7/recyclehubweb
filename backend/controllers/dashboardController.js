import { User, CollectionRequest, PostedItem, Review, Notification, RecyclingItem } from '../models/index.js';
import { Op } from 'sequelize';

// Get user dashboard data
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get recent activities
    const recentPostedItems = await PostedItem.findAll({
      where: { userId },
      order: [['datePosted', 'DESC']],
      limit: 5
    });
    
    const recentCollectionRequests = await CollectionRequest.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName', 'phone', 'rating']
        }
      ],
      order: [['requestDate', 'DESC']],
      limit: 5
    });
    
    const recentReviews = await Review.findAll({
      where: { userId },
      include: [
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Get statistics
    const totalPostedItems = await PostedItem.count({ where: { userId } });
    const totalCollectionRequests = await CollectionRequest.count({ where: { userId } });
    const completedCollections = await CollectionRequest.count({
      where: { userId, status: 'Completed' }
    });
    const totalEarnings = await CollectionRequest.sum('actualValue', {
      where: { userId, status: 'Completed' }
    });
    
    // Get pending requests
    const pendingRequests = await CollectionRequest.count({
      where: { userId, status: 'Pending' }
    });
    
    // Get notifications count
    const unreadNotifications = await Notification.count({
      where: { userId, isRead: false, isActive: true }
    });
    
    res.status(200).json({
      success: true,
      data: {
        recentActivities: {
          postedItems: recentPostedItems,
          collectionRequests: recentCollectionRequests,
          reviews: recentReviews
        },
        statistics: {
          totalPostedItems,
          totalCollectionRequests,
          completedCollections,
          pendingRequests,
          totalEarnings: totalEarnings || 0,
          unreadNotifications
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user dashboard',
      error: error.message
    });
  }
};

// Get collector dashboard data
export const getCollectorDashboard = async (req, res) => {
  try {
    const collectorId = req.user.id;
    
    // Get recent collections
    const recentCollections = await CollectionRequest.findAll({
      where: { collectorId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName', 'phone', 'address']
        }
      ],
      order: [['requestDate', 'DESC']],
      limit: 5
    });
    
    // Get recent reviews
    const recentReviews = await Review.findAll({
      where: { collectorId, isActive: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Get statistics
    const totalCollections = await CollectionRequest.count({ where: { collectorId } });
    const completedCollections = await CollectionRequest.count({
      where: { collectorId, status: 'Completed' }
    });
    const pendingCollections = await CollectionRequest.count({
      where: { collectorId, status: 'Pending' }
    });
    const totalEarnings = await CollectionRequest.sum('actualValue', {
      where: { collectorId, status: 'Completed' }
    });
    
    // Get average rating
    const averageRating = await Review.findOne({
      where: { collectorId, isActive: true },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'averageRating']
      ]
    });
    
    // Get notifications count
    const unreadNotifications = await Notification.count({
      where: { userId: collectorId, isRead: false, isActive: true }
    });
    
    res.status(200).json({
      success: true,
      data: {
        recentActivities: {
          collections: recentCollections,
          reviews: recentReviews
        },
        statistics: {
          totalCollections,
          completedCollections,
          pendingCollections,
          totalEarnings: totalEarnings || 0,
          averageRating: parseFloat(averageRating?.dataValues?.averageRating || 0).toFixed(2),
          unreadNotifications
        }
      }
    });
  } catch (error) {
    console.error('Error fetching collector dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch collector dashboard',
      error: error.message
    });
  }
};

// Get admin dashboard data
export const getAdminDashboard = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.count({ where: { role: 'user', isActive: true } });
    const totalCollectors = await User.count({ where: { role: 'collector', isActive: true } });
    const totalAdmins = await User.count({ where: { role: 'admin', isActive: true } });
    
    // Get item statistics
    const totalPostedItems = await PostedItem.count();
    const totalCollectionRequests = await CollectionRequest.count();
    const completedCollections = await CollectionRequest.count({ where: { status: 'Completed' } });
    const pendingCollections = await CollectionRequest.count({ where: { status: 'Pending' } });
    
    // Get earnings statistics
    const totalEarnings = await CollectionRequest.sum('actualValue', {
      where: { status: 'Completed' }
    });
    const totalEstimatedValue = await CollectionRequest.sum('totalEstimatedValue', {
      where: { status: 'Pending' }
    });
    
    // Get recent activities
    const recentUsers = await User.findAll({
      where: { isActive: true },
      attributes: ['id', 'fullName', 'email', 'role', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    const recentCollections = await CollectionRequest.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        },
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['requestDate', 'DESC']],
      limit: 5
    });
    
    const recentReviews = await Review.findAll({
      where: { isActive: true },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'fullName']
        },
        {
          model: User,
          as: 'collector',
          attributes: ['id', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 5
    });
    
    // Get category statistics
    const categoryStats = await PostedItem.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });
    
    // Get monthly statistics
    const currentMonth = new Date();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    
    const monthlyCollections = await CollectionRequest.count({
      where: {
        createdAt: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });
    
    const monthlyEarnings = await CollectionRequest.sum('actualValue', {
      where: {
        status: 'Completed',
        actualCollectionDate: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });
    
    res.status(200).json({
      success: true,
      data: {
        statistics: {
          users: {
            total: totalUsers,
            collectors: totalCollectors,
            admins: totalAdmins
          },
          items: {
            posted: totalPostedItems,
            requests: totalCollectionRequests,
            completed: completedCollections,
            pending: pendingCollections
          },
          earnings: {
            total: totalEarnings || 0,
            pending: totalEstimatedValue || 0,
            monthly: monthlyEarnings || 0
          },
          monthly: {
            collections: monthlyCollections,
            earnings: monthlyEarnings || 0
          }
        },
        recentActivities: {
          users: recentUsers,
          collections: recentCollections,
          reviews: recentReviews
        },
        categoryStats
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard',
      error: error.message
    });
  }
};

// Get analytics data
export const getAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let startDate;
    const endDate = new Date();
    
    switch (period) {
      case 'week':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(endDate.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
    }
    
    let analytics = {};
    
    if (userRole === 'user') {
      // User analytics
      const postedItems = await PostedItem.count({
        where: {
          userId,
          datePosted: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const collectionRequests = await CollectionRequest.count({
        where: {
          userId,
          requestDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const earnings = await CollectionRequest.sum('actualValue', {
        where: {
          userId,
          status: 'Completed',
          actualCollectionDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      analytics = {
        postedItems,
        collectionRequests,
        earnings: earnings || 0
      };
    } else if (userRole === 'collector') {
      // Collector analytics
      const collections = await CollectionRequest.count({
        where: {
          collectorId: userId,
          requestDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const completedCollections = await CollectionRequest.count({
        where: {
          collectorId: userId,
          status: 'Completed',
          actualCollectionDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const earnings = await CollectionRequest.sum('actualValue', {
        where: {
          collectorId: userId,
          status: 'Completed',
          actualCollectionDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const reviews = await Review.count({
        where: {
          collectorId: userId,
          isActive: true,
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      });
      
      analytics = {
        collections,
        completedCollections,
        earnings: earnings || 0,
        reviews
      };
    } else if (userRole === 'admin') {
      // Admin analytics
      const newUsers = await User.count({
        where: {
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const newCollections = await CollectionRequest.count({
        where: {
          requestDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const completedCollections = await CollectionRequest.count({
        where: {
          status: 'Completed',
          actualCollectionDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const totalEarnings = await CollectionRequest.sum('actualValue', {
        where: {
          status: 'Completed',
          actualCollectionDate: { [Op.between]: [startDate, endDate] }
        }
      });
      
      const newReviews = await Review.count({
        where: {
          isActive: true,
          createdAt: { [Op.between]: [startDate, endDate] }
        }
      });
      
      analytics = {
        newUsers,
        newCollections,
        completedCollections,
        totalEarnings: totalEarnings || 0,
        newReviews
      };
    }
    
    res.status(200).json({
      success: true,
      data: {
        period,
        analytics
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
};

// Get chart data
export const getChartData = async (req, res) => {
  try {
    const { type, period = 'month' } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let chartData = {};
    
    if (type === 'earnings') {
      // Get earnings data for the last 12 months
      const months = [];
      const earnings = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        months.push(monthName);
        
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        let monthlyEarnings = 0;
        
        if (userRole === 'user') {
          monthlyEarnings = await CollectionRequest.sum('actualValue', {
            where: {
              userId,
              status: 'Completed',
              actualCollectionDate: { [Op.between]: [startOfMonth, endOfMonth] }
            }
          });
        } else if (userRole === 'collector') {
          monthlyEarnings = await CollectionRequest.sum('actualValue', {
            where: {
              collectorId: userId,
              status: 'Completed',
              actualCollectionDate: { [Op.between]: [startOfMonth, endOfMonth] }
            }
          });
        } else if (userRole === 'admin') {
          monthlyEarnings = await CollectionRequest.sum('actualValue', {
            where: {
              status: 'Completed',
              actualCollectionDate: { [Op.between]: [startOfMonth, endOfMonth] }
            }
          });
        }
        
        earnings.push(monthlyEarnings || 0);
      }
      
      chartData = { months, earnings };
    } else if (type === 'collections') {
      // Get collections data for the last 12 months
      const months = [];
      const collections = [];
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleString('default', { month: 'short' });
        months.push(monthName);
        
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        let monthlyCollections = 0;
        
        if (userRole === 'user') {
          monthlyCollections = await CollectionRequest.count({
            where: {
              userId,
              requestDate: { [Op.between]: [startOfMonth, endOfMonth] }
            }
          });
        } else if (userRole === 'collector') {
          monthlyCollections = await CollectionRequest.count({
            where: {
              collectorId: userId,
              requestDate: { [Op.between]: [startOfMonth, endOfMonth] }
            }
          });
        } else if (userRole === 'admin') {
          monthlyCollections = await CollectionRequest.count({
            where: {
              requestDate: { [Op.between]: [startOfMonth, endOfMonth] }
            }
          });
        }
        
        collections.push(monthlyCollections);
      }
      
      chartData = { months, collections };
    }
    
    res.status(200).json({
      success: true,
      data: chartData
    });
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chart data',
      error: error.message
    });
  }
}; 