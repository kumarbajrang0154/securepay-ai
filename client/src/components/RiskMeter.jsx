import { useEffect, useState } from "react";

function RiskMeter({ score }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setValue((prev) => {
        if (prev >= score) {
          clearInterval(timer);
          return score;
        }
        return prev + 1;
      });
    }, 15);

    return () => clearInterval(timer);
  }, [score]);

  const getColor = () => {
    if (score > 70) return "text-red-500";
    if (score > 40) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="text-center mt-6">

      <div className={`text-5xl font-bold ${getColor()}`}>
        {value}%
      </div>

      <p className="text-gray-600 mt-2">
        Fraud Probability
      </p>

    </div>
  );
}

export default RiskMeter;