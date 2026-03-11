import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QRScannerPage from "./pages/QRScannerPage";
import QRUploadPage from "./pages/QRUploadPage";
import RiskResultPage from "./pages/RiskResultPage";
import ReportFraudPage from "./pages/ReportFraudPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<LoginPage />} />

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<HomePage />} />

        {/* QR SCAN */}
        <Route path="/scan" element={<QRScannerPage />} />

        {/* QR UPLOAD */}
        <Route path="/upload" element={<QRUploadPage />} />

        {/* RESULT */}
        <Route path="/result" element={<RiskResultPage />} />

        {/* FRAUD REPORT */}
        <Route path="/report" element={<ReportFraudPage />} />

        {/* TRANSACTIONS */}
        <Route path="/transactions" element={<TransactionHistoryPage />} />

        {/* FALLBACK */}
        <Route path="*" element={<LoginPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/edit-profile" element={<EditProfilePage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;