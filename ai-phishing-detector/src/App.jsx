import Background from "./components/Background";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import EmailInput from "./components/EmailInput";
import ResultCard from "./components/ResultCard";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";
import AboutModal from "./components/AboutModal";

function App() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  
  const [result, setResult] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    safeCount: 0,
    suspiciousCount: 0,
    phishingCount: 0,
    totalScanned: 0,
    avgRiskScore: 0,
    runningRiskSum: 0
  });

  async function analyzeEmail() {
    if (!email.trim()) {
      alert("Please paste an email payload content to invoke cyber scanning engine.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // FIX HERE: Absolute pure string with no hidden markdown attributes
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      const data = await response.json();
      setResult(data);
      setTimeout(() => {
    setLoading(false);
}, 300);

      setDashboardStats(prev => {
        const newTotal = prev.totalScanned + 1;
        let s = prev.safeCount, susp = prev.suspiciousCount, phish = prev.phishingCount;
        
        if (data.prediction === "Safe") s += 1;
        else if (data.prediction === "Suspicious") susp += 1;
        else if (data.prediction === "Phishing") phish += 1;

        const currentRiskSum = prev.runningRiskSum + data.risk_score;
        return {
          totalScanned: newTotal,
          safeCount: s,
          suspiciousCount: susp,
          phishingCount: phish,
          runningRiskSum: currentRiskSum,
          avgRiskScore: Math.round(currentRiskSum / newTotal)
        };
      });

    } catch (err) {
      console.error("Critical Network Error:", err);
      alert("Backend analysis connection failed.");
    }
  }

  return (
    <div id = "dashboard"
     className={darkMode ? "app dark" : "app light"}>
      <Background/>
      <Navbar openAbout={() => setShowAbout(true)} />
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <div className="dashboard-grid">

  <div className="dashboard-card">
    <div className="card-icon">📊</div>
    <h5>Total Scans</h5>
    <h2>{dashboardStats.totalScanned}</h2>
  </div>

  <div className="dashboard-card safe">
  <div className="card-icon">🛡️</div>
  <h5>Safe Emails</h5>
  <h2>{dashboardStats.safeCount}</h2>
</div>

  <div className="dashboard-card danger">
  <div className="card-icon">🎣</div>
  <h5>Phishing</h5>
  <h2>{dashboardStats.phishingCount}</h2>
</div>

  <div className="dashboard-card risk">
  <div className="card-icon">📉</div>
  <h5>Average Risk</h5>
  <h2>{dashboardStats.avgRiskScore}%</h2>
</div>
</div>


      <Hero darkMode={darkMode} />
      
      <div className="main-content">

  <EmailInput
    email={email}
    setEmail={setEmail}
    analyzeEmail={analyzeEmail}
    loading={loading}
    darkMode={darkMode}
  />

  {loading && <LoadingScreen />}

</div>

{result && (
  <div id = "reports"
   className="result-wrapper">
    <ResultCard
      result={result}
      darkMode={darkMode}
    />
  </div>
)}

<AboutModal
  show={showAbout}
  onClose={() => setShowAbout(false)}
  darkMode={darkMode}
/>
      <Footer/>
    </div>
  );
}

export default App;