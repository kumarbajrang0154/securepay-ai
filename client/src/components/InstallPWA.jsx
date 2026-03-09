import { useEffect, useState } from "react";

function InstallPWA() {

  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {

    const handler = (e) => {

      e.preventDefault();

      setDeferredPrompt(e);

    };

    window.addEventListener("beforeinstallprompt", handler);

  }, []);

  const installApp = async () => {

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    setDeferredPrompt(null);

  };

  if (!deferredPrompt) return null;

  return (
    <button
      onClick={installApp}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        background: "#2563eb",
        color: "white",
        padding: "12px 20px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer"
      }}
    >
      Install App
    </button>
  );
}

export default InstallPWA;