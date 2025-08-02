import User from './User.js';
import Item from './Item.js';
import Like from './Like.js';
import Review from './Review.js';
import Category from './Category.js';
import Notification from './Notification.js';
import Transaction from './Transaction.js';

// User associations
User.hasMany(Item, { foreignKey: 'userId', as: 'items' });
User.hasMany(Like, { foreignKey: 'userId', as: 'likes' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });

// Item associations
Item.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Item.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Item.hasMany(Like, { foreignKey: 'itemId', as: 'itemLikes' });
Item.hasMany(Review, { foreignKey: 'itemId', as: 'itemReviews' });
Item.hasMany(Transaction, { foreignKey: 'itemId', as: 'itemTransactions' });

// Category associations
Category.hasMany(Item, { foreignKey: 'categoryId', as: 'categoryItems' });

// Like associations
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Like.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

// Review associations
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Review.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

// Notification associations
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Transaction associations
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(Item, { foreignKey: 'itemId', as: 'item' });

export {
  User,
  Item,
  Like,
  Review,
  Category,
  Notification,
  Transaction
};