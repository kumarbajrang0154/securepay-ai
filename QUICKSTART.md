## Quick Start Guide

### Prerequisites Installation

#### 1. Install Node.js
- Download from https://nodejs.org/ (LTS version)
- Verify: `node --version` & `npm --version`

#### 2. Install MongoDB
- **Option A (Local)**: Download from https://www.mongodb.com/try/download/community
- **Option B (Cloud)**: Create free cluster at https://www.mongodb.com/cloud/atlas

### Project Setup (5 minutes)

```bash
# 1. Clone or unzip the project
cd SecurePay-AI

# 2. Create environment file
copy .env.example .env

# 3. Edit .env with your MongoDB URL
# MONGODB_URI=mongodb://localhost:27017/securepay-ai
```

### Running the Application

**Terminal 1: Backend Server**
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2: Frontend Application**
```bash
cd client
npm install
npm run dev
# App runs on http://localhost:3000
```

### First Test

1. Open http://localhost:3000
2. Click "Start Scanning"
3. Use test QR: `upi://pay?pa=merchant@okhdfcbank&pn=Test%20Merchant&am=100`
4. View risk analysis result

### Project Structure At A Glance

```
client/                          server/
├── public/                       ├── src/
├── src/                          │   ├── config/
│   ├── components/               │   ├── controllers/
│   ├── pages/                    │   ├── middleware/
│   ├── services/                 │   ├── models/
│   ├── context/                  │   ├── routes/
│   ├── styles/                   │   ├── services/
│   ├── App.jsx                   │   └── utils/
│   └── index.jsx                 └── server.js
└── package.json                  └── package.json
```

### Common Commands

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm test             # Run tests

# Frontend
npm run dev          # Start Vite dev server
npm run build        # Build optimized bundle
npm run preview      # Preview production build
npm run lint         # Check code quality
```

### Database Setup

MongoDB will auto-create:
- Database: `securepay-ai`
- Collections:
  - `transactions` - Scanned QR records
  - `fraudreports` - User fraud reports
  - `users` - User accounts (future)

### Make First API Call

```bash
# Test backend health
curl http://localhost:5000/api/health

# Returns:
# {"status":"Server is running","timestamp":"2024-03-08T..."}
```

### Next Steps

1. ✅ Setup database
2. ✅ Install dependencies
3. ✅ Run backend & frontend
4. ✅ Test core features
5. 📚 Read full documentation
6. 🚀 Deploy to production

### Documentation Files

- `README.md` - Full project overview
- `server/README.md` - Backend architecture
- `client/README.md` - Frontend setup
- `ARCHITECTURE.md` - Design patterns

### Support & Troubleshooting

**Frontend won't load?**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Backend connection error?**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify port 5000 is free

**QR scanner not working?**
- Check camera permissions
- Use modern browser (Chrome, Firefox, Edge)
- Ensure HTTPS on production

---
**For detailed documentation, see README.md**
