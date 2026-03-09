import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { AnalysisProvider } from "./context/AnalysisContext";
import SplashScreen from "./components/SplashScreen";

import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SplashScreen>
      <AnalysisProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AnalysisProvider>
    </SplashScreen>
  </React.StrictMode>
);