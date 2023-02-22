import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "../components/Chat";
import ChatSetting from "../components/ChatSetting";
import FileUploaded from "../components/FileUploaded";
import Search from "../components/Search";
import { ChatSettingContext } from "../providers/ChatSetting";
import { MobileContext } from "../providers/Mobile";
import { UserContext } from "../providers/Users";
import LoadingPage from "../components/Loading/LoadingPage";
import "./page.css";
import logo from "../assets/logo/logo-no-background.svg";
import SideBar from "../components/SideBar";
import PageNotFound from "./pagenotfound";
function Home() {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const ChatSettingData = useContext(ChatSettingContext);
  const { showChatSetting } = ChatSettingData;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const MobileData = useContext(MobileContext);
  const { isMobile, isTablet } = MobileData;
  useEffect(() => {
    if (user === null) {
      setLoading(true);
      setTimeout(() => {
        navigate("/login");
      }, [3000]);
    } else {
      setTimeout(() => {
        setLoading(false);
      }, [3000]);
    }
  }, [user, navigate]);

  if (user === null || loading) {
    return (
      <>
        <div className="w-full h-screen flex items-center justify-center relative ">
          <div className="fixed w-full top-0 bottom-0 left-0 right-0 flex items-center flex-col justify-center z-[9999] bg-white">
            <img
              src={logo}
              alt="logo"
              className="w-[50%] h-auto max-w-[300px]"
            />
            <LoadingPage color={"rgba(254, 44, 85, 1)"} type={"bubbles"} />
          </div>
          <div className="w-full h-screen flex home-page relative">
            <Search.Loading
              className={`w-[400px] ${isMobile ? "search-mobile" : ""} ${
                isTablet ? "search-tablet" : ""
              }`}
            />
            <Chat.Loading
              className={`flex-1 border-l border-[var(--border-color)] border-r ${
                isMobile ? "chat-mobile" : ""
              } ${isTablet ? "chat-tablet" : ""}`}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="w-full h-screen flex home-page relative">
        <SideBar className={`${isMobile ? "sidebar-mobile" : ""}`} />
        <Chat
          className={`flex-1 border-l border-[var(--border-color)] border-r ${
            isMobile ? "chat-mobile" : ""
          } ${isTablet ? "chat-tablet" : ""}`}
        />
        <ChatSetting
          className={`${isMobile ? "chatsetting-mobile" : ""} ${
            isTablet ? "chatsetting-tablet" : ""
          }`}
          show={showChatSetting}
        />
        <FileUploaded />
      </div>
    </>
  );
}

export default Home;
