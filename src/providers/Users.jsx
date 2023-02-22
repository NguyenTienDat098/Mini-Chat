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
} from "firebase/auth";
import { auth } from "../firebase/config";
import { addDocument, getSimpleDocument, updateField } from "../firebase/util";
import defaultAvatar from "../assets/imgs/default-avatar.png";
import { serverTimestamp } from "firebase/firestore";
import { NotificationsContext } from "./Notifications";
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
          updateField("Users", user.id, "startTime", serverTimestamp());
        } else {
          updateField("Users", user.id, "online", false);
          updateField("Users", user.id, "endTime", serverTimestamp());
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
          updateField("Users", user.id, "startTime", serverTimestamp());
        }
      } else {
        setOnline(false);
        if (user !== null) {
          updateField("Users", user.id, "online", false);
          updateField("Users", user.id, "endTime", serverTimestamp());
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  const register = (email, password, username) => {
    if (email !== null && password !== null && username !== null) {
      if (password.length < 8 || username.length < 8) {
        setNotifications({
          type: "warning",
          title: "Chú ý",
          message: "Mật khẩu và tên người dùng phải có ít nhất 8 kí tự !!!",
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
              startTime: serverTimestamp(),
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
                title: "Lỗi",
                message: "Email không hợp lệ !!!",
              });
            }
          });
      }
    } else {
      setNotifications({
        type: "danger",
        title: "Lỗi",
        message: "Vui lòng không bỏ trống các ô bên dưới !!!",
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
              updateField("Users", res.id, "startTime", serverTimestamp());
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
                title: "Lỗi",
                message: "Mật khẩu không đúng !!!",
              });
              break;
            case "auth/user-not-found":
              setNotifications({
                type: "danger",
                title: "Lỗi",
                message:
                  "Bạn chưa tạo tài khoản bằng email này, vui lòng đăng ký !!!",
              });
              break;
            case "auth/invalid-email":
              setNotifications({
                type: "danger",
                title: "Lỗi",
                message: "Email không đúng định dạng !!!",
              });
              break;
            default:
              break;
          }
        });
    } else {
      setNotifications({
        type: "danger",
        title: "Lỗi",
        message: "Vui lòng không bỏ trống các ô bên dưới !!!",
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
            startTime: serverTimestamp(),
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
          updateField("Users", user.uid, "startTime", serverTimestamp());
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
                startTime: serverTimestamp(),
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
          title: "Lỗi",
          message: "Đã xảy ra lỗi, vui lòng thử lại trong ít phút",
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
        updateField("Users", user.id, "endTime", serverTimestamp());
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
      logout,
    }),
    [user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default Users;
