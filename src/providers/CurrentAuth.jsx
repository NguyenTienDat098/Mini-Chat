import { serverTimestamp } from "firebase/firestore";
import moment from "moment/moment";
import { useEffect, createContext, useState, useMemo, useContext } from "react";
import {
  getMutipleDocuments,
  listenDocument,
  updateField,
} from "../firebase/util";
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

  const updateStatus = (currentUser, online) => {
    if (!online) {
      getMutipleDocuments("Users", "username", ">=", "").then((res) => {
        res.forEach((user) => {
          let dataUpdate = user.chats;
          dataUpdate.forEach((e) => {
            if (e.id === currentUser.id) {
              e.online = online;
              e.endTime = moment().format();
            }
          });
          updateField("Users", user.id, "chats", dataUpdate);
        });
      });
    } else {
      getMutipleDocuments("Users", "username", ">=", "").then((res) => {
        res.forEach((user) => {
          let dataUpdate = user.chats;
          dataUpdate.forEach((e) => {
            if (e.id === currentUser.id) {
              e.online = online;
            }
          });
          updateField("Users", user.id, "chats", dataUpdate);
        });
      });
    }
  };

  useEffect(() => {
    if (currentUser !== null) {
      updateStatus(currentUser, currentUser.online);
    }
  }, [currentUser]);

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
