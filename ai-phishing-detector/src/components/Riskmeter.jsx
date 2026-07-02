import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "../App.css";

function RiskMeter({ prediction, confidence, risk_score, darkMode }) {
  const score = risk_score ?? confidence;
const isPhishing = score >= 76;

  const isLightTheme = document.body.classList.contains("light-theme");

  return (
    <motion.div
      className="risk-meter"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <h3>🔒 AI Risk Score</h3>

      <div className="meter-wrapper">
        <CircularProgressbar
  value={score}
  text={`${score}%`}
  strokeWidth={12}
  styles={buildStyles({
    textColor: "#ffffff",
    pathColor: isPhishing ? "#ef4444" : "#22c55e",
    trailColor: "#1f2937",
    pathTransitionDuration: 1.5,
    strokeLinecap: "round",
    rotation: 0.25,
  })}
/>
      </div>

      <p className="risk-text">
        {isPhishing
          ? "High probability of phishing detected."
          : "No significant phishing indicators detected."}
      </p>
    </motion.div>
  );
}

export default RiskMeter;