import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Item from './Item.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Item,
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isHelpful: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'reviews',
  timestamps: true
});



export default Review;