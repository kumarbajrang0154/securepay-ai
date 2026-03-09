# SecurePay AI - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                          │
│         React.js Frontend (Vite + Tailwind CSS)              │
├─────────────────────────────────────────────────────────────┤
│  Scanner │ Upload │ Analysis │ History │ Report │ Charts     │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP/REST API
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND SERVER                            │
│            Express.js + Node.js (API Layer)                │
├─────────────────────────────────────────────────────────────┤
│  Routes → Controllers → Services → Models → Database        │
├─────────────────────────────────────────────────────────────┤
│                  FRAUD DETECTION ENGINE                      │
│  ├─ QR Parser                                               │
│  ├─ Risk Factor Analyzer                                    │
│  ├─ Score Calculator                                        │
│  └─ Result Generator                                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
        ┌────────────────────────────────────────┐
        │     MongoDB Database (NoSQL)           │
        ├────────────────────────────────────────┤
        │ • Transactions Collection              │
        │ • Fraud Reports Collection             │
        │ • Users Collection                     │
        └────────────────────────────────────────┘
```

## Clean Architecture Layers

### 1. Presentation Layer (Client)
**Responsibility**: User interface and experience

Components:
- Vue/Page components
- Navigation & routing
- Form handling
- Chart visualization

### 2. API Layer (Server - Routes)
**Responsibility**: HTTP route definitions

Endpoints:
- POST `/api/analysis/analyze`
- GET `/api/analysis/stats`
- POST `/api/fraud/report`
- GET `/api/transactions/history`

### 3. Business Logic Layer (Services)
**Responsibility**: Core application logic

Services:
- `fraudDetectionService` - Scoring algorithm
- `transactionService` - Data operations
- `fraudService` - Report management

### 4. Data Layer (Models + Database)
**Responsibility**: Data persistence

Schemas:
- Transaction schema
- FraudReport schema
- User schema

## Data Flow Diagram

### QR Analysis Flow
```
1. User scans/uploads QR
   ↓
2. Frontend: QRScannerPage/QRUploadPage captures data
   ↓
3. Frontend: apiService.analyzeQR(qrData)
   ↓
4. Backend: POST /api/analysis/analyze
   ↓
5. Controller: analysisController.analyzeQR()
   ↓
6. Service: fraudDetectionService.analyzeQRData(qrData)
   ├─ Parse UPI data
   ├─ Check risk factors
   ├─ Calculate risk score
   └─ Assign risk level
   ↓
7. Service: TransactionService.createTransaction()
   ├─ Generate QR hash
   ├─ Save to MongoDB
   └─ Return transaction
   ↓
8. Controller: Return response to frontend
   ↓
9. Frontend: AnalysisContext.setResult()
   ↓
10. Frontend: RiskResultPage displays result
```

### Fraud Reporting Flow
```
1. User clicks "Report Fraud"
   ↓
2. ReportFraudPage form submission
   ↓
3. apiService.reportFraud(qrData, reason, description)
   ↓
4. Backend: POST /api/fraud/report
   ↓
5. Controller: fraudController.reportFraud()
   ↓
6. Service: FraudService.reportFraud()
   ├─ Create fraud report document
   ├─ Update transaction.isReported flag
   └─ Save to MongoDB
   ↓
7. Response with success message
   ↓
8. Frontend: Show confirmation
```

## Fraud Detection Algorithm

### Risk Scoring Calculation

```
Total Risk Score = Σ(Weight × Factor Score)

Factors:
├─ Unknown Merchant (15%)
│   └─ Score: 1 if not in known merchant list
├─ Suspicious Pattern (20%)
│   └─ Score: 1 if unusual characters detected
├─ Large Amount (15%)
│   └─ Score: 1 if amount > ₹100,000
├─ Blacklisted UPI (30%)
│   └─ Score: 1 if UPI in blacklist
└─ Invalid Format (20%)
    └─ Score: 1 if UPI doesn't match regex

Risk Level Assignment:
├─ Green (✅):   0.0 ≤ Score ≤ 0.3
├─ Yellow (⚠️):  0.3 < Score ≤ 0.7
└─ Red (❌):     0.7 < Score ≤ 1.0
```

### Example Calculation

**Input QR**: `upi://pay?pa=scammer@upi&pn=Unknown&am=150000`

| Factor | Present | Score | Weight | Contribution |
|--------|---------|-------|--------|--------------|
| Unknown Merchant | Yes | 1 | 0.15 | 0.15 |
| Suspicious Pattern | No | 0 | 0.20 | 0.00 |
| Large Amount | Yes | 1 | 0.15 | 0.15 |
| Blacklisted UPI | Yes | 1 | 0.30 | 0.30 |
| Invalid Format | No | 0 | 0.20 | 0.00 |
| **Total Risk Score** | | | | **0.60** |
| **Risk Level** | | | | **YELLOW** |

## Technology Stack

### Frontend
```
React.js 18.2
├─ React Router v6 (Navigation)
├─ Axios (HTTP client)
├─ html5-qrcode (QR scanning)
├─ Chart.js (Analytics charts)
├─ Tailwind CSS 3.3 (Styling)
└─ Vite 4.4 (Build tool)
```

### Backend
```
Node.js + Express.js
├─ MongoDB (Database)
├─ Mongoose (ODM)
├─ JWT (Authentication)
├─ bcryptjs (Password hashing)
├─ CORS (Cross-origin)
└─ dotenv (Environment)
```

### DevOps & Deployment
```
Development:
├─ Nodemon (Auto-reload)
├─ Jest (Testing)
└─ ESLint (Code quality)

Production:
├─ Docker (Containerization)
├─ Vercel (Frontend hosting)
├─ Heroku/Railway (Backend hosting)
└─ MongoDB Atlas (Cloud database)
```

## Database Schema

### Transactions Collection
```javascript
{
  _id: ObjectId,
  qrHash: String (unique, indexed),
  upiId: String (indexed),
  merchant: String,
  amount: Number,
  transactionType: String ['payment', 'request', 'transfer'],
  riskLevel: String ['green', 'yellow', 'red'],
  riskScore: Number (0-1),
  riskFactors: [String],
  isReported: Boolean,
  reportCount: Number,
  metadata: {
    userAgent: String,
    ipAddress: String,
    location: String
  },
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Fraud Reports Collection
```javascript
{
  _id: ObjectId,
  qrHash: String (indexed),
  qrData: String,
  reason: String ['phishing', 'malware', 'money_fraud', 'identity_theft', 'other'],
  description: String,
  reporterEmail: String,
  reporterIP: String,
  status: String ['pending', 'verified', 'false_positive', 'unresolved'],
  verificationNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Security Layers                  │
├─────────────────────────────────────────┤
│ 1. Input Validation (Frontend & Backend)│
│    ├─ UPI format validation             │
│    ├─ Email validation                  │
│    └─ Amount range validation           │
├─────────────────────────────────────────┤
│ 2. Authentication (JWT)                 │
│    ├─ Token generation on login         │
│    ├─ Token validation on requests      │
│    └─ Token expiration (7 days)         │
├─────────────────────────────────────────┤
│ 3. Authorization (Role-based)           │
│    ├─ User role: general access         │
│    └─ Admin role: report verification   │
├─────────────────────────────────────────┤
│ 4. Rate Limiting                        │
│    ├─ 100 requests per 15 minutes       │
│    └─ IP-based tracking                 │
├─────────────────────────────────────────┤
│ 5. CORS Configuration                   │
│    └─ Only allows frontend origin       │
├─────────────────────────────────────────┤
│ 6. Password Security                    │
│    ├─ bcryptjs hashing (10 rounds)      │
│    └─ Never store plaintext             │
├─────────────────────────────────────────┤
│ 7. Environment Secrets                  │
│    ├─ JWT secret                        │
│    ├─ MongoDB URI                       │
│    └─ API keys                          │
├─────────────────────────────────────────┤
│ 8. HTTPS (Production)                   │
│    └─ TLS/SSL encryption                │
└─────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling
```
Load Balancer
├─ Backend Server Instance 1
├─ Backend Server Instance 2
├─ Backend Server Instance 3
└─ ... more instances

Shared: MongoDB Atlas (cloud)
```

### Performance Optimization
- Database indexing on frequently queried fields
- Redis caching for statistics
- CDN for static front-end assets
- Lazy loading in React components
- API response pagination

### Monitoring & Logging
```
Application
├─ Error logging (Sentry)
├─ Performance monitoring (New Relic)
├─ API monitoring (Postman)
└─ Database monitoring (MongoDB Atlas)
```

## Error Handling Strategy

```
Error Hierarchy:
1. Input Validation Error (400)
2. Authentication Error (401)
3. Authorization Error (403)
4. Not Found Error (404)
5. Conflict Error (409)
6. Server Error (500)
7. Service Unavailable (503)

Response Format:
{
  error: "Descriptive message",
  code: "ERROR_CODE",
  timestamp: "ISO-8601",
  details: {} (optional)
}
```

## Deployment Architecture

### Development
```
Localhost Dev Server
├─ Frontend: http://localhost:3000
└─ Backend: http://localhost:5000
```

### Production
```
CDN (Vercel/Netlify)
└─ Frontend SPA

API Server (Heroku/Railway/DigitalOcean)
└─ Node.js backend

Cloud Database (MongoDB Atlas)
└─ Persistent storage
```

---

**This architecture ensures scalability, maintainability, and security for a production-grade fraud detection system.**
