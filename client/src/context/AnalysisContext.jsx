import { createContext, useState } from "react";

export const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [qrData, setQrData] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [riskResult, setRiskResult] = useState(null);

  return (
    <AnalysisContext.Provider
      value={{
        qrData,
        setQrData,
        transactionDetails,
        setTransactionDetails,
        riskResult,
        setRiskResult,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};