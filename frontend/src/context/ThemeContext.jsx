import { createContext, useContext, useEffect, useState } from "react";
import { useNotification } from "./NotificationContext";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { showNotification } = useNotification();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Apply the theme immediately when toggled
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      showNotification(darkMode ? "Dark mode enabled" : "light mode enabled");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      showNotification(darkMode ? "Dark mode enabled" : "light mode enabled");
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook for using Theme
export const useTheme = () => useContext(ThemeContext);
