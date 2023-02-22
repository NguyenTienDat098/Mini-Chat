import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import Slider from "react-slick";
import {
  getMutipleDocuments,
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { ModalContext } from "../../providers/Modal";
import { ShowChatContext } from "../../providers/ShowChat";
import { UploadContext } from "../../providers/UploadFile";
import { UserContext } from "../../providers/Users";
import LoadingSkeleton from "../Loading/LoadingSkeleton";
import UserSetting from "../Modal/UserSetting";
import "./search.css";
function Search({ className = "" }) {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [usersChat, setUsersChat] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const ShowChatData = useContext(ShowChatContext);
  const { setShowChat } = ShowChatData;
  const [userOnline, setUserOnline] = useState(null);
  const ModalData = useContext(ModalContext);
  const { setShowSetting, showSetting } = ModalData;

  useEffect(() => {
    getMutipleDocuments("Users", "online", "==", true)
      .then((res) => {
        setUserOnline(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      listenDocument("Users", currentUser.id, (usersChat) => {
        if (usersChat !== undefined) {
          setUsersChat(usersChat.chats);
        }
      });
    }
  }, [currentUser]);

  const updateCurrentChat = (userId) => {
    updateField("Users", user.id, "currentChat", userId);
    setShowChat(true);
  };

  const settingSlick = {
    className: "slider variable-width",
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
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

  const handleSetChat = (users) => {
    updateCurrentChat(users.id);
    if (currentUser.chats.length > 0) {
      let exists = false;
      currentUser.chats.forEach((user) => {
        if (users.id === user.id) {
          exists = true;
        }
      });
      if (!exists) {
        updateArrayField("Users", currentUser.id, "chats", {
          id: users.id,
          username: users.username,
          photo: users.photo,
          nickName: "",
          online: users.online,
        });
        updateArrayField("Users", users.id, "chats", {
          id: currentUser.id,
          username: currentUser.username,
          photo: currentUser.photo,
          nickName: "",
          online: currentUser.online,
        });
      }
    } else {
      updateArrayField("Users", currentUser.id, "chats", {
        id: users.id,
        username: users.username,
        photo: users.photo,
        nickName: "",
        online: users.online,
      });
      updateArrayField("Users", users.id, "chats", {
        id: currentUser.id,
        username: currentUser.username,
        photo: currentUser.photo,
        nickName: "",
        online: currentUser.online,
      });
    }
  };

  return (
    <div className={`${className} search-container relative overflow-hidden`}>
      <UserSetting show={showSetting} showSetting={setShowSetting} />
      <div
        onClick={() => {
          setShowSetting((prev) => {
            return prev ? false : true;
          });
        }}
        className="absolute z-[99] bottom-[20px] left-[20px] w-[32px] h-[32px] flex items-center justify-center cursor-pointer bg-[var(--text-color)] text-[var(--icon-nav)] rounded-full hover:opacity-[0.5] transition-all duration-300 ease-linear"
      >
        <FontAwesomeIcon icon={faGear} />
      </div>
      <div className="search flex items-center justify-center flex-col">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="input-search"
          id="inputID"
          onChange={(e) => {
            if (e.target.value !== "") {
              getMutipleDocuments(
                "Users",
                "username",
                ">=",
                e.target.value
              ).then((res) => {
                setSearchResult(res);
              });
            }
          }}
        />
        <ul className="flex mt-2 flex-col items-center justify-center max-h-[400px] overflow-y-scroll w-full">
          {searchResult !== null && searchResult.length > 0
            ? searchResult.map((e) => {
                if (e.id !== user.id) {
                  return (
                    <li
                      onClick={() => {
                        handleSetChat(e);
                      }}
                      key={e.id}
                      className="text-[var(--text-black)] relative  cursor-pointer w-full flex items-center rounded-lg bg-[rgba(0,0,0,0.2)] p-2 mb-1 overflow-hidden"
                    >
                      <img
                        src={e.photo}
                        alt="avatar"
                        className="w-[34px] h-[34px] rounded-full"
                      />
                      <div className="flex flex-col ml-4">
                        <span className="text-[14px] font-[400]">
                          {e.username}
                        </span>
                      </div>
                    </li>
                  );
                }
                return <></>;
              })
            : false}
        </ul>
      </div>
      <div className="user-online">
        <span className="text-center text-sm w-full block">
          Người dùng đang hoạt động
        </span>
        <ul className="mt-2">
          <Slider {...settingSlick}>
            {userOnline !== null && userOnline.length > 0 ? (
              userOnline.map((userItem) => {
                if (userItem.id !== user.id) {
                  return (
                    <li
                      className="cursor-pointer ml-2 relative user-online-item"
                      key={userItem.id}
                      onClick={() => {
                        handleSetChat(userItem);
                      }}
                    >
                      <img
                        src={userItem.photo}
                        alt="avatar"
                        className="w-[32px] h-[32px] object-cover rounded-full"
                      />
                    </li>
                  );
                }
              })
            ) : (
              <></>
            )}
          </Slider>
        </ul>
      </div>
      <div className="user-online">
        <span className="text-center text-sm w-full block">
          Người dùng đang trò chuyện
        </span>
        <ul className="flex mt-2 flex-col items-center justify-center">
          {usersChat !== null && usersChat.length > 0 ? (
            usersChat.map((userItem) => {
              if (userItem.id !== user.id) {
                return (
                  <li
                    onClick={() => {
                      updateCurrentChat(userItem.id);
                    }}
                    key={userItem.id}
                    className="text-[var(--text-black)] mb-2 relative cursor-pointer w-full flex items-center rounded-lg  p-2"
                  >
                    <img
                      src={userItem.photo}
                      alt="avatar"
                      className="w-[34px] h-[34px] rounded-full"
                    />
                    <div className="flex flex-col ml-4">
                      {userItem !== null ? (
                        <span className="text-[14px] font-[400]">
                          {userItem.nickName !== ""
                            ? userItem.nickName
                            : userItem.username}
                        </span>
                      ) : (
                        <span className="text-sm mt-2">Unknown User</span>
                      )}
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <span className="text-sm block w-full text-center text-[var(--error-color)] p-2 rounded-lg border border-1 border-[var(--error-color)]">
              Bạn chưa có tin nhắn nào !!!
            </span>
          )}
        </ul>
      </div>
    </div>
  );
}
const Loading = ({ className = "" }) => {
  return (
    <div className={`${className} search-container`}>
      <div className="search flex items-center justify-center flex-col">
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="input-search"
          id="inputID"
        />
      </div>
      <div className="user-online">
        <span className="text-center text-sm w-full block">
          <LoadingSkeleton className="w-full h-full" />
        </span>
        <ul className="flex mt-2 flex-col items-center justify-center">
          <LoadingSkeleton className="w-full h-full mb-2 p-4 rounded-lg" />
          <LoadingSkeleton className="w-full h-full mb-2 p-4 rounded-lg" />
          <LoadingSkeleton className="w-full h-full mb-2 p-4 rounded-lg" />
        </ul>
      </div>
    </div>
  );
};
Search.Loading = Loading;
export default Search;
