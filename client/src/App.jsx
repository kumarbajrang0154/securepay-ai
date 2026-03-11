import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QRScannerPage from "./pages/QRScannerPage";
import QRUploadPage from "./pages/QRUploadPage";
import RiskResultPage from "./pages/RiskResultPage";
import TransactionHistoryPage from "./pages/TransactionHistoryPage";
import ReportFraudPage from "./pages/ReportFraudPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AnalyzingPage from "./pages/AnalyzingPage";

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

        {/* AI ANALYZING SCREEN */}
        <Route path="/analyzing" element={<AnalyzingPage />} />

        {/* RESULT */}
        <Route path="/result" element={<RiskResultPage />} />

        {/* HISTORY */}
        <Route path="/transactions" element={<TransactionHistoryPage />} />

        {/* FRAUD REPORT */}
        <Route path="/report" element={<ReportFraudPage />} />

        {/* PROFILE */}
        <Route path="/profile" element={<ProfilePage />} />

        {/* EDIT PROFILE */}
        <Route path="/edit-profile" element={<EditProfilePage />} />

        {/* SETTINGS */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* FALLBACK */}
        <Route path="*" element={<LoginPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;