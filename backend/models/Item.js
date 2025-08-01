import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Category from './Category.js';

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id'
    }
  },
  weight: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estimatedValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  finalValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  }
}, {
  tableName: 'items',
  timestamps: true
});



export default Item;