import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef } from "react";
import { ImagePreviewContext } from "../../providers/ImagePreview";
import "./imgPreview.css";
function ImgPreview() {
  const ImagePreviewData = useContext(ImagePreviewContext);
  const { imgPreview, setImagePreview } = ImagePreviewData;
  const imgPreviewRef = useRef();
  useEffect(() => {
    if (imgPreview !== null && imgPreview !== "" && imgPreviewRef.current) {
      imgPreviewRef.current.classList.add("show");
    } else {
      imgPreviewRef.current.classList.remove("show");
    }
  }, [imgPreview]);
  return (
    <div
      className="img-preview fixed w-full h-screen top-0 left-0 bottom-0 right-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-[9999]"
      style={{ backdropFilter: "blur(5px)" }}
      ref={imgPreviewRef}
    >
      <div
        className="absolute cursor-pointer top-[20px] right-[20px] w-[32px] h-[32px] flex items-center justify-center bg-[var(--light-gray)] rounded-full hover:bg-[var(--gray)] transition-all duration-100 ease-linear z-10"
        onClick={() => {
          imgPreviewRef.current.classList.remove("show");
          setImagePreview(null);
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </div>
      <img
        src={imgPreview}
        alt="preview"
        className="max-w-[80%] rounded-lg shadow-lg h-[80%] w-auto object-cover image"
      />
    </div>
  );
}

export default ImgPreview;
