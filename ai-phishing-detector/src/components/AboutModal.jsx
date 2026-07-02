import { motion } from "framer-motion";

function AboutModal({ show, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="about-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2>🛡️ About</h2>

        <p>
          <strong>AI Email Threat Detection</strong> is an Explainable AI based
          phishing detection system developed using <strong>React.js</strong>,
          <strong> Flask</strong> and <strong>Google Gemini AI</strong>.
        </p>

        <p>
          The system analyzes suspicious emails, verifies sender
          authentication (SPF, DKIM & DMARC), predicts phishing attempts and
          generates professional PDF security reports.
        </p>

        <p
          style={{
            marginTop: "20px",
            color: "#60a5fa",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Developed during the TMen Systems Internship
        </p>

        <button className="analyze-btn" onClick={onClose}>
          Close
        </button>
      </motion.div>
    </div>
  );
}

export default AboutModal;