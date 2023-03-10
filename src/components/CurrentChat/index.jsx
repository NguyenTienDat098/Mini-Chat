import { faArrowLeft, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ChatSettingContext } from "../../providers/ChatSetting";
import { ShowChatContext } from "../../providers/ShowChat";
import LoadingSkeleton from "../Loading/LoadingSkeleton";
import defautlAvatar from "../../assets/imgs/default-avatar.png";
import { CurrentAuthContext } from "../../providers/CurrentAuth";
import moment from "moment-timezone";

function CurrentChat() {
  const ChatSettingData = useContext(ChatSettingContext);
  const { setShowChatSetting } = ChatSettingData;
  const ShowChatData = useContext(ShowChatContext);
  const { setShowChat } = ShowChatData;
  const CurrentAuthData = useContext(CurrentAuthContext);
  const { currentUserChat, nickName } = CurrentAuthData;

  const getTimeOffline = (endTime) => {
    if (endTime !== "") {
      const duration = moment.duration(
        moment.tz(moment(), "Asia/Ho_Chi_Minh").diff(moment.tz(endTime, "UTC"))
      );
      const hours = duration.hours();
      const minutes = duration.minutes();
      const seconds = duration.seconds();
      console.log(hours, minutes, seconds);
      if (seconds < 60 && minutes === 0 && hours === 0) {
        return "Hoạt động vài giây trước";
      } else if (minutes > 0 && hours === 0) {
        return `Hoạt động ${minutes} phút trước`;
      } else if (hours > 0) {
        return `Hoạt động ${hours} giờ trước`;
      }
    }
  };

  if (currentUserChat !== null) {
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
          src={
            currentUserChat.photo !== null
              ? currentUserChat.photo
              : defautlAvatar
          }
          alt="avatar"
          className="w-[30px] h-[30px] rounded-full"
        />
        <div className="flex  flex-col justify-center">
          <span className="ml-4 font-[600] text-[var(--background-nav)]">
            {nickName !== null ? nickName : currentUserChat.username}
          </span>
          {currentUserChat.online ? (
            <span className="ml-4 text-[14px] text-[var(--online)]">
              online
            </span>
          ) : (
            <span className="ml-4 text-[13px] font-[500] text-gray-400">
              {currentUserChat.endTime !== ""
                ? getTimeOffline(currentUserChat.endTime)
                : "offline"}
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
