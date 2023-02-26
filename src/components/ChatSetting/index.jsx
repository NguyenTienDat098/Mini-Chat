import {
  faArrowLeft,
  faBellSlash,
  faBrush,
  faChevronRight,
  faImages,
  faMagnifyingGlass,
  faPalette,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { listenDocument } from "../../firebase/util";
import { ModalContext } from "../../providers/Modal";
import { UserContext } from "../../providers/Users";
import "./chatsetting.css";
import defaultAva from "../../assets/imgs/default-avatar.png";
import Slick from "../Slick";
import { ThemeContext } from "../../providers/Themes";
import { ChatSettingContext } from "../../providers/ChatSetting";
import { ImagePreviewContext } from "../../providers/ImagePreview";
import { CurrentAuthContext } from "../../providers/CurrentAuth";

const THEMES = [
  {
    name: "dark",
    color: "#242526",
  },
  {
    name: "light",
    color: "#fff",
  },
];
const COLORS = [
  {
    name: "purple",
    color: "#6d214f",
  },
  // {
  //   name: "green",
  //   color: "#10ac84",
  // },
  // {
  //   name: "blue",
  //   color: "#48dbfb",
  // },
];

function ChatSetting({ show, className }) {
  const ModalData = useContext(ModalContext);
  const { setShowModal } = ModalData;
  const chatSettingRef = useRef();
  const [showSlick, setShowSlick] = useState(false);
  const ThemeData = useContext(ThemeContext);
  const { setTheme } = ThemeData;
  const ChatSettingData = useContext(ChatSettingContext);
  const { setShowChatSetting } = ChatSettingData;
  const ImagePreviewData = useContext(ImagePreviewContext);
  const { setImagePreview } = ImagePreviewData;
  const CurrentAuthData = useContext(CurrentAuthContext);
  const { currentUserChat, nickName } = CurrentAuthData;

  useEffect(() => {
    if (show) {
      chatSettingRef.current.classList.add("show");
    } else {
      chatSettingRef.current.classList.remove("show");
    }
  }, [show]);

  useEffect(() => {
    const optionRooms = document.querySelectorAll(".setting-option");
    optionRooms.forEach((e) => {
      e.addEventListener("click", () => {
        e.childNodes[1].classList.toggle("icon-rotate");
        e.nextSibling.classList.toggle("show");
      });
    });
  }, []);

  return (
    <>
      <Slick show={showSlick} handleShow={setShowSlick} />
      <div
        className={`${className} p-[10px] select-none chat-setting bg-[var(--background-nav)]`}
        ref={chatSettingRef}
      >
        <div
          className="w-[32px] h-[32px] p-1 absolute top-[10px] left-[10px] bg-[var(--overlay)] hidden items-center justify-center rounded-full cursor-pointer btn-back-chatsetting max-[460px]:flex "
          onClick={() => {
            setShowChatSetting(false);
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <div className="flex-col flex items-center justify-center">
          <img
            src={currentUserChat !== null ? currentUserChat.photo : defaultAva}
            alt="chat"
            className="img-chat cursor-pointer"
            onClick={() => {
              setImagePreview(currentUserChat.photo);
            }}
          />
          {currentUserChat !== null ? (
            <span className="text-sm mt-2 font-[600]">
              {nickName !== null && nickName !== ""
                ? nickName
                : currentUserChat.username}
            </span>
          ) : (
            <span className="text-sm mt-2 font-[600]">Unknown User</span>
          )}
          <div className="flex items-center justify-center w-full">
            <div className="flex flex-col m-2 items-center justify-center">
              <FontAwesomeIcon
                icon={faBellSlash}
                className="p-2 rounded-full bg-[var(--light-gray)] w-[20px] h-[20px]"
              />
              <span className="text-[12px] mt-1">Bật lại</span>
            </div>
            <div className="flex flex-col m-2 items-center justify-center">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="p-2 rounded-full bg-[var(--light-gray)] w-[20px] h-[20px]"
              />
              <span className="text-[12px] mt-1">Tìm kiếm</span>
            </div>
          </div>
        </div>
        <div className="text-[var(--text-nav)] mt-4">
          <ul className="flex flex-col items-center justify-center ">
            <li className="w-full flex items-center flex-col justify-between rounded-lg ease-linear cursor-pointer overflow-hidden">
              <div className="w-full flex items-center justify-between hover:bg-[var(--light-gray)] transition-all duration-100 font-[500] text-[15px] cursor-pointer p-3 rounded-lg setting-option">
                <span>Tùy chỉnh đoạn chat</span>
                <FontAwesomeIcon icon={faChevronRight} className="icon" />
              </div>
              <ul className="w-full list-option-item">
                <li
                  className="flex  hover:bg-[var(--light-gray)] transition-all duration-100 rounded-lg items-center p-2"
                  onClick={() => {
                    setShowModal({
                      modalName: "change_nick_name",
                      active: true,
                    });
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSignature}
                    className="w-[20px] h-[20px] p-1 rounded-full bg-[var(--light-gray)]  flex items-center justify-center"
                  />
                  <span className="ml-4 ">Chỉnh sửa biệt danh</span>
                </li>
                <li className="flex  hover:bg-[var(--light-gray)] transition-all duration-100 rounded-lg  p-2 flex-col">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faPalette}
                      className="w-[20px] h-[20px] p-1 rounded-full bg-[var(--light-gray)]  flex items-center justify-center"
                    />
                    <span className="ml-4 ">Thay màu sắc đoạn chat</span>
                  </div>
                  <ul className="flex p-1 ml-[45px] w-fit bg-[var(--overlay)] mt-2 rounded-lg">
                    {COLORS.map((e) => {
                      return (
                        <li
                          className={`w-[32px] h-[32px] rounded-lg m-1 hover:scale-[1.2] transition-all duration-100 ease-linear`}
                          style={{
                            backgroundColor: e.color,
                          }}
                          key={e.name}
                          onClick={() => {
                            setTheme(e.name);
                          }}
                        ></li>
                      );
                    })}
                  </ul>
                </li>
                <li className="flex  hover:bg-[var(--light-gray)] transition-all duration-100 rounded-lg p-2 flex-col">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faBrush}
                      className="w-[20px] h-[20px] p-1 rounded-full bg-[var(--light-gray)]  flex items-center justify-center"
                    />
                    <span className="ml-4 ">Thay đổi theme</span>
                  </div>
                  <ul className="flex p-1 ml-[45px] w-fit bg-[var(--overlay)] mt-2 rounded-lg">
                    {THEMES.map((e) => {
                      return (
                        <li
                          className={`w-[32px] h-[32px] rounded-lg m-1 hover:scale-[1.2] transition-all duration-100 ease-linear`}
                          style={{
                            backgroundColor: e.color,
                          }}
                          key={e.name}
                          onClick={() => {
                            setTheme(e.name);
                          }}
                        ></li>
                      );
                    })}
                  </ul>
                </li>
              </ul>
            </li>
            <li className="w-full flex items-center flex-col justify-between rounded-lg ease-linear cursor-pointer overflow-hidden">
              <div className="w-full flex items-center justify-between hover:bg-[var(--light-gray)] transition-all duration-100 font-[500] text-[15px] cursor-pointer p-3 rounded-lg setting-option">
                <span>File phương tiện</span>
                <FontAwesomeIcon icon={faChevronRight} className="icon" />
              </div>
              <ul className="w-full list-option-item">
                <li
                  className="flex  hover:bg-[var(--light-gray)] transition-all duration-100 rounded-lg items-center p-2"
                  onClick={() => {
                    setShowSlick(true);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faImages}
                    className="w-[20px] h-[20px] p-1 rounded-full bg-[var(--light-gray)]  flex items-center justify-center"
                  />
                  <span className="ml-4 ">Hình ảnh</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ChatSetting;
