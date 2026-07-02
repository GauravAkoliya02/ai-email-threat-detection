import { motion } from "framer-motion";
import { useRef } from "react";
import { FaUpload } from "react-icons/fa";

function EmailInput({
  email,
  setEmail,
  analyzeEmail,
  loading,
  darkMode,
}) {
  const fileInputRef = useRef(null);

const handleFileUpload = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    setEmail(event.target.result);
  };

  reader.readAsText(file);
};
  return (
    <motion.section
      className="email-section"
      initial={{ opacity: 0, y: 70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="email-box">

        <h2
  style={{
    color: document.body.classList.contains("light-theme")
      ? "#111827"
      : "#ffffff",
  }}
>
  Analyze Suspicious Email
</h2>

        <p
  style={{
    color: darkMode ? "#cbd5e1" : "#64748b",
    lineHeight: "1.8"
  }}
>
  Paste complete email content below. Our AI engine will analyse phishing indicators,
  malicious intent and social engineering patterns.
</p>
<div style={{ marginBottom: "15px" }}>
  <button
    type="button"
    className="analyze-btn"
    onClick={() => fileInputRef.current.click()}
  >
    <FaUpload /> Upload .eml
  </button>

  <input
    ref={fileInputRef}
    type="file"
    accept=".eml,.txt"
    style={{ display: "none" }}
    onChange={handleFileUpload}
  />
</div>


        <textarea
          rows={14}
          placeholder="Paste complete email here..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
  type="file"
  accept=".eml,.txt"
  ref={fileInputRef}
  style={{ display: "none" }}
  onChange={handleFileUpload}
/>

        <button
          className="analyze-btn"
          onClick={analyzeEmail}
          disabled={loading}
        >
          {loading ? (
            <>
  <span className="loader"></span>
  🤖 AI Analyzing...
</>
          ) : (
            "Analyze Email"
          )}
        </button>

      </div>
    </motion.section>
  );
}

export default EmailInput;