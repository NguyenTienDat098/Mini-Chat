import {
  faGear,
  faMagnifyingGlass,
  faPenToSquare,
  faRightFromBracket,
  faSignature,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useContext, useEffect, useState, useRef } from "react";
import { ShowChatContext } from "../../providers/ShowChat";
import {
  getMutipleDocuments,
  getSimpleDocument,
  listenDocument,
  updateArrayField,
  updateField,
} from "../../firebase/util";
import { UserContext } from "../../providers/Users";
import defalutAvatar from "../../assets/imgs/default-avatar.png";
import Slider from "react-slick";
import "./sidebar.css";
import { UploadContext } from "../../providers/UploadFile";
import { ModalContext } from "../../providers/Modal";
function SideBar({ className = "" }) {
  const [animationParent] = useAutoAnimate();
  const [userFound, setUserFound] = useState(null);
  const UserData = useContext(UserContext);
  const { user, logout } = UserData;
  const [currentUser, setCurrentUser] = useState(null);
  const ShowChatData = useContext(ShowChatContext);
  const { setShowChat } = ShowChatData;
  const [onlineUsers, setOnlineUser] = useState(null);
  const [chats, setChats] = useState(null);
  const [showSettingUser, setShowSettingUser] = useState(false);
  const optionsSettingRef = useRef();
  const UploadData = useContext(UploadContext);
  const { setCaseUpload, setShowUpload } = UploadData;
  const ModalData = useContext(ModalContext);
  const { setShowModal } = ModalData;

  useEffect(() => {
    if (showSettingUser) {
      optionsSettingRef.current.classList.add("show");
    } else {
      optionsSettingRef.current.classList.remove("show");
    }
  }, [showSettingUser]);

  useEffect(() => {
    if (currentUser !== null) {
      getSimpleDocument("Users", currentUser.id)
        .then((user) => {
          setChats(user.chats);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      getMutipleDocuments("Users", "online", "==", true).then((users) => {
        setOnlineUser(users);
      });
    }
  }, [currentUser]);

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
          desc: users.desc,
        });
        updateArrayField("Users", users.id, "chats", {
          id: currentUser.id,
          username: currentUser.username,
          photo: currentUser.photo,
          nickName: "",
          online: currentUser.online,
          desc: currentUser.desc,
        });
      }
    } else {
      updateArrayField("Users", currentUser.id, "chats", {
        id: users.id,
        username: users.username,
        photo: users.photo,
        nickName: "",
        online: users.online,
        desc: users.desc,
      });
      updateArrayField("Users", users.id, "chats", {
        id: currentUser.id,
        username: currentUser.username,
        photo: currentUser.photo,
        nickName: "",
        online: currentUser.online,
        desc: users.desc,
      });
    }
  };

  const updateCurrentChat = (userId) => {
    updateField("Users", currentUser.id, "currentChat", userId);
    setShowChat(true);
  };

  const handleFindUsers = (valueFind) => {
    let results = [];
    getMutipleDocuments("Users", "username", "<=", valueFind)
      .then((users) => {
        users.forEach((userItem) => {
          if (userItem.id !== user.id) {
            results.push(userItem);
          }
        });
        setUserFound(results);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const settingSlick = {
    className: "slider variable-width",
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    arrows: false,
  };

  const USER_SETTINGS = [
    {
      id: 1,
      option: "Thay đổi ảnh đại diện",
      icon: faUserTie,
      onclick: () => {
        setShowUpload(true);
        setCaseUpload("ChangeAvatar");
      },
    },
    {
      id: 2,
      option: "Chỉnh sửa mô tả",
      icon: faPenToSquare,
      onclick: () => {
        setShowModal({
          modalName: "edit_user_infor",
          active: true,
        });
      },
    },
  ];

  return (
    <div
      className={`${className} side-bar relative w-[360px] bg-[var(--background-nav)] text-[var(--text-nav)]`}
    >
      <div className="group-user">
        <div className="relative p-2">
          <input
            onChange={(e) => {
              handleFindUsers(e.target.value);
            }}
            type="text"
            placeholder="Tìm Kiếm"
            className="w-full p-2 border-none outline-none bg-[var(--sidebar-setting)] rounded-lg"
          />
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute top-[50%] right-[20px] translate-y-[-50%]"
          />
        </div>
        <ul className="result-find p-2" ref={animationParent}>
          {userFound !== null && userFound.length > 0 ? (
            <>
              {userFound.map((userItem) => {
                return (
                  <li
                    onClick={() => {
                      handleSetChat(userItem);
                    }}
                    key={userItem.id}
                    className="mb-2 flex items-center select-none cursor-pointer bg-[var(--sidebar-setting)] p-1 rounded-lg"
                  >
                    <img
                      src={userItem.photo}
                      className="w-[36px] h-[36px] rounded-full"
                      alt="avatar"
                    />
                    <div className="flex items-center text-sm pl-2">
                      <span className="font-[500]">{userItem.username}</span>
                    </div>
                  </li>
                );
              })}
            </>
          ) : (
            false
          )}
        </ul>
      </div>
      <div className="group-online">
        <span className="text-center text-sm w-full block">
          Người dùng đang hoạt động
        </span>
        <ul className="mt-2" ref={animationParent}>
          <Slider {...settingSlick}>
            {onlineUsers !== null && onlineUsers.length > 0
              ? onlineUsers.map((userItem) => {
                  if (userItem.id !== currentUser.id) {
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
                  return false;
                })
              : false}
          </Slider>
        </ul>
      </div>
      <div className="group-chat">
        <ul
          className="p-2 flex mt-2 m-auto flex-col w-[100%] max-h-[400px] items-center rounded-lg overflow-x-hidden overflow-y-scroll hidden-scroll scroll-smooth"
          ref={animationParent}
        >
          {chats !== null && chats.length > 0
            ? chats.map((userItem) => {
                if (userItem.id !== user.id) {
                  return (
                    <li
                      onClick={() => {
                        updateCurrentChat(userItem.id);
                      }}
                      key={userItem.id}
                      className="hover:bg-[var(--sidebar-setting)] text-[var(--text-nav)] relative cursor-pointer w-full flex items-center rounded-lg p-2"
                    >
                      <img
                        src={userItem.photo}
                        alt="avatar"
                        className="bg-white w-[34px] h-[34px] rounded-full"
                      />
                      <div className="flex flex-col ml-4">
                        {userItem !== null ? (
                          <>
                            <span className="text-[14px] font-[400]">
                              {userItem.nickName !== ""
                                ? userItem.nickName
                                : userItem.username}
                            </span>
                            <span className="text-[12px] text-[var(--text-nav)] capitalize">
                              {userItem.desc !== "" ? userItem.desc : ""}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm mt-2">Unknown User</span>
                        )}
                      </div>
                    </li>
                  );
                }
                return false;
              })
            : false}
        </ul>
      </div>
      <div className="absolute w-full bottom-0 left-0 p-2 flex flex-col items-center justify-center">
        <div className="user-settings w-full">
          <ul className="options" ref={optionsSettingRef}>
            {USER_SETTINGS.map((item) => {
              return (
                <li
                  className="rounded-lg bg-[var(--sidebar-setting)] mb-2 w-full p-3  flex items-center select-none cursor-pointer"
                  key={item.id}
                  onClick={() => {
                    if (item.onclick) {
                      item.onclick();
                    }
                  }}
                >
                  <FontAwesomeIcon
                    icon={item.icon}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-sm pl-3">{item.option}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="bg-[var(--background)] text-[var(--text-color)] z-[10] rounded-lg w-full p-2 mb-0 flex items-center justify-between">
          <div className="flex items-center">
            <img
              className="w-[40px] h-[40px] rounded-lg"
              src={currentUser !== null ? currentUser.photo : defalutAvatar}
              alt="avatar"
            />
            <div className="flex justify-center flex-col pl-3">
              <span className="font-[600] capitalize">
                {currentUser !== null ? currentUser.username : "unknow"}
              </span>
              <span className="text-[12px] capitalize">
                {currentUser !== null ? currentUser.desc : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div
              onClick={() => {
                setShowSettingUser((prev) => {
                  return prev ? false : true;
                });
              }}
              className="mr-2 cursor-pointer hover:opacity-[0.5] transition-all duration-100 ease-linear"
            >
              <FontAwesomeIcon icon={faGear} />
            </div>
            <div
              className="cursor-pointer hover:opacity-[0.5] transition-all duration-100 ease-linear"
              onClick={() => {
                logout();
              }}
            >
              <FontAwesomeIcon icon={faRightFromBracket} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
