import {
  faAngleRight,
  faFaceLaugh,
  faGift,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import "./chat.css";
import { listenDocument, updateArrayField } from "../../firebase/util";
import moment from "moment/moment";
import { UserContext } from "../../providers/Users";
import CurrentChat from "../CurrentChat";
import Message from "../Messages";
import { UploadContext } from "../../providers/UploadFile";
import ImgPreview from "../ImgPreview";
import Icons from "../Icons";
import { IconsMessageContext } from "../../providers/IconsMessage";
import Gif from "../Gif";
import ChangeNickName from "../Modal/ChangeNickName";
import { ModalContext } from "../../providers/Modal";
import uuid from "react-uuid";
import { MobileContext } from "../../providers/Mobile";
import { ShowChatContext } from "../../providers/ShowChat";
import LoadingSkeleton from "../Loading/LoadingSkeleton";
import { NotificationsContext } from "../../providers/Notifications";
import sendMessageSound from "../../assets/sounds/send-message.mp3";
import recivedMessageSound from "../../assets/sounds/recived-message.mp3";
import EditDiscription from "../Modal/EditDescription";

function Chat({ className = "" }) {
  const audioRef = useRef();
  const [message, setMessage] = useState("");
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [currentUser, setCurrentUser] = useState(null);
  const ModalData = useContext(ModalContext);
  const { showModal } = ModalData;
  const [chat, setChat] = useState(null);
  const [myChat, setMyChat] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const inputMessageRef = useRef();
  const boardChatRef = useRef();
  const menuMessageRef = useRef();
  const menuItemRef = useRef();
  const UploadData = useContext(UploadContext);
  const { setShowUpload, setCaseUpload } = UploadData;
  const [showIcon, setShowIcon] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const IconMessageData = useContext(IconsMessageContext);
  const { iconMessage, setIconMessage, gifMessage, setGifMessage } =
    IconMessageData;
  const [nickName, setNickName] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const MobileData = useContext(MobileContext);
  const { isMobile } = MobileData;
  const ShowChatData = useContext(ShowChatContext);
  const { showChat } = ShowChatData;
  const chatContainerRef = useRef();
  const NotificationsData = useContext(NotificationsContext);
  const { setNotifications } = NotificationsData;
  const [amountMessage, setAmountMessage] = useState(null);
  const typeMessageRef = useRef();

  useEffect(() => {
    if (myChat !== null) {
      setAmountMessage(myChat.length);
    }
  }, []);

  useEffect(() => {
    if (
      myChat !== null &&
      amountMessage !== null &&
      myChat.length > amountMessage
    ) {
      audioRef.current.src = recivedMessageSound;
      audioRef.current.play();
      setAmountMessage(myChat.length);
    }
  }, [myChat]);

  useEffect(() => {
    if (!showChat) {
      chatContainerRef.current.classList.remove("show");
      typeMessageRef.current.classList.remove("show");
    } else {
      chatContainerRef.current.classList.add("show");
      typeMessageRef.current.classList.add("show");
    }
  }, [showChat]);

  useEffect(() => {
    if (currentUser !== null && currentUser.currentChat !== "") {
      listenDocument("Users", currentUser.currentChat, (data) => {
        if (data !== undefined) {
          setCurrentChat(data);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null && currentChat !== null) {
      listenDocument("Users", currentUser.id, (data) => {
        if (data !== undefined) {
          data.chats.forEach((e) => {
            if (e.id === currentChat.id) {
              setNickName(e.nickName);
            }
          });
        }
      });
    }
  }, [currentUser, currentChat]);

  const handleShowMenuMessage = () => {
    if (menuMessageRef && menuItemRef) {
      menuItemRef.current.classList.toggle("hidden-menu");
    }
  };

  useEffect(() => {
    boardChatRef.current.scrollTop = boardChatRef.current.scrollHeight;
  }, [userChat, myChat]);

  useEffect(() => {
    if (user !== null) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurrentUser(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (currentUser !== null && currentUser.currentChat !== "") {
      listenDocument("UserChat", currentUser.currentChat, (data) => {
        if (data !== undefined) {
          const result = data.users.filter(
            (user) => user.author.id === currentUser.id
          );
          setUserChat(result);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      listenDocument("UserChat", currentUser.id, (data) => {
        if (data !== undefined) {
          const result = data.users.filter(
            (user) => user.author.id === currentUser.currentChat
          );
          setMyChat(result);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (userChat !== null && myChat !== null) {
      const data = [...myChat, ...userChat].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      setChat(data);
    }
  }, [myChat, userChat]);

  useEffect(() => {
    const handlePressEnter = (e) => {
      if (e.keyCode === 13) {
        handleSendMessage();
      }
    };
    window.addEventListener("keydown", handlePressEnter);

    return () => {
      window.removeEventListener("keydown", handlePressEnter);
    };
  });

  const handleSendMessage = () => {
    if (currentUser !== null && message !== "" && audioRef.current) {
      const data = {
        author: {
          id: currentUser.id,
          username: currentUser.username,
          photo: currentUser.photo,
        },
        text: message,
        key: uuid(),
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      updateArrayField("UserChat", currentUser.currentChat, "users", data);
      audioRef.current.src = sendMessageSound;
      audioRef.current.play();
      setMessage("");
      inputMessageRef.current.focus();
    } else {
      setNotifications({
        type: "error",
        title: "Lỗi",
        message: "Không thể gửi tin nhắn, vui lòng thử lại sau",
      });
    }
  };

  useEffect(() => {
    if (iconMessage !== null && iconMessage !== "" && currentUser !== null) {
      const data = {
        author: {
          id: currentUser.id,
          username: currentUser.username,
          photo: currentUser.photo,
        },
        icon: iconMessage,
        key: uuid(),
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      updateArrayField("UserChat", currentUser.currentChat, "users", data);
      setIconMessage("");
    }
  }, [iconMessage]);

  useEffect(() => {
    if (gifMessage !== null && gifMessage !== "" && currentUser !== null) {
      const data = {
        author: {
          id: currentUser.id,
          username: currentUser.username,
          photo: currentUser.photo,
        },
        gif: gifMessage,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
        key: uuid(),
      };
      updateArrayField("UserChat", currentUser.currentChat, "users", data);
      setGifMessage("");
    }
  }, [gifMessage]);

  return (
    <>
      <audio src={""} hidden ref={audioRef}></audio>
      <ChangeNickName
        show={showModal}
        className={`${isMobile ? "mobile-modal" : ""}`}
      />
      <EditDiscription
        show={showModal}
        className={`${isMobile ? "mobile-modal" : ""}`}
      />
      <ImgPreview />
      <div
        className={`${className} chat-container flex items-center justify-center relative overflow-hidden p-0`}
        ref={chatContainerRef}
      >
        <Icons show={showIcon} />
        <Gif show={showGif} />
        <div
          className="flex-1 h-screen overflow-y-scroll scroll-smooth"
          ref={boardChatRef}
        >
          <CurrentChat />
          <ul className="mt-[90px] w-full pb-[200px]">
            {chat !== null &&
            chat.length > 0 &&
            currentUser.currentChat !== "" &&
            currentChat !== null
              ? chat.map((e) => {
                  if (e.author.id === currentChat.id) {
                    return (
                      <Message
                        key={e.key}
                        message={e.text}
                        file={e.file}
                        photo={currentChat.photo}
                        name={
                          nickName !== null && nickName !== ""
                            ? nickName
                            : e.author.username
                        }
                        createdAt={e.createdAt}
                        id={e.author.id}
                        icon={e.icon}
                        gif={e.gif}
                      />
                    );
                  } else if (e.author.id === currentUser.id) {
                    return (
                      <Message
                        key={e.key}
                        message={e.text}
                        file={e.file}
                        photo={currentUser.photo}
                        name={
                          nickName !== null && nickName !== ""
                            ? nickName
                            : e.author.username
                        }
                        createdAt={e.createdAt}
                        id={e.author.id}
                        icon={e.icon}
                        gif={e.gif}
                      />
                    );
                  }
                })
              : false}
          </ul>
        </div>
        <div
          className="bg-[var(--background)] type-message absolute bottom-0 left-0 right-0 w-full pt-6 flex justify-center items-center"
          ref={typeMessageRef}
        >
          <div className="w-full flex items-center justify-center mb-[20px]">
            <div
              className="cursor-pointer text-[var(--background)] m-2 bg-[var(--background-nav)]  rounded-full flex items-center overflow-hidden transition-all duration-300 ease-linear"
              ref={menuMessageRef}
            >
              <FontAwesomeIcon
                onClick={() => {
                  handleShowMenuMessage();
                }}
                icon={faAngleRight}
                className="p-2 flex items-center justify-center w-[18px] h-[18px] hover:opacity-[0.5] transition-all duration-300 ease-linear"
              />
              <div
                className="text-[var(--gray-color)] menu-item-mes overflow-hidden"
                ref={menuItemRef}
              >
                <FontAwesomeIcon
                  onClick={() => {
                    setShowUpload(true);
                    setCaseUpload("SendFile");
                  }}
                  icon={faImage}
                  className="ml-2 mr-2 hover:opacity-[0.5] transition-all duration-100 ease-linear"
                />
                <FontAwesomeIcon
                  icon={faFaceLaugh}
                  className="ml-2 mr-2 hover:opacity-[0.5] transition-all duration-100 ease-linear"
                  onClick={() => {
                    setShowIcon((prev) => {
                      return prev ? false : true;
                    });
                    setShowGif(false);
                  }}
                />
                <FontAwesomeIcon
                  onClick={() => {
                    setShowGif((prev) => {
                      return prev ? false : true;
                    });
                    setShowIcon(false);
                  }}
                  icon={faGift}
                  className="ml-2 mr-2 hover:opacity-[0.5] transition-all duration-100 ease-linear"
                />
              </div>
            </div>
            <input
              ref={inputMessageRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              className="input-type-message w-[50%] p-2 rounded-[500px] pl-4 bg-[rgba(0,0,0,0.2)]"
              id="inputID"
              placeholder="Nhập vào tin nhắn..."
            />
          </div>
        </div>
      </div>
    </>
  );
}

const Loading = ({ className = "" }) => {
  return (
    <>
      <div
        className={`${className} chat-container flex items-center justify-center relative p-0`}
      >
        <div className="flex-1 h-screen overflow-y-scroll scroll-smooth">
          <CurrentChat.Loading />
        </div>
        <div className="bg-[var(--background)] type-message absolute bottom-0 left-0 right-0 w-full pt-6 flex justify-center items-center">
          <div className="w-full flex items-center justify-center mb-[20px]">
            <div className="cursor-pointer text-[var(--icon-nav)] m-2 bg-[var(--text-color)]  rounded-full flex items-center overflow-hidden transition-all duration-300 ease-linear">
              <LoadingSkeleton className="w-[18px] h-[18px] p-4" />
            </div>
            <LoadingSkeleton className="w-[50%] p-4 rounded-lg" />
          </div>
        </div>
      </div>
    </>
  );
};

Chat.Loading = Loading;
export default Chat;
