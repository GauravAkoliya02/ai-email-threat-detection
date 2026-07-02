import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle({ darkMode, setDarkMode }) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      setDarkMode(false);
      document.body.classList.add("light-theme");
    }
  }, []);

  function toggleTheme() {
  const newTheme = !darkMode;

  setDarkMode(newTheme);

  if (newTheme) {
    document.body.classList.remove("light-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.add("light-theme");
    localStorage.setItem("theme", "light");
  }
}

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
    >
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle;