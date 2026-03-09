# SecurePay AI - UPI QR Fraud Detection System

A comprehensive UPI QR code fraud detection system using AI/ML to identify and prevent fraudulent transactions. Built with **React.js**, **Node.js + Express**, **MongoDB**, and **Tailwind CSS** as a **monorepo**.

## 📋 Project Overview

SecurePay AI is a final-year computer science project designed to:
- Detect fraudulent UPI QR codes using machine learning algorithms
- Analyze QR data for fraud risk indicators
- Provide real-time risk assessment (Green/Yellow/Red)
- Allow users to report fraudulent QRs
- Track transaction history and analytics

## 🏗️ Project Structure

```
SecurePay-AI/
├── client/                      # React Frontend
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   ├── pages/               # Page components
│   │   ├── services/            # API service calls
│   │   ├── context/             # React Context for state management
│   │   ├── styles/              # CSS & Tailwind styles
│   │   ├── assets/              # Images, icons, etc.
│   │   ├── App.jsx              # Main app component
│   │   └── index.jsx            # React entry point
│   ├── package.json
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   └── postcss.config.js
│
├── server/                      # Node.js Backend
│   ├── src/
│   │   ├── routes/              # API route definitions
│   │   ├── controllers/         # Request handlers
│   │   ├── services/            # Business logic
│   │   ├── models/              # MongoDB schemas
│   │   ├── middlewares/         # Express middlewares
│   │   ├── config/              # Configuration files
│   │   └── utils/               # Helper functions
│   ├── server.js                # Express server entry point
│   └── package.json
│
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
└── README.md                    # Project documentation
```

## 🎯 Key Features

### Frontend Features
- ✅ **QR Scanner** - Real-time QR code scanning via camera
- ✅ **QR Upload** - Upload QR code images for analysis
- ✅ **Risk Assessment** - Display Green/Yellow/Red risk levels
- ✅ **Transaction History** - View all scanned transactions
- ✅ **Analytics Dashboard** - Chart-based fraud analytics
- ✅ **Report Fraud** - Submit fraudulent QR reports
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

### Backend Features
- ✅ **Fraud Detection Engine** - ML-based fraud scoring algorithm
- ✅ **QR Analysis API** - Parse and analyze QR data
- ✅ **MongoDB Integration** - Persistent data storage
- ✅ **Fraud Reporting** - Track reported QR codes
- ✅ **Transaction Analytics** - Generate fraud statistics
- ✅ **RESTful API** - Clean and scalable API design
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Middleware Stack** - Authentication, rate limiting, CORS

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd SecurePay-AI
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

**Terminal 1 - Start MongoDB** (if using local)
```bash
mongod
```

**Terminal 2 - Start Backend Server**
```bash
cd server
npm run dev
```
Backend will run on `http://localhost:5000`

**Terminal 3 - Start Frontend Development Server**
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:3000`

## 📁 Folder Explanations

### Client (Frontend)

| Folder | Purpose |
|--------|---------|
| `public/` | Static HTML and assets |
| `src/components/` | Reusable UI components (Navbar, Footer, etc.) |
| `src/pages/` | Full page components (Home, Scanner, Upload, etc.) |
| `src/services/` | API client and service functions |
| `src/context/` | React Context for global state management |
| `src/styles/` | CSS, Tailwind, and global styles |
| `src/assets/` | Images, icons, and media files |

### Server (Backend)

| Folder | Purpose |
|--------|---------|
| `routes/` | Route definitions for API endpoints |
| `controllers/` | Request handlers and response logic |
| `services/` | Business logic and fraud detection algorithms |
| `models/` | MongoDB schema definitions |
| `middlewares/` | Authentication, authorization, rate limiting |
| `config/` | Database connection and constants |
| `utils/` | Helper functions and utilities |

## 🔄 Application Flow

1. **User scans/uploads QR code** → Frontend
2. **QR data extracted** → Parser
3. **Data sent to backend API** → `/api/analysis/analyze`
4. **Fraud detection service analyzes** → Scoring algorithm
5. **Risk score calculated** → (0-1 range)
6. **Result persisted** → MongoDB
7. **Response sent to frontend** → Display Green/Yellow/Red
8. **User can report fraud** → `/api/fraud/report`

## 🔐 Risk Scoring Algorithm

The system calculates fraud risk by analyzing multiple factors:

```javascript
Risk Factors:
- Unknown Merchant (15%)
- Suspicious Pattern (20%)
- Large Amount (15%)
- Blacklisted UPI (30%)
- Invalid Format (20%)

Total Score: 0 (Safe) to 1.0 (Fraudulent)

Risk Levels:
- Green (✅ SAFE): 0 - 0.3
- Yellow (⚠️ CAUTION): 0.3 - 0.7
- Red (❌ FRAUDULENT): 0.7 - 1.0
```

## 📊 API Endpoints

### Analysis Endpoints
- `POST /api/analysis/analyze` - Analyze QR code
- `GET /api/analysis/stats` - Get statistics
- `GET /api/analysis/breakdown` - Get risk breakdown

### Fraud Endpoints
- `POST /api/fraud/report` - Report fraudulent QR
- `GET /api/fraud/reports` - Get fraud reports
- `GET /api/fraud/statistics` - Get fraud stats

### Transaction Endpoints
- `GET /api/transactions/history` - Get transaction history
- `GET /api/transactions/:id` - Get transaction details
- `GET /api/transactions/summary` - Get summary stats

## 🗄️ MongoDB Schema

### Transactions Collection
```javascript
{
  qrHash: String (unique),
  upiId: String,
  merchant: String,
  amount: Number,
  riskLevel: String (green/yellow/red),
  riskScore: Number (0-1),
  riskFactors: [String],
  isReported: Boolean,
  reportCount: Number,
  metadata: { userAgent, ipAddress },
  createdAt: Date
}
```

### Fraud Reports Collection
```javascript
{
  qrHash: String,
  qrData: String,
  reason: String (phishing/malware/money_fraud/etc),
  description: String,
  reporterEmail: String,
  status: String (pending/verified/false_positive),
  createdAt: Date
}
```

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

## 📈 Future Enhancements

- [ ] Machine learning model integration for better fraud detection
- [ ] User authentication and login system
- [ ] SMS/Email notifications for fraud alerts
- [ ] Blockchain for transaction verification
- [ ] Admin dashboard for fraud report management
- [ ] Real-time notifications with WebSockets
- [ ] Mobile app development
- [ ] Browser extension for QR scanning

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - Initial work & full-stack development

## 🙏 Acknowledgments

- UPI standards and documentation
- Open source community
- Mentors and advisors

## 📞 Support

For support, email support@securepay-ai.com or open an issue on GitHub.

---

**Made with ❤️ for secure UPI transactions**
