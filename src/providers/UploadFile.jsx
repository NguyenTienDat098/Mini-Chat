import { useMemo, createContext, useState } from "react";

export const UploadContext = createContext();
function UploadFile({ children }) {
  const [showUpload, setShowUpload] = useState(false);
  const [caseUpload, setCaseUpload] = useState(""); // ChangeAvatar or SendFile
  const value = useMemo(
    () => ({
      showUpload,
      setShowUpload,
      caseUpload,
      setCaseUpload,
    }),
    [showUpload, caseUpload]
  );
  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
}

export default UploadFile;
