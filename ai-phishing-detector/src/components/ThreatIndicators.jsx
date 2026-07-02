import { motion } from "framer-motion";
import {
  FaExclamationTriangle,
  FaLink,
  FaUserShield,
  FaGlobe,
} from "react-icons/fa";

function ThreatIndicators({ result, darkMode }) {
  const panel = result?.threat_indicators_panel || {};

const domainRep = result?.domain_reputation || "Unknown";

  const indicators = [
  {
    icon: <FaExclamationTriangle />,
    title: "Urgent Language",
    status: panel.urgent_language ? "Detected" : "Not Found",
  },
  {
    icon: <FaLink />,
    title: "Suspicious Links",
    status: panel.suspicious_links ? "Detected" : "Not Found",
  },
  {
    icon: <FaUserShield />,
    title: "Credential Request",
    status: panel.credential_request ? "Detected" : "Not Found",
  },
  {
    icon: <FaGlobe />,
    title: "Domain Reputation",
    status: domainRep,
  },
];

  return (
    <motion.div
      className="threat-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <h2
  style={{
    color: darkMode ? "#FFFFFF" : "#111827",
  }}
>
  Threat Indicators
</h2>

      <div className="indicator-grid">
        {indicators.map((item, index) => (
          <div className="indicator-card" key={index}>
            <div className="indicator-icon">
              {item.icon}
            </div>

            <h3 style={{ color: "#FFFFFF" }}>
  {item.title}
</h3>

            <span
              className={
  item.status === "Detected" ||
  item.status === "Suspicious"
    ? "indicator-danger"
    : "indicator-safe"
}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ThreatIndicators;