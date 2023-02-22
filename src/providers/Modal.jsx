import { createContext, useMemo, useState } from "react";

export const ModalContext = createContext();
function Modal({ children }) {
  const [showModal, setShowModal] = useState({
    modalName: "", // value : edit_user_infor , change_nick_name
    active: false,
  });
  const [showSetting, setShowSetting] = useState(false);
  const value = useMemo(
    () => ({
      showModal,
      setShowModal,
      showSetting,
      setShowSetting,
    }),
    [showModal, showSetting]
  );
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export default Modal;
