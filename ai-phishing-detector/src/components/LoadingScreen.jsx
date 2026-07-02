import { useEffect, useState } from "react";

const steps = [
  "🧠 Initializing Gemini AI...",
  "📧 Parsing Email Content...",
  "🔍 Scanning URLs...",
  "🛡️ Checking Sender Authentication...",
  "⚠️ Detecting Social Engineering...",
  "📊 Generating Threat Report..."
];

function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
  <div className="loading-card">

    <div className="loader"></div>

    <h2>AI Analysis In Progress</h2>

    <div className="loading-steps">

      {steps.map((step, i) => (
        <div
          key={i}
          className={i <= index ? "step active" : "step"}
        >
          {step}
        </div>
      ))}

    </div>

  </div>
);
}

export default LoadingScreen;