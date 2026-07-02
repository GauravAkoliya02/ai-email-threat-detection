import { FaShieldAlt } from "react-icons/fa";

function Navbar({ openAbout }) {
  return (
    <nav className="navbar">
      <div className="logo">
        <FaShieldAlt size={28} />
        <span>AI Email Threat Detection</span>
      </div>

      <div className="nav-links">
        <a href="#dashboard">Dashboard</a>
        <a href="#reports">Reports</a>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            openAbout();
          }}
        >
          About
        </a>
      </div>
    </nav>
  );
}

export default Navbar;