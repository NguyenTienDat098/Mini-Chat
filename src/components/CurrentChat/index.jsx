import { faArrowLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { listenDocument } from "../../firebase/util";
import { ChatSettingContext } from "../../providers/ChatSetting";
import { ShowChatContext } from "../../providers/ShowChat";
import { UserContext } from "../../providers/Users";
import LoadingSkeleton from "../Loading/LoadingSkeleton";
import { formatDistance } from "date-fns";

function CurrentChat() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const ChatSettingData = useContext(ChatSettingContext);
  const { setShowChatSetting } = ChatSettingData;
  const [currentUser, setCurrentUser] = useState(null);
  const [userChat, setUserChat] = useState(null);
  const [nickName, setNickName] = useState(null);
  const ShowChatData = useContext(ShowChatContext);
  const { setShowChat } = ShowChatData;

  useEffect(() => {
    if (currentUser !== null && userChat !== null) {
      listenDocument("Users", currentUser.id, (data) => {
        if (data !== undefined) {
          data.chats.forEach((e) => {
            if (e.id === userChat.id) {
              setNickName(e.nickName);
            }
          });
        }
      });
    }
  }, [currentUser, userChat]);

  const getTimeOffline = (endtime) => {
    const now = new Date();
    if (endtime !== "") {
      const end = endtime.toDate();
      const timeInEnglish = formatDistance(now, end, { addSuffix: true });
      const timeInVietnamese = timeInEnglish

        .replace(/(in)/, "Hoạt động")
        .replace(/(ago)/, "trước")
        .replace(/(minutes)/, "phút trước")
        .replace(/(minute)/, "phút")
        .replace(/(less)/, "vài")
        .replace(/(than)/, "trước")
        .replace(/(a)/, "")
        .replace(/(about)/, "khoảng")
        .replace(/(bout)/, "khoảng")
        .replace(/(hour)/, "giờ")
        .replace(/(hours)/, "giờ trước")
        .replace(/(dy)/, "ngày")
        .replace(/(s)/, "");
      return timeInVietnamese;
    }
  };

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
      listenDocument("Users", currentUser.currentChat, (data) => {
        if (data !== undefined) {
          setUserChat(data);
        }
      });
    }
  }, [currentUser]);

  if (userChat !== null) {
    return (
      <div className="absolute top-[0] left-[0] w-full p-2 flex items-center border-b border-[var(--border-color)] z-20 bg-[var(--background)] text-[var(--text-color)]">
        <div
          className="cursor-pointer hidden items-center justify-center w-[32px] h-[32px] hover:text-white transition-all duration-100 ease-linear max-[460px]:flex"
          onClick={() => {
            setShowChat(false);
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </div>
        <img
          src={userChat.photo}
          alt="avatar"
          className="w-[30px] h-[30px] rounded-full"
        />
        <div className="flex  flex-col justify-center">
          <span className="ml-4 font-[600] text-[var(--background-nav)]">
            {nickName !== null && nickName !== ""
              ? nickName
              : userChat.username}
          </span>
          {userChat.online ? (
            <span className="ml-4 text-[14px] text-[var(--online)]">
              online
            </span>
          ) : (
            <span className="ml-4 text-[13px] font-[500] text-gray-400">
              {getTimeOffline(userChat.endTime)}
            </span>
          )}
        </div>
        <div
          className="absolute right-[20px]"
          onClick={() => {
            setShowChatSetting((prev) => {
              return prev ? false : true;
            });
          }}
        >
          <FontAwesomeIcon
            icon={faCircleInfo}
            className="text-[20px] hover:text-[var(--sub-color)] text-[var(--background-nav)] transition-all duration-300 ease-linear cursor-pointer"
          />
        </div>
      </div>
    );
  }
}

const Loading = () => {
  return (
    <div className="absolute top-[0] left-[0] w-full p-2 flex items-center border-b border-[var(--border-color)] z-20 bg-[var(--background)] text-[var(--text-color)]">
      <div className="cursor-pointer hidden items-center justify-center w-[32px] h-[32px] hover:text-white transition-all duration-100 ease-linear max-[460px]:flex">
        <LoadingSkeleton className="w-full h-full" />
      </div>
      <LoadingSkeleton className="w-[30px] h-[30px] rounded-full" />
      <div className="flex flex-col justify-center">
        <span className="ml-4">
          <LoadingSkeleton className="h-[20px] w-[80px] mb-1 rounded-lg" />
        </span>
        <LoadingSkeleton className="ml-4 h-[14px] w-[40px] rounded-lg" />
      </div>
      <div className="absolute right-[20px]">
        <LoadingSkeleton className="h-[20px]" />
      </div>
    </div>
  );
};
CurrentChat.Loading = Loading;

export default CurrentChat;
