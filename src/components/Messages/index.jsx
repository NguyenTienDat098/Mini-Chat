import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { ImagePreviewContext } from "../../providers/ImagePreview";
import { UserContext } from "../../providers/Users";
import "./message.css";
import {
  faFaceGrinSquintTears,
  faFaceLaughBeam,
  faFaceLaughSquint,
  faFaceLaughWink,
  faFaceSmile,
  faFaceSmileBeam,
  faFaceSmileWink,
  faFaceSadTear,
  faFaceSadCry,
  faFaceFrownOpen,
  faFaceFrown,
  faFaceAngry,
  faFaceTired,
} from "@fortawesome/free-regular-svg-icons";
import { faPoo } from "@fortawesome/free-solid-svg-icons";
import AmbitiousGiftedBetafish from "../../assets/gifs/AmbitiousGiftedBetafish.gif";
import ColorlessMeagerArcherfish from "../../assets/gifs/ColorlessMeagerArcherfish-size_restricted.gif";
import DearestQuarrelsomeBetafish from "../../assets/gifs/DearestQuarrelsomeBetafish.gif";
import FamousPointlessBlacklab from "../../assets/gifs/FamousPointlessBlacklab.gif";
import FavorableFluidBear from "../../assets/gifs/FavorableFluidBear.gif";
import JealousPeriodicGrayfox from "../../assets/gifs/JealousPeriodicGrayfox.gif";
import laugh from "../../assets/gifs/laugh.gif";
import LavishWillingCanadagoose from "../../assets/gifs/LavishWillingCanadagoose.gif";
import MintyDelayedBluegill from "../../assets/gifs/MintyDelayedBluegill.gif";
import SilkyMetallicAnaconda from "../../assets/gifs/SilkyMetallicAnaconda.gif";
import SlushyIdleCowbird from "../../assets/gifs/SlushyIdleCowbird.gif";
import SomberAntiqueAmericanbadger from "../../assets/gifs/SomberAntiqueAmericanbadger.gif";
import TartScarceIslandwhistler from "../../assets/gifs/TartScarceIslandwhistler.gif";
import uuid from "react-uuid";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";
import { MobileContext } from "../../providers/Mobile";

const GIFS = [
  { name: "AmbitiousGiftedBetafish", gif: AmbitiousGiftedBetafish },
  { name: "ColorlessMeagerArcherfish", gif: ColorlessMeagerArcherfish },
  { name: "DearestQuarrelsomeBetafish", gif: DearestQuarrelsomeBetafish },
  { name: "FamousPointlessBlacklab", gif: FamousPointlessBlacklab },
  { name: "FavorableFluidBear", gif: FavorableFluidBear },
  { name: "JealousPeriodicGrayfox", gif: JealousPeriodicGrayfox },
  { name: "laugh", gif: laugh },
  { name: "LavishWillingCanadagoose", gif: LavishWillingCanadagoose },
  { name: "MintyDelayedBluegill", gif: MintyDelayedBluegill },
  { name: "SilkyMetallicAnaconda", gif: SilkyMetallicAnaconda },
  { name: "SlushyIdleCowbird", gif: SlushyIdleCowbird },
  { name: "SomberAntiqueAmericanbadger", gif: SomberAntiqueAmericanbadger },
  { name: "TartScarceIslandwhistler", gif: TartScarceIslandwhistler },
];
const ICONS = [
  {
    name: "faFaceGrinSquintTears",
    icon: faFaceGrinSquintTears,
  },
  {
    name: "faFaceLaughBeam",
    icon: faFaceLaughBeam,
  },
  {
    name: "faFaceLaughSquint",
    icon: faFaceLaughSquint,
  },
  {
    name: "faFaceLaughWink",
    icon: faFaceLaughWink,
  },
  {
    name: "faFaceSmile",
    icon: faFaceSmile,
  },
  {
    name: "faFaceSmileBeam",
    icon: faFaceSmileBeam,
  },
  {
    name: "faFaceSmileWink",
    icon: faFaceSmileWink,
  },
  {
    name: "faFaceSadTear",
    icon: faFaceSadTear,
  },
  {
    name: "faFaceSadCry",
    icon: faFaceSadCry,
  },
  {
    name: "faFaceFrownOpen",
    icon: faFaceFrownOpen,
  },
  {
    name: "faFaceFrown",
    icon: faFaceFrown,
  },
  {
    name: "faFaceAngry",
    icon: faFaceAngry,
  },
  {
    name: "faFaceTired",
    icon: faFaceTired,
  },
  {
    name: "faPoo",
    icon: faPoo,
  },
];
function Message({ name, photo, message, createdAt, id, file, icon, gif }) {
  const UserData = useContext(UserContext);
  const { user } = UserData;
  const ImagePreviewData = useContext(ImagePreviewContext);
  const { setImagePreview } = ImagePreviewData;
  const MobileData = useContext(MobileContext);
  const { isMobile } = MobileData;
  if (user !== null && user.id === id) {
    return (
      <>
        <div className="p-1 flex flex-col justify-center text-white my-mes">
          <div className="flex items-center p-1 infor">
            <img
              src={photo}
              alt="avatar"
              className="w-[20px] h-[20px] rounded-full ml-4"
            />
            <Tippy
              className="text-[12px]"
              zIndex={"0"}
              touch={true}
              interactive={true}
              placement={isMobile ? "bottom" : "right"}
              animation={"scale"}
              content={createdAt}
            >
              <div
                className="flex flex-col ml-2 rounded-tr-lg rounded-bl-lg rounded-tl-lg p-2 message-style"
                style={
                  message && message !== ""
                    ? { backgroundColor: "var(--message-gray)" }
                    : { backgroundColor: "transparent" }
                }
              >
                <span className="text-[14px] text-[var(--text-color)]">
                  {message}
                </span>
                {gif && gif !== ""
                  ? GIFS.map((e) => {
                      if (e.name === gif) {
                        return (
                          <img
                            src={e.gif}
                            alt="gif"
                            key={uuid()}
                            className="w-[100px]"
                          />
                        );
                      }
                      return false;
                    })
                  : false}
                {icon && icon !== ""
                  ? ICONS.map((e) => {
                      if (e.name === icon) {
                        return (
                          <FontAwesomeIcon
                            icon={e.icon}
                            key={uuid()}
                            className="text-[24px]"
                          />
                        );
                      }
                      return false;
                    })
                  : false}
                {file && file !== "" ? (
                  <img
                    src={file}
                    key={uuid()}
                    className="max-w-[200px] cursor-pointer rounded-lg img-mes"
                    alt="img-mes"
                    onClick={() => {
                      setImagePreview(file);
                    }}
                  />
                ) : (
                  false
                )}
              </div>
            </Tippy>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="p-1 flex flex-col justify-center text-white message-container">
        <span className="ml-[42px] text-[var(--text-color)] text-[12px] font-[300]">
          {name}
        </span>
        <div className="flex items-center p-1">
          <img
            src={photo}
            alt="avatar"
            className="w-[20px] h-[20px] rounded-full "
          />
          <Tippy
            className="text-[12px]"
            zIndex={"0"}
            touch={true}
            interactive={true}
            placement={isMobile ? "bottom" : "right"}
            animation="scale"
            content={createdAt}
          >
            <div
              className="flex flex-col ml-4  rounded-br-lg rounded-tr-lg p-2 message-style"
              style={
                message && message !== ""
                  ? { backgroundColor: "var(--message-gray)" }
                  : { backgroundColor: "transparent" }
              }
            >
              <span className="text-[14px] text-[var(--text-color)]">
                {message}
              </span>
              {gif && gif !== ""
                ? GIFS.map((e) => {
                    if (e.name === gif) {
                      return (
                        <img
                          src={e.gif}
                          alt="gif"
                          key={uuid()}
                          className="w-[100px]"
                        />
                      );
                    }
                    return false;
                  })
                : false}
              {icon && icon !== ""
                ? ICONS.map((e) => {
                    if (e.name === icon) {
                      return (
                        <FontAwesomeIcon
                          key={uuid()}
                          icon={e.icon}
                          className="text-[24px]"
                        />
                      );
                    }
                    return false;
                  })
                : false}
              {file && file !== "" ? (
                <img
                  key={uuid()}
                  src={file}
                  className="max-w-[200px] cursor-pointer rounded-lg img-mes"
                  alt="img-mes"
                  onClick={() => {
                    setImagePreview(file);
                  }}
                />
              ) : (
                false
              )}
            </div>
          </Tippy>
        </div>
      </div>
    </>
  );
}

export default Message;
