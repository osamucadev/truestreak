import { createContext, useContext, useEffect, useState } from "react";
import themes from "../themes/themes.json";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(
    localStorage.getItem("truestreak-theme") || "orange"
  );

  useEffect(() => {
    const themeConfig = themes[theme];
    if (!themeConfig) return;

    const root = document.documentElement;

    Object.entries(themeConfig).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    localStorage.setItem("truestreak-theme", theme);
  }, [theme]);

  const availableThemes = Object.keys(themes);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: availableThemes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
