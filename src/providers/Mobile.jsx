import { useEffect, createContext, useMemo, useState } from "react";

export const MobileContext = createContext();
function Mobile({ children }) {
  const [isMobile, setIsMoblie] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  const handleResize = () => {
    if (window.innerWidth > 460 && window.innerWidth < 1024) {
      setIsTablet(true);
      setIsMoblie(false);
    } else if (window.innerWidth < 460) {
      setIsTablet(false);
      setIsMoblie(true);
    } else {
      setIsTablet(false);
      setIsMoblie(false);
    }
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener("DOMContentLoaded", handleResize());

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("DOMContentLoaded", handleResize);
    };
  }, []);

  const value = useMemo(() => ({ isMobile, isTablet }), [isMobile, isTablet]);

  return (
    <MobileContext.Provider value={value}>{children}</MobileContext.Provider>
  );
}

export default Mobile;
