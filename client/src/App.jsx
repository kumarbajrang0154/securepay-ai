import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import QRScannerPage from './pages/QRScannerPage'
import QRUploadPage from './pages/QRUploadPage'
import RiskResultPage from './pages/RiskResultPage'
import TransactionHistoryPage from './pages/TransactionHistoryPage'
import ReportFraudPage from './pages/ReportFraudPage'
import TransactionAnalysisPage from './pages/TransactionAnalysisPage'


function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scanner" element={<QRScannerPage />} />
            <Route path="/upload" element={<QRUploadPage />} />
            <Route path="/result" element={<RiskResultPage />} />
            <Route path="/history" element={<TransactionHistoryPage />} />
            <Route path="/report" element={<ReportFraudPage />} />
            <Route path="/analysis" element={<TransactionAnalysisPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
