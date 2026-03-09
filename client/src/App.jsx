import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import QRScannerPage from "./pages/QRScannerPage";
import QRUploadPage from "./pages/QRUploadPage";
import TransactionAnalysisPage from "./pages/TransactionAnalysisPage";
import RiskResultPage from "./pages/RiskResultPage";
import ReportFraudPage from "./pages/ReportFraudPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-6">

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/scan" element={<QRScannerPage />} />
          <Route path="/upload" element={<QRUploadPage />} />
          <Route path="/analysis" element={<TransactionAnalysisPage />} />
          <Route path="/result" element={<RiskResultPage />} />
          <Route path="/report" element={<ReportFraudPage />} />
          <Route path="/history" element={<TransactionHistoryPage />} />
        </Routes>

      </div>

      <Footer />

    </div>
  );
}

export default App;