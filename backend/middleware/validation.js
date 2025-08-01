import Joi from 'joi';

// Validation schemas
const userRegistrationSchema = Joi.object({
  fullName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.string().min(10).required(),
  role: Joi.string().valid('user', 'collector', 'admin').default('user')
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const recyclingItemSchema = Joi.object({
  itemId: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid('Paper', 'Glass and Plastic', 'Metal & Steel', 'E-waste', 'Brass', 'Others').required(),
  description: Joi.string().min(10).max(500).required(),
  price: Joi.number().positive().required(),
  image: Joi.string().uri().optional(),
  sortOrder: Joi.number().integer().min(0).default(0),
  isActive: Joi.boolean().default(true)
});

const postedItemSchema = Joi.object({
  itemName: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid('Paper', 'Glass and Plastic', 'Metal & Steel', 'E-waste', 'Brass', 'Others').required(),
  description: Joi.string().min(10).max(500).required(),
  quantity: Joi.number().positive().required(),
  condition: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor').required(),
  location: Joi.string().min(10).required(),
  contactNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  preferredPickupDate: Joi.date().min('now').required(),
  notes: Joi.string().max(500).optional(),
  estimatedValue: Joi.number().positive().required(),
  images: Joi.array().items(Joi.string().uri()).optional()
});

const collectionRequestSchema = Joi.object({
  requestType: Joi.string().valid('user_posted', 'browsed_items', 'scheduled').required(),
  preferredPickupDate: Joi.date().min('now').required(),
  collectionNotes: Joi.string().max(500).optional(),
  items: Joi.array().items(Joi.object({
    recyclingItemId: Joi.number().integer().positive().optional(),
    postedItemId: Joi.number().integer().positive().optional(),
    quantity: Joi.number().positive().required(),
    pricePerUnit: Joi.number().positive().required(),
    condition: Joi.string().valid('Excellent', 'Good', 'Fair', 'Poor').optional(),
    notes: Joi.string().max(200).optional()
  })).min(1).required()
});

const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().min(10).max(500).required(),
  isAnonymous: Joi.boolean().default(false),
  collectionRequestId: Joi.number().integer().positive().required()
});

const wishlistItemSchema = Joi.object({
  recyclingItemId: Joi.number().integer().positive().required(),
  quantity: Joi.number().positive().default(1),
  notes: Joi.string().max(200).optional()
});

const notificationSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  message: Joi.string().min(5).max(500).required(),
  type: Joi.string().valid('info', 'success', 'warning', 'error', 'collection_request', 'payment', 'review').required(),
  actionUrl: Joi.string().uri().optional(),
  actionText: Joi.string().max(50).optional(),
  userId: Joi.number().integer().positive().required()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.details[0].message
      });
    }
    
    req.validatedData = value;
    next();
  };
};

// Query validation middleware
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query);
    
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query validation error',
        error: error.details[0].message
      });
    }
    
    req.validatedQuery = value;
    next();
  };
};

// Common query schemas
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'price', 'status').default('createdAt'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

const searchSchema = Joi.object({
  q: Joi.string().min(1).max(100).optional(),
  category: Joi.string().optional(),
  status: Joi.string().optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  priceMin: Joi.number().positive().optional(),
  priceMax: Joi.number().positive().optional()
});

export {
  validate,
  validateQuery,
  userRegistrationSchema,
  userLoginSchema,
  recyclingItemSchema,
  postedItemSchema,
  collectionRequestSchema,
  reviewSchema,
  wishlistItemSchema,
  notificationSchema,
  paginationSchema,
  searchSchema
};