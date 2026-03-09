import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import InstallPWA from "./components/InstallPWA";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QRScannerPage from "./pages/QRScannerPage";
import QRUploadPage from "./pages/QRUploadPage";
import TransactionAnalysisPage from "./pages/TransactionAnalysisPage";
import RiskResultPage from "./pages/RiskResultPage";
import ReportFraudPage from "./pages/ReportFraudPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";

import { AnalysisProvider } from "./context/AnalysisContext";

function App() {
  return (
    <AnalysisProvider>
      <Router>

        {/* Install App Button */}
        <InstallPWA />

        {/* Navbar */}
        <Navbar />

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/scan" element={<QRScannerPage />} />
          <Route path="/upload" element={<QRUploadPage />} />
          <Route path="/analysis" element={<TransactionAnalysisPage />} />
          <Route path="/result" element={<RiskResultPage />} />
          <Route path="/report" element={<ReportFraudPage />} />
          <Route path="/history" element={<TransactionHistoryPage />} />
        </Routes>

        {/* Footer */}
        <Footer />

      </Router>
    </AnalysisProvider>
  );
}

export default App;