import {
  faRightFromBracket,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useEffect, useContext } from "react";
import { UploadContext } from "../../providers/UploadFile";
import { UserContext } from "../../providers/Users";
import "./modal.css";

function UserSetting({ show, showSetting }) {
  const UploadData = useContext(UploadContext);
  const { setCaseUpload, setShowUpload } = UploadData;
  const userSettingRef = useRef();
  const UserData = useContext(UserContext);
  const { logout } = UserData;
  useEffect(() => {
    if (show) {
      userSettingRef.current.classList.add("show");
    } else {
      userSettingRef.current.classList.remove("show");
    }
  }, [show]);

  return (
    <div
      className="bg-white rounded-tl-lg rounded-bl-lg rounded-tr-lg rounded-br-lg absolute z-[999] bottom-[45px] left-[45px] overflow-hidden user-setting hidden "
      ref={userSettingRef}
    >
      <ul className="text-[14px]">
        <li
          className="cursor-pointer select-none flex items-center mb-2 pt-2 pl-2 pr-2 hover:opacity-[0.5] transition-all duration-100 ease-linear"
          onClick={() => {
            setShowUpload(true);
            setCaseUpload("ChangeAvatar");
          }}
        >
          <span className="mr-2">Thay đổi ảnh đại diện</span>
          <FontAwesomeIcon icon={faUserTie} />
        </li>
        <li
          className="cursor-pointer select-none flex items-center mb-2 pt-2 pl-2 pr-2 hover:opacity-[0.5] transition-all duration-100 ease-linear"
          onClick={() => {
            logout();
          }}
        >
          <span className="mr-2">Logout</span>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </li>
      </ul>
    </div>
  );
}

export default UserSetting;
