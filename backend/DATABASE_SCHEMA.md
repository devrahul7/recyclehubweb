# Database Schema Documentation

## Overview
This document describes the database schema for the EcoSajha recycling platform. The schema is designed to support a three-tier user system (Users, Collectors, Admins) with comprehensive recycling item management, collection requests, reviews, and notifications.

## Database Tables

### 1. Users Table (`users`)
Stores all user information including regular users, collectors, and admins.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `full_name` (STRING, NOT NULL) - User's full name
- `email` (STRING, UNIQUE, NOT NULL) - User's email address
- `password` (STRING, NOT NULL) - Hashed password
- `phone_number` (STRING, NOT NULL) - User's phone number
- `address` (STRING, NOT NULL) - User's address
- `city` (STRING) - User's city
- `role` (ENUM: 'user', 'collector', 'admin') - User role
- `is_active` (BOOLEAN, DEFAULT: true) - Account status
- `profile_image` (STRING) - Profile image URL
- `collector_id` (STRING, UNIQUE) - Collector identification number
- `rating` (DECIMAL(3,2), DEFAULT: 0.00) - User rating (for collectors)
- `total_collections` (INTEGER, DEFAULT: 0) - Total collections completed (for collectors)
- `total_earnings` (DECIMAL(10,2), DEFAULT: 0.00) - Total earnings (for collectors)
- `total_recycled_items` (INTEGER, DEFAULT: 0) - Total items recycled (for users)
- `total_recycled_value` (DECIMAL(10,2), DEFAULT: 0.00) - Total value recycled (for users)
- `last_activity` (DATE) - Last activity timestamp
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 2. Recycling Items Table (`recycling_items`)
Stores the catalog of recyclable items available in the system.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `item_id` (STRING, UNIQUE, NOT NULL) - Unique item identifier
- `name` (STRING, NOT NULL) - Item name
- `category` (ENUM: 'Paper', 'Glass and Plastic', 'Metal & Steel', 'E-waste', 'Brass', 'Others')
- `description` (TEXT, NOT NULL) - Item description
- `price_per_unit` (STRING, NOT NULL) - Price per unit (e.g., "Rs.9/Kgs")
- `image` (STRING) - Item image URL
- `is_active` (BOOLEAN, DEFAULT: true) - Item availability status
- `sort_order` (INTEGER, DEFAULT: 0) - Display order
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 3. Posted Items Table (`posted_items`)
Stores items posted by users for recycling.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `item_name` (STRING, NOT NULL) - Name of the posted item
- `category` (ENUM: 'Paper', 'Glass and Plastic', 'Metal & Steel', 'E-waste', 'Brass', 'Others')
- `description` (TEXT, NOT NULL) - Item description
- `quantity` (STRING, NOT NULL) - Quantity/weight
- `condition` (ENUM: 'Excellent', 'Good', 'Fair', 'Poor')
- `location` (STRING, NOT NULL) - Pickup location
- `contact_number` (STRING, NOT NULL) - Contact number
- `preferred_pickup_date` (DATE) - Preferred pickup date
- `notes` (TEXT) - Additional notes
- `estimated_value` (DECIMAL(10,2)) - Estimated value
- `status` (ENUM: 'Posted', 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected')
- `images` (JSON) - Array of image URLs
- `posted_by` (STRING, NOT NULL) - Name of person who posted
- `user_contact` (STRING, NOT NULL) - User contact information
- `date_posted` (DATE, NOT NULL) - Date when item was posted
- `user_id` (INTEGER, FOREIGN KEY) - Reference to users table
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 4. Collection Requests Table (`collection_requests`)
Stores collection requests from users.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `request_type` (ENUM: 'user_posted', 'browsed_items', 'scheduled')
- `status` (ENUM: 'Pending', 'Accepted', 'In Progress', 'Completed', 'Rejected', 'Cancelled')
- `total_estimated_value` (DECIMAL(10,2), NOT NULL) - Total estimated value
- `request_date` (DATE, NOT NULL) - Request date
- `preferred_pickup_date` (DATE) - Preferred pickup date
- `estimated_collection_date` (DATE) - Estimated collection date
- `actual_collection_date` (DATE) - Actual collection date
- `user_name` (STRING, NOT NULL) - User's name
- `user_address` (TEXT, NOT NULL) - User's address
- `user_city` (STRING) - User's city
- `user_phone` (STRING, NOT NULL) - User's phone
- `user_email` (STRING) - User's email
- `collector_id` (INTEGER, FOREIGN KEY) - Assigned collector
- `collector_name` (STRING) - Collector's name
- `collector_phone` (STRING) - Collector's phone
- `collector_rating` (DECIMAL(3,2)) - Collector's rating
- `collection_notes` (TEXT) - Collection notes
- `actual_value` (DECIMAL(10,2)) - Actual value collected
- `payment_status` (ENUM: 'Pending', 'Paid', 'Failed')
- `payment_amount` (DECIMAL(10,2)) - Payment amount
- `payment_date` (DATE) - Payment date
- `status_history` (JSON) - Status change history
- `user_id` (INTEGER, FOREIGN KEY) - Reference to users table
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 5. Collection Request Items Table (`collection_request_items`)
Junction table linking collection requests with items.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `quantity` (DECIMAL(10,2), NOT NULL) - Item quantity
- `price_per_unit` (DECIMAL(10,2), NOT NULL) - Price per unit
- `estimated_value` (DECIMAL(10,2), NOT NULL) - Estimated value
- `actual_value` (DECIMAL(10,2)) - Actual value
- `condition` (ENUM: 'Excellent', 'Good', 'Fair', 'Poor')
- `notes` (TEXT) - Item-specific notes
- `collection_request_id` (INTEGER, FOREIGN KEY) - Reference to collection_requests
- `posted_item_id` (INTEGER, FOREIGN KEY) - Reference to posted_items
- `recycling_item_id` (INTEGER, FOREIGN KEY) - Reference to recycling_items
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 6. Reviews Table (`reviews`)
Stores user reviews for collectors.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `rating` (INTEGER, NOT NULL) - Rating (1-5)
- `comment` (TEXT) - Review comment
- `is_anonymous` (BOOLEAN, DEFAULT: false) - Anonymous review flag
- `is_verified` (BOOLEAN, DEFAULT: false) - Review verification status
- `is_active` (BOOLEAN, DEFAULT: true) - Review status
- `user_id` (INTEGER, FOREIGN KEY) - User who wrote the review
- `collector_id` (INTEGER, FOREIGN KEY) - Collector being reviewed
- `collection_request_id` (INTEGER, FOREIGN KEY) - Related collection request
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 7. Notifications Table (`notifications`)
Stores user notifications.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `title` (STRING, NOT NULL) - Notification title
- `message` (TEXT, NOT NULL) - Notification message
- `type` (ENUM: 'info', 'success', 'warning', 'error', 'collection_request', 'payment', 'review')
- `is_read` (BOOLEAN, DEFAULT: false) - Read status
- `is_active` (BOOLEAN, DEFAULT: true) - Notification status
- `action_url` (STRING) - Action URL
- `action_text` (STRING) - Action button text
- `user_id` (INTEGER, FOREIGN KEY) - User receiving notification
- `collection_request_id` (INTEGER, FOREIGN KEY) - Related collection request
- `review_id` (INTEGER, FOREIGN KEY) - Related review
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 8. Wishlist Table (`wishlists`)
Stores user wishlist items.

**Fields:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT)
- `quantity` (DECIMAL(10,2), NOT NULL) - Desired quantity
- `notes` (TEXT) - User notes
- `is_active` (BOOLEAN, DEFAULT: true) - Wishlist item status
- `user_id` (INTEGER, FOREIGN KEY) - User who added to wishlist
- `recycling_item_id` (INTEGER, FOREIGN KEY) - Recycling item
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Relationships

### One-to-Many Relationships:
- User → PostedItems (user can post multiple items)
- User → CollectionRequests (user can have multiple requests)
- User → Reviews (user can write multiple reviews)
- User → Notifications (user can have multiple notifications)
- User → Wishlist (user can have multiple wishlist items)
- User → AssignedCollections (collector can handle multiple collections)
- User → ReceivedReviews (collector can receive multiple reviews)
- RecyclingItem → CollectionRequestItems (item can be in multiple requests)
- RecyclingItem → WishlistItems (item can be in multiple wishlists)
- PostedItem → CollectionRequestItems (posted item can be in multiple requests)
- CollectionRequest → Items (request can have multiple items)
- CollectionRequest → Reviews (request can have multiple reviews)
- CollectionRequest → Notifications (request can have multiple notifications)
- Review → Notifications (review can have multiple notifications)

### Many-to-One Relationships:
- PostedItem → User (item belongs to one user)
- CollectionRequest → User (request belongs to one user)
- CollectionRequest → Collector (request assigned to one collector)
- CollectionRequestItem → CollectionRequest (item belongs to one request)
- CollectionRequestItem → PostedItem (item can reference one posted item)
- CollectionRequestItem → RecyclingItem (item can reference one recycling item)
- Review → User (review written by one user)
- Review → Collector (review for one collector)
- Review → CollectionRequest (review for one request)
- Notification → User (notification for one user)
- Notification → CollectionRequest (notification for one request)
- Notification → Review (notification for one review)
- Wishlist → User (wishlist item belongs to one user)
- Wishlist → RecyclingItem (wishlist item references one recycling item)

## Data Seeding

The system includes automatic seeding for recycling items. The `recyclingItemsSeeder.js` file contains all the recycling items data from the frontend, which will be automatically populated when the server starts.

## Usage Examples

### Creating a new user:
```javascript
const user = await User.create({
  fullName: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword',
  phone: '+977-9800000000',
  address: 'Kathmandu, Nepal',
  city: 'Kathmandu',
  role: 'user'
});
```

### Creating a collection request:
```javascript
const request = await CollectionRequest.create({
  requestType: 'user_posted',
  status: 'Pending',
  totalEstimatedValue: 150.00,
  userName: 'John Doe',
  userAddress: 'Kathmandu, Nepal',
  userPhone: '+977-9800000000',
  userId: 1
});
```

### Adding items to a collection request:
```javascript
await CollectionRequestItem.create({
  quantity: 5.0,
  pricePerUnit: 9.00,
  estimatedValue: 45.00,
  condition: 'Good',
  collectionRequestId: 1,
  postedItemId: 1
});
```

## Indexes and Performance

The following indexes are automatically created by Sequelize:
- Primary keys on all tables
- Foreign key indexes
- Unique constraints on email, item_id, collector_id
- Indexes on frequently queried fields like status, user_id, collector_id

## Security Considerations

1. **Password Hashing**: All passwords are hashed using bcrypt before storage
2. **Input Validation**: All user inputs are validated using Sequelize validators
3. **SQL Injection Protection**: Sequelize ORM provides protection against SQL injection
4. **Data Integrity**: Foreign key constraints ensure referential integrity

## Migration Strategy

When making schema changes:
1. Create new migration files
2. Test migrations on development database
3. Backup production database before applying changes
4. Apply migrations during maintenance window
5. Verify data integrity after migration 