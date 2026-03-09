# SecurePay AI - Server Documentation

## Backend Architecture Overview

### Clean Architecture Pattern
The backend follows a **Clean Architecture** pattern with clear separation of concerns:

```
Routes → Controllers → Services → Models → Database
```

## Folder Structure Details

### `/src/routes/`
API route definitions following REST conventions.

**Files:**
- `analysisRoutes.js` - QR analysis endpoints
- `fraudRoutes.js` - Fraud reporting endpoints
- `transactionRoutes.js` - Transaction history endpoints

### `/src/controllers/`
Request handlers that process incoming requests and send responses.

**Files:**
- `analysisController.js` - Handles QR analysis requests
- `fraudController.js` - Manages fraud reports
- `transactionController.js` - Returns transaction data

### `/src/services/`
Core business logic for fraud detection and data operations.

**Files:**
- `fraudDetectionService.js` - Main fraud scoring algorithm
- `fraudService.js` - Fraud report operations
- `transactionService.js` - Transaction database operations

### `/src/models/`
MongoDB Mongoose schemas defining data structure.

**Files:**
- `Transaction.js` - Transaction schema
- `FraudReport.js` - Fraud report schema
- `User.js` - User schema (for future authentication)

### `/src/middlewares/`
Express middleware for cross-cutting concerns.

**Files:**
- `auth.js` - Authentication, authorization, rate limiting

### `/src/config/`
Configuration and constants.

**Files:**
- `db.js` - MongoDB connection setup
- `constants.js` - Risk thresholds and configuration

### `/src/utils/`
Helper functions and utilities.

**Files:**
- `helpers.js` - Hash generation, validation, formatting

## Key Components

### Fraud Detection Service
The core of the system that calculates fraud risk scores.

**Algorithm Flow:**
1. Parse UPI QR data
2. Check multiple risk factors
3. Calculate weighted risk score
4. Assign risk level (green/yellow/red)
5. Return detailed analysis

**Risk Factors Considered:**
- Unknown/unverified merchants
- Suspicious transaction patterns
- Unusually large amounts
- Blacklisted UPI IDs
- Invalid QR format

### Transaction Management
Tracks all analyzed transactions in MongoDB for:
- History and audit trail
- Analytics and statistics
- Fraud pattern detection
- User reference

### Fraud Reporting
System for users to report suspicious QR codes:
- Capture report details
- Store in database
- Flag associated transactions
- Admin verification workflow

## API Response Format

All API responses follow a consistent JSON format:

**Success Response (200):**
```json
{
  "success": true,
  "transactionId": "64a1b2c3d4e5f6g7h8i9j0k1",
  "upiId": "merchant@okhdfcbank",
  "merchant": "Amazon Pay",
  "amount": 5000,
  "riskLevel": "green",
  "riskScore": 0.15,
  "riskFactors": [],
  "timestamp": "2024-03-08T10:30:00.000Z"
}
```

**Error Response (400, 500):**
```json
{
  "error": "Error description",
  "timestamp": "2024-03-08T10:30:00.000Z"
}
```

## Running the Backend

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Run tests
npm test
```

## Environment Variables

Create `.env` file:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/securepay-ai
JWT_SECRET=your_secret_key
```

## Database Setup

### Local MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod

# Backend will auto-create database and collections
```

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in .env

## Middleware Implementation

### Authentication Middleware
Protects routes using JWT tokens:
```javascript
router.get('/protected', authMiddleware, controller)
```

### Rate Limiting
Prevents API abuse (100 requests per 15 minutes):
```javascript
app.use(rateLimitMiddleware(100, 15 * 60 * 1000))
```

## Error Handling

Global error handler catches and formats errors:
```javascript
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message
  })
})
```

## Performance Optimization

- **Database Indexing**: Indexed `createdAt` for faster queries
- **Lean Queries**: Using `.lean()` for read-only operations
- **Error Early Exit**: Validate input before processing
- **Async/Await**: Non-blocking operations

## Security Measures

- ✅ Environment variables for secrets
- ✅ JWT for authentication
- ✅ Rate limiting for DDoS protection
- ✅ CORS configuration
- ✅ Input sanitization
- ✅ Error message sanitization

## Deployment Checklist

- [ ] Set production environment variables
- [ ] Enable MongoDB authentication
- [ ] Configure CORS properly
- [ ] Set secure JWT secret
- [ ] Enable HTTPS
- [ ] Setup error logging
- [ ] Configure database backups
- [ ] Setup monitoring and alerts
