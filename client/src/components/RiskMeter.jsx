import { useEffect, useState } from "react";

export default function RiskMeter({ score }) {

  const [progress, setProgress] = useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      setProgress(old => {

        if (old >= score) {
          clearInterval(timer);
          return score;
        }

        return old + 1;

      });

    }, 20);

  }, [score]);

  const getColor = () => {
    if (progress < 40) return "#22c55e";
    if (progress < 70) return "#facc15";
    return "#ef4444";
  };

  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference - (progress / 100) * circumference;

  return (

    <div className="flex flex-col items-center">

      <svg width="220" height="220">

        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke="#1f2937"
          strokeWidth="15"
          fill="none"
        />

        <circle
          cx="110"
          cy="110"
          r={radius}
          stroke={getColor()}
          strokeWidth="15"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
        />

      </svg>

      <div className="absolute text-center">

        <h2 className="text-3xl font-bold">
          {progress}%
        </h2>

        <p className="text-gray-400 text-sm">
          Fraud Risk
        </p>

      </div>

    </div>

  );
}