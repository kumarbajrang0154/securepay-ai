import { useState, useEffect } from "react";

const SmartWarningCard = ({
  warnings = [],
  behaviorStats = {},
  fraudScore = 0,
  riskLevel = "SAFE"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand for high-risk transactions
  useEffect(() => {
    if (riskLevel === "FRAUD" || warnings.length > 3) {
      setIsExpanded(true);
    }
  }, [riskLevel, warnings.length]);

  if (!warnings || warnings.length === 0) {
    return null;
  }

  // Determine card styling based on risk level
  const getCardStyles = () => {
    switch (riskLevel) {
      case "FRAUD":
        return "bg-red-900/90 border-red-500 shadow-red-500/20";
      case "SUSPICIOUS":
        return "bg-orange-900/90 border-orange-500 shadow-orange-500/20";
      default:
        return "bg-yellow-900/90 border-yellow-500 shadow-yellow-500/20";
    }
  };

  // Get risk icon based on level
  const getRiskIcon = () => {
    switch (riskLevel) {
      case "FRAUD":
        return "🚫";
      case "SUSPICIOUS":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  // Get risk color for text
  const getRiskColor = () => {
    switch (riskLevel) {
      case "FRAUD":
        return "text-red-400";
      case "SUSPICIOUS":
        return "text-orange-400";
      default:
        return "text-yellow-400";
    }
  };

  // Categorize warnings
  const criticalWarnings = warnings.filter(w =>
    w.includes("CRITICAL") || w.includes("EXTREME") || w.includes("BLACKLISTED")
  );
  const highWarnings = warnings.filter(w =>
    w.includes("HIGH RISK") || w.includes("COMMUNITY ALERT") || w.includes("BEHAVIORAL ALERT")
  );
  const moderateWarnings = warnings.filter(w =>
    !criticalWarnings.includes(w) && !highWarnings.includes(w)
  );

  const displayWarnings = isExpanded ? warnings : warnings.slice(0, 2);

  return (
    <div className={`border-2 rounded-xl p-5 mb-6 shadow-lg backdrop-blur-sm ${getCardStyles()}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getRiskIcon()}</span>
          <div>
            <h3 className={`text-lg font-bold ${getRiskColor()}`}>
              {riskLevel === "FRAUD" ? "HIGH FRAUD RISK" :
               riskLevel === "SUSPICIOUS" ? "SUSPICIOUS ACTIVITY" :
               "RISK WARNINGS"}
            </h3>
            <p className="text-gray-300 text-sm">
              Fraud Score: {fraudScore}%
            </p>
          </div>
        </div>

        {warnings.length > 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors text-sm px-3 py-1 rounded-lg hover:bg-white/10"
          >
            {isExpanded ? "Show Less" : `+${warnings.length - 2} More`}
          </button>
        )}
      </div>

      {/* Warnings List */}
      <div className="space-y-3">
        {displayWarnings.map((warning, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 p-3 bg-black/20 rounded-lg border border-white/10"
          >
            <span className="text-lg mt-0.5 flex-shrink-0">
              {warning.includes("🚫") || warning.includes("CRITICAL") ? "🚫" :
               warning.includes("🔴") || warning.includes("EXTREME") || warning.includes("HIGH") ? "🔴" :
               warning.includes("🟠") || warning.includes("MODERATE") ? "🟠" :
               warning.includes("⚠️") || warning.includes("WARNING") ? "⚠️" :
               "ℹ️"}
            </span>
            <p className="text-white text-sm leading-relaxed">
              {warning.replace(/^[🚫🔴🟠⚠️ℹ️👥📉📊]\s*/, "")}
            </p>
          </div>
        ))}
      </div>

      {/* Behavior Stats Summary */}
      {behaviorStats && (behaviorStats.attemptCount > 0 || behaviorStats.totalScans > 0) && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
            <div className="text-center">
              <div className="text-white font-semibold">{behaviorStats.totalScans || 0}</div>
              <div>Total Scans</div>
            </div>
            <div className="text-center">
              <div className="text-white font-semibold">{behaviorStats.attemptCount || 0}</div>
              <div>Payment Attempts</div>
            </div>
            {behaviorStats.attemptCount > 0 && (
              <>
                <div className="text-center">
                  <div className="text-white font-semibold">{behaviorStats.cancelCount || 0}</div>
                  <div>Cancellations</div>
                </div>
                <div className="text-center">
                  <div className="text-green-400 font-semibold">{behaviorStats.completionRate || 0}%</div>
                  <div>Success Rate</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Risk Assessment Summary */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="text-xs text-gray-400 text-center">
          {riskLevel === "FRAUD" && "⚠️ This transaction shows strong indicators of fraud. Proceed with extreme caution."}
          {riskLevel === "SUSPICIOUS" && "⚠️ This transaction requires careful review before proceeding."}
          {riskLevel === "SAFE" && "ℹ️ This transaction appears safe but always verify merchant details."}
        </div>
      </div>
    </div>
  );
};

export default SmartWarningCard;