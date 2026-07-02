import { motion } from "framer-motion";
import { FaShieldAlt, FaBrain, FaLock } from "react-icons/fa";

function Hero({ darkMode }) {
  return (
    <section className="hero-section">

      <motion.div
        className="hero-left"
        initial={{ opacity: 0, x: -80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >

        <span className="badge">
          AI Powered Cyber Security
        </span>

        <h1
  style={{
    color: darkMode ? "#ffffff" : "#111827",
    opacity: 1
  }}
>
  Detect Phishing Emails
  <br />
  with Explainable AI
</h1>
        <p
  style={{
    color: darkMode ? "#e2e8f0" : "#4b5563",
    opacity: 1
  }}
>
  Enterprise-grade phishing detection system that analyses suspicious
  emails using Artificial Intelligence, confidence scoring,
  threat indicators and security recommendations.
</p>

        <div className="hero-features">

          <div
  style={{
    color: darkMode ? "#ffffff" : "#111827",
  }}
>
  <FaShieldAlt />
  Secure Detection
</div>

          <div
  style={{
    color: darkMode ? "#ffffff" : "#111827",
  }}
>
  <FaBrain />
  AI Analysis
</div>
          <div
  style={{
    color: darkMode ? "#ffffff" : "#111827",
  }}
>
  <FaLock />
  Privacy First
</div>

        </div>

      </motion.div>

      <motion.div
        className="hero-right"
        initial={{ opacity: 0, x: 80 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >

        <div className="ai-card">

         <h2
  style={{
    color: darkMode ? "#ffffff" : "#111827",
  }}
>
  Threat Intelligence
</h2>

          <div className="circle"></div>

          <h3>99.4%</h3>

          <p
  style={{
    color: darkMode ? "#cbd5e1" : "#64748b",
  }}
>
  AI Detection Accuracy
</p>

        </div>

      </motion.div>

    </section>
  );
}

export default Hero;