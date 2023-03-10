import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  FacebookAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase/config";
import { addDocument, getSimpleDocument, updateField } from "../firebase/util";
import defaultAvatar from "../assets/imgs/default-avatar.png";
import { NotificationsContext } from "./Notifications";
import moment from "moment";

export const UserContext = createContext();

function Users({ children }) {
  const [user, setUser] = useState(null);
  const [online, setOnline] = useState(window.navigator.onLine);
  const NotificationsData = useContext(NotificationsContext);
  const { setNotifications } = NotificationsData;

  useEffect(() => {
    const status = localStorage.getItem("user_status");
    if (status === "online") {
      setOnline(true);
    } else if (status === "offline") {
      setOnline(false);
    }
  }, []);

  // Check network
  useEffect(() => {
    const updateOnlineStatus = () => {
      if (user !== null) {
        if (online) {
          updateField("Users", user.id, "online", true);
          updateField("Users", user.id, "startTime", moment().format());
        } else {
          updateField("Users", user.id, "online", false);
          updateField("Users", user.id, "endTime", moment().format());
        }
      }
    };
    updateOnlineStatus();
  }, [online, user]);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
    };
    const handleOffline = () => {
      setOnline(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Check out current tag or close browser
  // In firefox
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      if (online) {
        localStorage.setItem("user_status", "online");
      } else {
        localStorage.setItem("user_status", "offline");
      }
      setOnline(false);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  // In chrome
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setOnline(true);
        if (user !== null) {
          updateField("Users", user.id, "online", true);
          updateField("Users", user.id, "startTime", moment().format());
        }
      } else {
        setOnline(false);
        if (user !== null) {
          updateField("Users", user.id, "online", false);
          updateField("Users", user.id, "endTime", moment().format());
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const loginWithFaceBook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // The signed-in user info.
        const user = result.user;
        const details = getAdditionalUserInfo(result);
        if (details.isNewUser) {
          const data = {
            username: user.displayName,
            id: user.uid,
            email: user.email,
            photo: user.photoURL,
            emailVerified: user.emailVerified,
            online: true,
            currentChat: "",
            chats: [],
            startTime: moment().format(),
            endTime: "",
            desc: "",
          };
          setUser(data);
          addDocument("Users", user.uid, data);
          addDocument("UserChat", user.uid, {
            users: [],
          });
        } else {
          updateField("Users", user.uid, "online", true);
          updateField("Users", user.uid, "startTime", moment().forMmat());
          getSimpleDocument("Users", user.uid)
            .then((user) => {
              const data = {
                username: user.username,
                id: user.id,
                email: user.email,
                photo: user.photo,
                emailVerified: user.emailVerified,
                online: user.online,
                currentChat: user.currentChat,
                chats: user.chats,
                startTime: moment().format(),
                endTime: user.endTime,
                desc: user.desc,
              };
              setUser(data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        // const credential = FacebookAuthProvider.credentialFromResult(result);
        // const accessToken = credential.accessToken;
        // console.log(user);
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = FacebookAuthProvider.credentialFromError(error);
        Console.log(errorCode + ":" + errorMessage);
        // ...
      });
  };

  const register = (email, password, username) => {
    if (email !== null && password !== null && username !== null) {
      if (password.length < 8 || username.length < 8) {
        setNotifications({
          type: "warning",
          title: "Ch?? ??",
          message: "M???t kh???u v?? t??n ng?????i d??ng ph???i c?? ??t nh???t 8 k?? t??? !!!",
        });
      } else {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const data = {
              id: user.uid,
              username: username,
              email: user.email,
              photo: defaultAvatar,
              emailVerified: user.emailVerified,
              password: password,
              online: true,
              currentChat: "",
              chats: [],
              startTime: moment().format(),
              endTime: "",
              desc: "",
            };
            addDocument("Users", user.uid, data);
            addDocument("UserChat", user.uid, {
              users: [],
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            console.log(errorCode);
            if (errorCode === "auth/invalid-email") {
              setNotifications({
                type: "danger",
                title: "L???i",
                message: "Email kh??ng h???p l??? !!!",
              });
            }
          });
      }
    } else {
      setNotifications({
        type: "danger",
        title: "L???i",
        message: "Vui l??ng kh??ng b??? tr???ng c??c ?? b??n d?????i !!!",
      });
    }
  };

  const login = (email, password) => {
    if (email !== null && password !== null) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          getSimpleDocument("Users", user.uid)
            .then((res) => {
              setUser(res);
              updateField("Users", res.id, "startTime", moment().forMmat());
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          switch (errorCode) {
            case "auth/wrong-password":
              setNotifications({
                type: "danger",
                title: "L???i",
                message: "M???t kh???u kh??ng ????ng !!!",
              });
              break;
            case "auth/user-not-found":
              setNotifications({
                type: "danger",
                title: "L???i",
                message:
                  "B???n ch??a t???o t??i kho???n b???ng email n??y, vui l??ng ????ng k?? !!!",
              });
              break;
            case "auth/invalid-email":
              setNotifications({
                type: "danger",
                title: "L???i",
                message: "Email kh??ng ????ng ?????nh d???ng !!!",
              });
              break;
            default:
              break;
          }
        });
    } else {
      setNotifications({
        type: "danger",
        title: "L???i",
        message: "Vui l??ng kh??ng b??? tr???ng c??c ?? b??n d?????i !!!",
      });
    }
  };

  useEffect(() => {
    const unsubcribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { email, uid, emailVerified } = currentUser;
        getSimpleDocument("Users", uid)
          .then((res) => {
            setUser({
              username: res.username,
              email: email,
              id: uid,
              photo: res.photo,
              emailVerified: emailVerified,
              online: res.online,
              currentChat: res.currentChat,
              chats: res.chats,
              startTime: res.startTime,
              endTime: res.endTime,
              desc: res.desc,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubcribe();
    };
  }, []);

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const details = getAdditionalUserInfo(result);
        if (details.isNewUser) {
          const data = {
            username: user.displayName,
            id: user.uid,
            email: user.email,
            photo: user.photoURL,
            emailVerified: user.emailVerified,
            online: true,
            currentChat: "",
            chats: [],
            startTime: moment().format(),
            endTime: "",
            desc: "",
          };
          setUser(data);
          addDocument("Users", user.uid, data);
          addDocument("UserChat", user.uid, {
            users: [],
          });
        } else {
          updateField("Users", user.uid, "online", true);
          updateField("Users", user.uid, "startTime", moment().forMmat());
          getSimpleDocument("Users", user.uid)
            .then((user) => {
              const data = {
                username: user.username,
                id: user.id,
                email: user.email,
                photo: user.photo,
                emailVerified: user.emailVerified,
                online: user.online,
                currentChat: user.currentChat,
                chats: user.chats,
                startTime: moment().format(),
                endTime: user.endTime,
                desc: user.desc,
              };
              setUser(data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        setNotifications({
          type: "danger",
          title: "L???i",
          message: "???? x???y ra l???i, vui l??ng th??? l???i trong ??t ph??t",
        });
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(`${errorCode}: ${errorMessage}`);
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
        // ...
      });
  };

  const logout = useCallback(() => {
    signOut(auth)
      .then(() => {
        setUser(null);
        updateField("Users", user.id, "online", false);
        updateField("Users", user.id, "endTime", moment().format());
        updateField("Users", user.id, "currentChat", "");
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      setUser,
      register,
      login,
      signInWithGoogle,
      loginWithFaceBook,
      logout,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default Users;
