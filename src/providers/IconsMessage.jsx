import { createContext, useMemo, useState } from "react";

export const IconsMessageContext = createContext();
function IconsMessage({ children }) {
  const [iconMessage, setIconMessage] = useState("");
  const [gifMessage, setGifMessage] = useState("");

  const value = useMemo(
    () => ({
      iconMessage,
      gifMessage,
      setGifMessage,
      setIconMessage,
    }),
    [iconMessage, gifMessage]
  );
  return (
    <IconsMessageContext.Provider value={value}>
      {children}
    </IconsMessageContext.Provider>
  );
}

export default IconsMessage;
