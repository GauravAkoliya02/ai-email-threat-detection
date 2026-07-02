import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaShieldAlt,
} from "react-icons/fa";

function Recommendation({ prediction }) {
  const phishing = prediction === "Phishing";

  return (
    <motion.div
      className="recommendation-card"
      initial={{ opacity: 0, y: 35 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <div className="recommendation-header">
        <FaShieldAlt />
<h2 style={{ color: "#FFFFFF" }}>
  AI Recommendations
</h2>
      </div>

      {phishing ? (
        <ul className="recommendation-list danger-list">
          <li>
            <FaTimesCircle />
            Do NOT click any links.
          </li>

          <li>
            <FaTimesCircle />
            Do NOT download attachments.
          </li>

          <li>
            <FaTimesCircle />
            Verify sender identity.
          </li>

          <li>
            <FaTimesCircle />
            Report this email to your IT Team.
          </li>

          <li>
            <FaTimesCircle />
            Delete the email immediately.
          </li>
        </ul>
      ) : (
        <ul className="recommendation-list safe-list">
          <li>
            <FaCheckCircle />
            No immediate threat detected.
          </li>

          <li>
            <FaCheckCircle />
            Verify unknown senders before replying.
          </li>

          <li>
            <FaCheckCircle />
            Avoid sharing sensitive information.
          </li>

          <li>
            <FaCheckCircle />
            Continue following security best practices.
          </li>
        </ul>
      )}
    </motion.div>
  );
}

export default Recommendation;