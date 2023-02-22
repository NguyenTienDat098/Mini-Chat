import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useContext, useEffect, useRef, useState } from "react";
import { listenDocument } from "../../firebase/util";
import { UserContext } from "../../providers/Users";
import uuid from "react-uuid";
import Slider from "react-slick";
import "./slick.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

function Slick({ show, handleShow }) {
  const [imgFile, setImgFile] = useState(null);
  const [myChat, setMyChat] = useState([]);
  const [userChat, setUserChat] = useState([]);
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const [currentUser, setCurrentUser] = useState(null);

  const overlayRef = useRef();
  const mediaImageRef = useRef();
  const slideNavRef = useRef();
  const slideCaroucelRef = useRef();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (imgFile !== null) {
      setSelectedImageIndex(imgFile.length);
    }
  }, [imgFile]);
  useEffect(() => {
    if (slideCaroucelRef.current) {
      slideCaroucelRef.current.slickGoTo(selectedImageIndex);
    }
  }, [selectedImageIndex, slideCaroucelRef]);

  useEffect(() => {
    if (user !== null) {
      listenDocument("Users", user.id, (data) => {
        if (data !== undefined) {
          setCurrentUser(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (currentUser !== null && currentUser.currentChat !== "") {
      listenDocument("UserChat", currentUser.currentChat, (data) => {
        if (data !== undefined) {
          const result = data.users.filter(
            (user) => user.author.id === currentUser.id
          );
          setUserChat(result);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser !== null) {
      listenDocument("UserChat", currentUser.id, (data) => {
        if (data !== undefined) {
          const result = data.users.filter(
            (user) => user.author.id === currentUser.currentChat
          );
          setMyChat(result);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (userChat !== null && myChat !== null) {
      const data = [...myChat, ...userChat].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
      const imgData = data.filter((e) => {
        return e.file;
      });
      setImgFile(imgData);
    }
  }, [myChat, userChat]);

  const settingSlickNav = {
    className: "slider variable-width",
    infinite: false,
    centerMode: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    focusOnSelect: true,
  };
  const settingCarousel = {
    slidesToShow: 1,
    infinite: false,
    slidesToScroll: 1,
  };

  useEffect(() => {
    if (show) {
      overlayRef.current.classList.add("show");
      mediaImageRef.current.classList.add("show");
    } else {
      overlayRef.current.classList.remove("show");
      mediaImageRef.current.classList.remove("show");
    }
  }, [show]);

  return (
    <>
      <div
        className="bg-[rgba(0,0,0,0.6)] fixed z-[9000] top-0 bottom-0 left-0 right-0 w-full overlay"
        ref={overlayRef}
      ></div>
      <div
        className="fixed z-[9999] top-0 bottom-0 left-0 right-0 w-full media-image"
        style={{ backdropFilter: "blur(5px)" }}
        ref={mediaImageRef}
      >
        <div
          className="absolute cursor-pointer top-[20px] right-[20px] w-[32px] h-[32px] flex items-center justify-center bg-[var(--light-gray)] rounded-full hover:bg-[var(--gray)] transition-all duration-100 ease-linear z-10"
          onClick={() => {
            handleShow(false);
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </div>
        <div className="">
          <Slider {...settingCarousel} ref={slideCaroucelRef}>
            {imgFile !== null &&
              imgFile.map((e) => {
                return (
                  <div
                    key={uuid()}
                    className="cursor-pointer h-[84vh] flex items-center justify-center carousel"
                  >
                    <img
                      src={e.file}
                      alt="img-file"
                      className="cursor-grab w-auto h-full m-auto rounded-lg"
                    />
                  </div>
                );
              })}
          </Slider>
        </div>
        <div className="mt-[16px] nav-slide">
          <Slider {...settingSlickNav} ref={slideNavRef}>
            {imgFile !== null &&
              imgFile.map((e, i) => {
                return (
                  <div
                    key={uuid()}
                    className="cursor-pointer m-2 nav-slide-item"
                    onClick={() => {
                      setSelectedImageIndex(i);
                    }}
                  >
                    <img
                      src={e.file}
                      alt="img-file"
                      className="object-cover w-[48px] h-[48px] rounded-lg"
                    />
                  </div>
                );
              })}
          </Slider>
        </div>
      </div>
    </>
  );
}

export default Slick;
