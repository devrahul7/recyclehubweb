import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Item from './Item.js';

const Like = sequelize.define('Like', {
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
  }
}, {
  tableName: 'likes',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'itemId']
    }
  ]
});



export default Like;