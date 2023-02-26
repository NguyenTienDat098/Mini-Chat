import { useEffect, createContext, useState, useMemo, useContext } from "react";
import { listenDocument } from "../firebase/util";
import { UserContext } from "./Users";

export const CurrentAuthContext = createContext();

function CurrentAuth({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserChat, setCurrentUserChat] = useState(null);
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [nickName, setNickName] = useState(null);

  useEffect(() => {
    if (user !== null) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurrentUser((prev) => {
            return data;
          });
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (currentUser !== null && currentUser.currentChat !== "") {
      listenDocument("Users", currentUser.id, (data) => {
        if (data !== undefined) {
          data.chats.forEach((e) => {
            if (e.id === currentUser.currentChat) {
              setCurrentUserChat((prev) => {
                return e;
              });
            }
          });
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null && currentUser.currentChat !== null) {
      listenDocument("Users", currentUser.id, (data) => {
        if (data !== undefined) {
          data.chats.forEach((e) => {
            if (e.id === currentUser.currentChat && e.nickName !== "") {
              setNickName(e.nickName);
            } else {
              setNickName(null);
            }
          });
        }
      });
    }
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      currentUserChat,
      setCurrentUser,
      setCurrentUserChat,
      nickName,
    }),
    [currentUser, currentUserChat, nickName]
  );
  return (
    <CurrentAuthContext.Provider value={value}>
      {children}
    </CurrentAuthContext.Provider>
  );
}

export default CurrentAuth;
