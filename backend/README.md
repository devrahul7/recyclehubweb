# EcoSajha Backend

A comprehensive Node.js/Express.js backend API for the EcoSajha recycling platform.

## 🚀 Features

- **Authentication & Authorization** - JWT-based authentication with role-based access control
- **Database Management** - PostgreSQL with Sequelize ORM
- **File Upload** - Secure image upload with validation
- **Rate Limiting** - Protection against API abuse
- **Caching** - Redis-like caching for improved performance
- **Logging** - Comprehensive request and error logging
- **Security** - Helmet, CORS, input validation, and XSS protection
- **Validation** - Joi schema validation for all inputs
- **Error Handling** - Centralized error handling with consistent responses

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or bun package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecosajhaweb/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecosajha_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb ecosajha_db
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE ecosajha_db;
   ```

5. **Start the server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## 📁 Project Structure

```
backend/
├── config/                 # Configuration files
│   ├── app.js             # Application configuration
│   └── database.js        # Database configuration
├── controllers/           # Route controllers
│   ├── authController.js
│   ├── userController.js
│   ├── recyclingItemController.js
│   └── ...
├── database/              # Database connection
│   └── db.js
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── validation.js     # Input validation
│   ├── errorHandler.js   # Error handling
│   ├── rateLimiter.js    # Rate limiting
│   ├── upload.js         # File upload
│   ├── logger.js         # Logging
│   ├── cache.js          # Caching
│   ├── security.js       # Security middleware
│   └── index.js          # Middleware exports
├── models/               # Database models
│   ├── User.js
│   ├── RecyclingItem.js
│   ├── PostedItem.js
│   └── ...
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── recyclingItemRoutes.js
│   └── ...
├── seeders/              # Database seeders
│   └── recyclingItemsSeeder.js
├── utils/                # Utility functions
│   ├── helpers.js        # Helper functions
│   └── constants.js      # Application constants
├── uploads/              # File upload directory
├── logs/                 # Application logs
├── server.js             # Main server file
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | ecosajha_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `LOG_LEVEL` | Log level | INFO |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |

### Database Configuration

The application supports three environments:
- **development** - For local development
- **test** - For testing
- **production** - For production deployment

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

```bash
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "user"
    }
  }
}
```

### Protected Routes

Include the token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **user** - Regular users who can post items and request collections
- **collector** - Users who can collect items and manage collection requests
- **admin** - Administrators with full system access

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users` - Get all users (admin only)

### Recycling Items
- `GET /api/recycling-items` - Get all recycling items
- `GET /api/recycling-items/categories` - Get categories
- `GET /api/recycling-items/search` - Search items

### Posted Items
- `GET /api/posted-items` - Get all posted items
- `POST /api/posted-items` - Create posted item
- `GET /api/posted-items/user/items` - Get user's items

### Collection Requests
- `GET /api/collection-requests` - Get all requests
- `POST /api/collection-requests/from-wishlist` - Create from wishlist
- `PUT /api/collection-requests/:id/status` - Update status

### Reviews
- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/collector/:id` - Get collector reviews

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Dashboard
- `GET /api/dashboard/user` - User dashboard
- `GET /api/dashboard/collector` - Collector dashboard
- `GET /api/dashboard/admin` - Admin dashboard

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access Control** - Different permissions for different user types
- **Rate Limiting** - Protection against API abuse
- **Input Validation** - Joi schema validation for all inputs
- **SQL Injection Protection** - Parameterized queries
- **XSS Protection** - Input sanitization
- **CORS Configuration** - Cross-origin resource sharing
- **Security Headers** - Helmet for security headers
- **File Upload Security** - Type and size validation

## 📝 Logging

The application includes comprehensive logging:

- **Request Logging** - All incoming requests and responses
- **Error Logging** - Detailed error information
- **Performance Logging** - Slow request detection
- **Security Logging** - Potential security threats
- **User Activity Logging** - User actions tracking

Logs are stored in the `logs/` directory with daily rotation.

## 🚀 Performance Features

- **Caching** - Redis-like caching for frequently accessed data
- **Database Optimization** - Connection pooling and query optimization
- **Rate Limiting** - Prevents API abuse
- **File Upload Optimization** - Efficient file handling
- **Response Compression** - Reduced bandwidth usage

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```bash
docker build -t ecosajha-backend .
docker run -p 5000:5000 ecosajha-backend
```

## 🔧 Development

### Code Style
- Use ES6+ features
- Follow consistent naming conventions
- Add comments for complex logic
- Use proper error handling

### Adding New Features
1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Add validation schemas in `middleware/validation.js`
5. Update API documentation

### Database Migrations
```bash
# Create migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npx sequelize-cli db:migrate

# Undo migrations
npx sequelize-cli db:migrate:undo
```

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Middleware Documentation](./MIDDLEWARE_DOCUMENTATION.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@ecosajha.com or create an issue in the repository. 