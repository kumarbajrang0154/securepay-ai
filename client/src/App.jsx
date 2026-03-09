import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import QRUploadPage from "./pages/QRUploadPage";
import TransactionAnalysisPage from "./pages/TransactionAnalysisPage";

import InstallPWA from "./components/InstallPWA";

function App() {

  return (
    <>

      <InstallPWA />

      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/upload" element={<QRUploadPage />} />
        <Route path="/analysis" element={<TransactionAnalysisPage />} />

      </Routes>

    </>
  );
}

export default App;