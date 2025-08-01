import User from './User.js';
import RecyclingItem from './RecyclingItem.js';
import PostedItem from './PostedItem.js';
import CollectionRequest from './CollectionRequest.js';
import CollectionRequestItem from './CollectionRequestItem.js';
import Review from './Review.js';
import Notification from './Notification.js';
import Wishlist from './Wishlist.js';

// Define associations

// User associations
User.hasMany(PostedItem, { foreignKey: 'userId', as: 'postedItems' });
User.hasMany(CollectionRequest, { foreignKey: 'userId', as: 'collectionRequests' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });

// Collector associations (User as collector)
User.hasMany(CollectionRequest, { foreignKey: 'collectorId', as: 'assignedCollections' });
User.hasMany(Review, { foreignKey: 'collectorId', as: 'receivedReviews' });

// RecyclingItem associations
RecyclingItem.hasMany(CollectionRequestItem, { foreignKey: 'recyclingItemId', as: 'collectionRequestItems' });
RecyclingItem.hasMany(Wishlist, { foreignKey: 'recyclingItemId', as: 'wishlistItems' });

// PostedItem associations
PostedItem.belongsTo(User, { foreignKey: 'userId', as: 'user' });
PostedItem.hasMany(CollectionRequestItem, { foreignKey: 'postedItemId', as: 'collectionRequestItems' });

// CollectionRequest associations
CollectionRequest.belongsTo(User, { foreignKey: 'userId', as: 'user' });
CollectionRequest.belongsTo(User, { foreignKey: 'collectorId', as: 'collector' });
CollectionRequest.hasMany(CollectionRequestItem, { foreignKey: 'collectionRequestId', as: 'items' });
CollectionRequest.hasMany(Review, { foreignKey: 'collectionRequestId', as: 'reviews' });
CollectionRequest.hasMany(Notification, { foreignKey: 'collectionRequestId', as: 'notifications' });

// CollectionRequestItem associations
CollectionRequestItem.belongsTo(CollectionRequest, { foreignKey: 'collectionRequestId', as: 'collectionRequest' });
CollectionRequestItem.belongsTo(PostedItem, { foreignKey: 'postedItemId', as: 'postedItem' });
CollectionRequestItem.belongsTo(RecyclingItem, { foreignKey: 'recyclingItemId', as: 'recyclingItem' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(User, { foreignKey: 'collectorId', as: 'collector' });
Review.belongsTo(CollectionRequest, { foreignKey: 'collectionRequestId', as: 'collectionRequest' });
Review.hasMany(Notification, { foreignKey: 'reviewId', as: 'notifications' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Notification.belongsTo(CollectionRequest, { foreignKey: 'collectionRequestId', as: 'collectionRequest' });
Notification.belongsTo(Review, { foreignKey: 'reviewId', as: 'review' });

// Wishlist associations
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Wishlist.belongsTo(RecyclingItem, { foreignKey: 'recyclingItemId', as: 'recyclingItem' });

export {
  User,
  RecyclingItem,
  PostedItem,
  CollectionRequest,
  CollectionRequestItem,
  Review,
  Notification,
  Wishlist
}; 