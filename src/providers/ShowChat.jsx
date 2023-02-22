import { useEffect, useMemo, useContext, useState, createContext } from "react";
import { MobileContext } from "./Mobile";

export const ShowChatContext = createContext();
function ShowChat({ children }) {
  const MobileData = useContext(MobileContext);
  const { isMobile } = MobileData;
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setShowChat(false);
    } else {
      setShowChat(true);
    }
  }, [isMobile]);
  const value = useMemo(() => ({ showChat, setShowChat }), [showChat]);
  return (
    <ShowChatContext.Provider value={value}>
      {children}
    </ShowChatContext.Provider>
  );
}

export default ShowChat;
