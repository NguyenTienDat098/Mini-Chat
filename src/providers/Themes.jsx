import { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();
const currentTheme = localStorage.getItem("theme");
function Themes({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme")
      ? JSON.parse(localStorage.getItem("theme"))
      : "light"
  );
  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(theme));
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export default Themes;
