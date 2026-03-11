import { Routes, Route } from "react-router-dom"

import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import QRScannerPage from "./pages/QRScannerPage"
import QRUploadPage from "./pages/QRUploadPage"
import RiskResultPage from "./pages/RiskResultPage"

function App() {
  return (
    <Routes>

      {/* Login Page */}
      <Route path="/" element={<LoginPage />} />

      {/* Home Page */}
      <Route path="/home" element={<HomePage />} />

      {/* Scan QR */}
      <Route path="/scan" element={<QRScannerPage />} />

      {/* Upload QR */}
      <Route path="/upload" element={<QRUploadPage />} />

      {/* Result Page */}
      <Route path="/result" element={<RiskResultPage />} />

    </Routes>
  )
}

export default App