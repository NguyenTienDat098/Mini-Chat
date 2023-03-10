import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { getMutipleDocuments, updateField } from "../../firebase/util";
import { CurrentAuthContext } from "../../providers/CurrentAuth";
import { ModalContext } from "../../providers/Modal";
import "./modal.css";
function EditDiscription({ show, className }) {
  const [isFocused, setIsFocused] = useState(false);
  const ModalData = useContext(ModalContext);
  const { setShowModal } = ModalData;
  const modalRef = useRef();
  const overlayRef = useRef();
  const [description, setDescription] = useState("");
  const CurrentAuthData = useContext(CurrentAuthContext);
  const { currentUser } = CurrentAuthData;

  useEffect(() => {
    if (currentUser !== null) {
      setDescription(currentUser.desc);
    }
  }, [currentUser]);

  const editUserInfor = () => {
    if (currentUser !== null) {
      updateField("Users", currentUser.id, "desc", description);
      getMutipleDocuments("Users", "username", ">=", "").then((users) => {
        users.forEach((user) => {
          let dataUpdate = user;
          dataUpdate.chats.forEach((item) => {
            if (item.id === currentUser.id && user.id !== currentUser.id) {
              item.desc = description;
              updateField("Users", user.id, "chats", dataUpdate.chats);
            }
          });
        });
      });
      setShowModal({
        modalName: "",
        active: false,
      });
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (show.active && show.modalName === "edit_user_infor") {
      overlayRef.current.classList.add("show");
      modalRef.current.classList.add("show");
    } else {
      overlayRef.current.classList.remove("show");
      modalRef.current.classList.remove("show");
    }
  }, [show]);

  return (
    <>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 bg-[var(--overlay)] z-[9999] overlay"
        ref={overlayRef}
      ></div>
      <div
        className={`${className} w-[546px] rounded-[14px] border border-[var(--border-color)] bg-[var(--background)] modal z-[9999]`}
        ref={modalRef}
      >
        <div
          className="absolute top-[16px] right-[16px] cursor-pointer w-[32px] h-[32px] text-center rounded-full bg-[var(--light-gray)] flex  items-center justify-center transition-all duration-100 ease-linear hover:bg-[var(--gray)]"
          onClick={() => {
            setShowModal({
              modalName: "",
              active: false,
            });
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </div>
        <div className="text-center">
          <h4 className="pt-[20px] pl-[64px] pr-[64px] pb-[8px] text-[var(--text-color)]">
            Th??m th??ng tin m?? t??? c???a b???n
          </h4>
        </div>
        <div className="p-[16px]">
          <p className="text-[12px] text-[var(--text-gray)]">
            M???i ng?????i s??? nh??n th???y m?? t??? c???a b???n khi tr?? chuy???n
          </p>
          <div
            className={`mt-[16px] rounded-lg border border-[var(--medium-gray)] pl-[16px] pr-[16px] pb-[10px] change-nick-name  ${
              isFocused ? "focus" : ""
            }`}
          >
            <div className="pt-[12px] pl-[8px] pr-[8px] flex items-center justify-between text-[12px] text-[var(--text-color)]">
              <span className={`nick-name-title ${isFocused ? "focus" : ""}`}>
                M?? t???
              </span>
              <span>{description !== "" ? description.length : 0}/100</span>
            </div>
            <input
              onFocus={handleFocus}
              onBlur={handleBlur}
              type="text"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="w-full bg-[var(--background)] input-change-nick-name caret-[var(--main-color)] border-none pl-[8px] text-[var(--text-color)]"
            />
          </div>
          <div className="flex mt-[16px] w-full items-center justify-between">
            <button
              className="min-w-[140px] w-[49%] pt-[9px] pb-[9px] pl-[12px] pr-[12px] rounded-lg bg-[var(--text-black)] font-[600]"
              onClick={() => {
                setShowModal({
                  modalName: "",
                  active: false,
                });
              }}
            >
              H???y
            </button>
            <button
              className="min-w-[140px] w-[49%] pt-[9px] pb-[9px] pl-[12px] pr-[12px] rounded-lg bg-[var(--main-color)] font-[600]"
              onClick={() => {
                editUserInfor();
              }}
            >
              L??u
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditDiscription;
