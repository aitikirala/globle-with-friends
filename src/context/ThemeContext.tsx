import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Use context as follows:
// ThemeProvider > ThemeContext > themeContext > theme & setTheme

type ProviderProps = {
  children: ReactNode;
};

type Theme = {
  nightMode: boolean;
  highContrast: boolean;
  prideMode: boolean;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>> | null;
};

// Initial Theme (default: day mode)
const initialTheme: Theme = {
  nightMode: false, // Default to day mode initially
  highContrast: false,
  prideMode: false,
};

const initialThemeContext: ThemeContextType = {
  theme: initialTheme,
  setTheme: null,
};

export const ThemeContext =
  createContext<ThemeContextType>(initialThemeContext);

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [storedTheme, storeTheme] = useLocalStorage<Theme>(
    "theme",
    initialTheme
  );
  const [theme, setTheme] = useState(storedTheme);

  // Function to check and update theme based on time
  const updateThemeBasedOnTime = () => {
    const currentHour = new Date().getHours();

    // Set night mode between 8 PM (20:00) and 4 AM (04:00)
    if (currentHour >= 20 || currentHour < 4) {
      setTheme((prevTheme) => ({
        ...prevTheme,
        nightMode: true, // Switch to night mode
      }));
    } else {
      setTheme((prevTheme) => ({
        ...prevTheme,
        nightMode: false, // Switch to day mode
      }));
    }
  };

  // Set the theme based on the time when the app loads
  useEffect(() => {
    updateThemeBasedOnTime(); // Set initial theme based on the current time
  }, []);

  // Store the theme whenever it changes
  useEffect(() => {
    storeTheme(theme);
  }, [storeTheme, theme]);

  // Check the time every minute and update the theme
  useEffect(() => {
    const interval = setInterval(updateThemeBasedOnTime, 60 * 1000); // Check every minute
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
