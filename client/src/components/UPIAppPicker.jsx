import { useState } from "react";

const UPIAppPicker = ({ upiId, merchant, amount, onClose }) => {
  const [selectedApp, setSelectedApp] = useState(null);

  // Payment apps configuration
  const paymentApps = [
    {
      name: "Google Pay",
      package: "com.google.android.apps.nbu.paisa.user",
      icon: "/icons/gpay.svg",
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "PhonePe",
      package: "com.phonepe.app",
      icon: "/icons/phonepe.svg",
      color: "from-purple-500 to-purple-600"
    },
    {
      name: "Paytm",
      package: "net.one97.paytm",
      icon: "/icons/paytm.svg",
      color: "from-blue-400 to-blue-500"
    },
    {
      name: "BHIM",
      package: "in.org.npci.upiapp",
      icon: "/icons/bhim.svg",
      color: "from-green-500 to-green-600"
    }
  ];

  const generateUPILink = () => {
    const encodedMerchant = encodeURIComponent(merchant || "Unknown Merchant");
    const currency = "INR";

    if (amount > 0) {
      return `upi://pay?pa=${upiId}&pn=${encodedMerchant}&am=${amount}&cu=${currency}`;
    } else {
      return `upi://pay?pa=${upiId}&pn=${encodedMerchant}&cu=${currency}`;
    }
  };

  const generateIntentUrl = (appPackage) => {
    const upiLink = generateUPILink();
    // Remove the upi:// scheme for intent
    const upiParams = upiLink.replace('upi://', '');

    // Create Android intent URL
    return `intent://${upiParams}#Intent;scheme=upi;package=${appPackage};end;`;
  };

  const handleAppSelect = (app) => {
    setSelectedApp(app);

    // Mobile detection
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) {
      showMessage("Please use this feature on a mobile device to open payment apps.", "error");
      return;
    }

    if (!upiId) {
      showMessage("Invalid UPI ID. Cannot proceed with payment.", "error");
      return;
    }

    try {
      // Show loading message
      showMessage(`Opening ${app.name}...`, "info");

      // Generate intent URL for specific app
      const intentUrl = generateIntentUrl(app.package);

      console.log(`🚀 Opening ${app.name} with intent:`, intentUrl);

      // Redirect to the specific payment app
      window.location.href = intentUrl;

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error(`❌ Error opening ${app.name}:`, error);

      // Fallback to generic UPI link
      try {
        const fallbackUrl = generateUPILink();
        console.log("🔄 Falling back to generic UPI link:", fallbackUrl);
        window.location.href = fallbackUrl;
        onClose();
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError);
        showMessage("Unable to open payment app. Please try again.", "error");
      }
    }
  };

  const showMessage = (message, type = "info") => {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.payment-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = 'payment-message';
    messageEl.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : '#3b82f6'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: system-ui, sans-serif;
        max-width: 90vw;
        text-align: center;
      ">
        ${message}
        <button onclick="this.parentElement.remove()" style="
          margin-left: 16px;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 18px;
        ">×</button>
      </div>
    `;
    document.body.appendChild(messageEl);

    // Auto-remove after 4 seconds
    setTimeout(() => messageEl.remove(), 4000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Choose Payment App
          </h2>
          <p className="text-gray-400 text-sm">
            Select your preferred UPI payment app
          </p>
        </div>

        {/* Payment Apps Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {paymentApps.map((app, index) => (
            <button
              key={index}
              onClick={() => handleAppSelect(app)}
              disabled={selectedApp?.name === app.name}
              className={`
                relative bg-gray-800 hover:bg-gray-700 disabled:opacity-50
                border border-gray-600 hover:border-gray-500
                rounded-xl p-4 transition-all duration-200
                transform hover:scale-105 active:scale-95
                ${selectedApp?.name === app.name ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              {/* App Icon */}
              <div className="w-12 h-12 mb-2 flex items-center justify-center">
                <img
                  src={app.icon}
                  alt={`${app.name} icon`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* App Name */}
              <div className="text-white font-semibold text-sm text-center">
                {app.name}
              </div>

              {/* Loading indicator */}
              {selectedApp?.name === app.name && (
                <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Payment Details */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-500 text-center space-y-1">
            <div>Merchant: {merchant || "Unknown"}</div>
            <div>UPI ID: {upiId}</div>
            <div>Amount: ₹{amount || "Not specified"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UPIAppPicker;