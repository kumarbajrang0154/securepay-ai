import { useEffect, useState } from "react";

function SplashScreen({ children }) {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-blue-600 text-white text-2xl font-bold">
        SecurePay AI
      </div>
    );
  }

  return children;
}

export default SplashScreen;