import { createContext, useMemo, useState } from "react";

export const ChatSettingContext = createContext();
function ChatSetting({ children }) {
  const [showChatSetting, setShowChatSetting] = useState(false);

  const value = useMemo(
    () => ({
      showChatSetting,
      setShowChatSetting,
    }),
    [showChatSetting]
  );
  return (
    <ChatSettingContext.Provider value={value}>
      {children}
    </ChatSettingContext.Provider>
  );
}

export default ChatSetting;
