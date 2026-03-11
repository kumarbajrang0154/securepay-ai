import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QRScannerPage from "./pages/QRScannerPage";
import QRUploadPage from "./pages/QRUploadPage";
import RiskResultPage from "./pages/RiskResultPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import ReportFraudPage from "./pages/ReportFraudPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/qr-scanner" element={<QRScannerPage />} />
        <Route path="/qr-upload" element={<QRUploadPage />} />
        <Route path="/risk-result" element={<RiskResultPage />} />
        <Route path="/history" element={<TransactionHistoryPage />} />
        <Route path="/report-fraud" element={<ReportFraudPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;