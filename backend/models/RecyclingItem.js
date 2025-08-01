import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const RecyclingItem = sequelize.define('RecyclingItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itemId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'item_id'
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100],
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.ENUM('Paper', 'Glass and Plastic', 'Metal & Steel', 'E-waste', 'Brass', 'Others'),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'price_per_unit'
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'is_active'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: 'sort_order'
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'recycling_items'
});

export default RecyclingItem; 