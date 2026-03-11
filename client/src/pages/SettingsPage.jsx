import { useState } from "react";
import Navbar from "../components/Navbar";
import NeuralNetworkBackground from "../components/NeuralNetworkBackground";

export default function SettingsPage() {

  const savedSettings =
    JSON.parse(localStorage.getItem("appSettings")) || {};

  const [darkMode, setDarkMode] = useState(savedSettings.darkMode ?? true);
  const [notifications, setNotifications] = useState(savedSettings.notifications ?? true);
  const [fraudProtection, setFraudProtection] = useState(savedSettings.fraudProtection ?? true);

  const saveSettings = () => {
    const data = {
      darkMode,
      notifications,
      fraudProtection
    };

    localStorage.setItem("appSettings", JSON.stringify(data));

    alert("Settings saved");
  };

  const clearHistory = () => {
    localStorage.removeItem("transactions");
    alert("Transaction history cleared");
  };

  return (
    <div className="relative min-h-screen text-white">

      <NeuralNetworkBackground />
      <Navbar />

      <div className="relative z-10 max-w-3xl mx-auto mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-lg">

          <h2 className="text-2xl font-bold mb-6">Settings</h2>

          <div className="space-y-6">

            {/* Dark Mode */}

            <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg">
              <span>Dark Mode</span>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>

            {/* Notifications */}

            <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg">
              <span>Notifications</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
            </div>

            {/* AI Fraud Protection */}

            <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg">
              <span>AI Fraud Protection</span>
              <input
                type="checkbox"
                checked={fraudProtection}
                onChange={() => setFraudProtection(!fraudProtection)}
              />
            </div>

            {/* Clear History */}

            <div className="flex justify-between items-center bg-black/30 p-4 rounded-lg">
              <span>Clear Transaction History</span>
              <button
                onClick={clearHistory}
                className="bg-red-500 px-4 py-1 rounded-lg"
              >
                Clear
              </button>
            </div>

          </div>

          <button
            onClick={saveSettings}
            className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
          >
            Save Settings
          </button>

        </div>

      </div>

    </div>
  );
}