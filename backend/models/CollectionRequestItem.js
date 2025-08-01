import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const CollectionRequestItem = sequelize.define('CollectionRequestItem', {
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
  pricePerUnit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'price_per_unit'
  },
  estimatedValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    field: 'estimated_value'
  },
  actualValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'actual_value'
  },
  condition: {
    type: DataTypes.ENUM('Excellent', 'Good', 'Fair', 'Poor'),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Foreign keys
  collectionRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'collection_request_id',
    references: {
      model: 'collection_requests',
      key: 'id'
    }
  },
  postedItemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'posted_item_id',
    references: {
      model: 'posted_items',
      key: 'id'
    }
  },
  recyclingItemId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'recycling_item_id',
    references: {
      model: 'recycling_items',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'collection_request_items'
});

export default CollectionRequestItem; 