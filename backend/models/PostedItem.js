import { DataTypes } from 'sequelize';
import { sequelize } from '../database/db.js';

const PostedItem = sequelize.define('PostedItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'item_name',
    validate: {
      len: [2, 200],
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
  quantity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('Excellent', 'Good', 'Fair', 'Poor'),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 500],
      notEmpty: true
    }
  },
  contactNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'contact_number'
  },
  preferredPickupDate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'preferred_pickup_date'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedValue: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    field: 'estimated_value'
  },
  status: {
    type: DataTypes.ENUM('Posted', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected'),
    allowNull: false,
    defaultValue: 'Posted'
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  postedBy: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'posted_by'
  },
  userContact: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'user_contact'
  },
  datePosted: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'date_posted'
  },
  // Foreign key to User
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  underscored: true,
  tableName: 'posted_items'
});

export default PostedItem; 