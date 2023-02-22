import { createContext, useMemo, useState } from "react";

export const ImagePreviewContext = createContext();
function ImagePrivew({ children }) {
  const [imgPreview, setImagePreview] = useState(null);
  const value = useMemo(
    () => ({
      imgPreview,
      setImagePreview,
    }),
    [imgPreview]
  );
  return (
    <ImagePreviewContext.Provider value={value}>
      {children}
    </ImagePreviewContext.Provider>
  );
}

export default ImagePrivew;
