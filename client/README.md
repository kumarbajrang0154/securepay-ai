# SecurePay AI - Client Documentation

## Frontend Architecture

Modern React application with Vite, Tailwind CSS, and React Router.

## Folder Structure Details

### `/public/`
Static assets served as-is.
- `index.html` - Main HTML file

### `/src/`

#### `/components/`
Reusable UI components.

**Files:**
- `Navbar.jsx` - Navigation header with menu
- `Footer.jsx` - Footer section with links

#### `/pages/`
Page components (each = one route).

**Files:**
- `HomePage.jsx` - Landing page with features
- `QRScannerPage.jsx` - Real-time QR scanning
- `QRUploadPage.jsx` - QR image upload
- `RiskResultPage.jsx` - Display fraud analysis result
- `TransactionHistoryPage.jsx` - List all transactions
- `ReportFraudPage.jsx` - Report fraudulent QR form
- `TransactionAnalysisPage.jsx` - Analytics dashboard

#### `/services/`
API integration and external services.

**Files:**
- `apiService.js` - Axios instance and API calls
  - `analyzeQR()` - Send QR for analysis
  - `reportFraud()` - Submit fraud report
  - `getTransactionHistory()` - Fetch history
  - `getAnalysisStats()` - Get statistics

#### `/context/`
React Context for state management.

**Files:**
- `AnalysisContext.jsx` - Global analysis state
  - `analysisResult` - Current result
  - `loading` - Loading state
  - `error` - Error message
  - Methods to update state

#### `/styles/`
Global CSS and Tailwind configurations.

**Files:**
- `index.css` - Global styles, custom utilities, animations

#### `/assets/`
Images, icons, and media files.

## Key Features Implementation

### 1. QR Scanner (html5-qrcode)
```javascript
<Html5QrcodeScanner
  fps={10}
  qrbox={250}
  onScanSuccess={handleQRData}
/>
```

### 2. State Management (Context API)
Global state without Redux:
- Analysis results shared across pages
- Loading and error states
- Actions to update data

### 3. Routing (React Router v6)
```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/scanner" element={<QRScannerPage />} />
  // ... more routes
</Routes>
```

### 4. Styling (Tailwind CSS)
Utility-first CSS framework for rapid UI development:
- Custom color schemes
- Responsive grid layouts
- Animations and transitions

### 5. HTTP Requests (Axios)
```javascript
// Interceptor adds JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

## Component Props & Flow

### HomePage
- Display features and call-to-action buttons
- Navigation to Scanner or Upload

### QRScannerPage
- Render camera feed
- Listen for QR scan
- Send to backend for analysis
- Redirect to RiskResultPage

### QRUploadPage
- File input for image
- Preview selected image
- Send to backend
- Redirect to RiskResultPage

### RiskResultPage
- Read from AnalysisContext
- Display risk badge (green/yellow/red)
- Show transaction details
- Provide action buttons

### TransactionHistoryPage
- Fetch transaction list
- Display in table format
- Show risk level badges
- Paginated view

### ReportFraudPage
- Form with QR data input
- Reason dropdown
- Submit handler
- Success/error feedback

### TransactionAnalysisPage
- Fetch statistics
- Render charts (Pie, Bar)
- Display KPI cards

## Styling System

### Tailwind Configuration
```javascript
theme: {
  colors: {
    danger: '#ef4444',    // Red
    warning: '#f59e0b',   // Yellow
    success: '#10b981',   // Green
    primary: '#3b82f6',   // Blue
  }
}
```

### Custom Utilities
```css
.risk-badge-green { }
.risk-badge-yellow { }
.risk-badge-red { }
.btn-primary { }
.btn-secondary { }
.card { }
.spinner { }
```

## Running the Frontend

```bash
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Build for production
npm build

# Preview production build
npm preview

# Lint code
npm lint
```

## Configuration Files

### `vite.config.js`
- Port: 3000
- Proxy to backend: http://localhost:5000/api
- React plugin

### `tailwind.config.js`
- Content paths for JIT compilation
- Custom color theme
- Font family configuration

### `postcss.config.js`
- Tailwind CSS processing
- Autoprefixer for browser compatibility

## Environment Variables

Create `.env.local`:
```
VITE_API_URL=http://localhost:5000/api
VITE_ENV=development
```

## Performance Optimization

- Lazy loading with React.lazy()
- Code splitting via routes
- Image optimization
- Component memoization
- Efficient re-renders with Context

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Deployment

### Build Process
```bash
npm run build
```

Creates optimized `dist/` folder for production.

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
- Connect GitHub repo to Netlify
- Build command: `npm run build`
- Publish directory: `dist/`

## Troubleshooting

### QR Scanner not working
- Check camera permissions
- Ensure HTTPS on production
- Verify browser support

### API calls failing
- Check backend is running on :5000
- Verify proxy in vite.config.js
- Check CORS headers

### Tailwind styles not applying
- Verify content paths in tailwind.config.js
- Rebuild with `npm run build`
- Clear browser cache
