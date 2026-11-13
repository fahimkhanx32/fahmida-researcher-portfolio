import { createContext, useContext, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

// Create Context
const ThemeContext = createContext();

// ✅ Provider
export const ThemeProvider = ({ children }) => {
  // Initial theme comes from the pre-paint script in index.html (saved choice, else system preference),
  // so there is no flash and no effect-driven re-render.
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
      ? "dark"
      : "light"
  );

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("dark", newTheme === "dark");
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      /* storage unavailable */
    }
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ Hook
export const useTheme = () => useContext(ThemeContext);

// ✅ Reusable Button Component
export const ThemeToggleButton = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center w-8 h-8 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700 transition ${className}`}
    >
      {theme === "dark" ? (
        <FaSun className="w-5 h-5 text-white" />
      ) : (
        <FaMoon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};