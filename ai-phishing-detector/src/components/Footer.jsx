import { FaGithub, FaLinkedin, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-left">
        <FaShieldAlt />
        <span>AI Email Threat Detection System</span>
      </div>

      <div className="footer-center">
        <p>
          © 2026 | Final Year Cyber Security Project | React • Flask • AI
        </p>
      </div>

      <div className="footer-right">
        <a
          href="https://github.com/GauravAkoliya02"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={22} />
        </a>

        <a
          href="https://www.linkedin.com/in/gaurav-akoliya-aa8a3636a?utm_source=share_via&utm_content=profile&utm_medium=member_android"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={22} />
        </a>
      </div>
    </motion.footer>
  );
}

export default Footer;