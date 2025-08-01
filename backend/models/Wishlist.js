import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const Wishlist = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.00
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  // Foreign keys
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  recyclingItemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'recycling_item_id',
    references: {
      model: 'recycling_items',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'wishlists'
});

export default Wishlist; 