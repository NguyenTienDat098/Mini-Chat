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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef } from "react";
import uuid from "react-uuid";
import { IconsMessageContext } from "../../providers/IconsMessage";
import "./icons.css";

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

function Icons({ show }) {
  const iconRef = useRef();
  const IconMessageData = useContext(IconsMessageContext);
  const { setIconMessage } = IconMessageData;
  useEffect(() => {
    if (show && iconRef.current) {
      iconRef.current.classList.add("show");
    } else {
      iconRef.current.classList.remove("show");
    }
  }, [show]);
  return (
    <div
      className="grid grid-cols-4 gap-1 bg-white shadow-lg rounded-lg p-2 absolute bottom-[80px] left-[20px] icons z-20"
      ref={iconRef}
    >
      {ICONS.map((e) => {
        return (
          <FontAwesomeIcon
            onClick={() => {
              setIconMessage(e.name);
            }}
            icon={e.icon}
            key={uuid()}
            className="p-2 rounded-lg m-2 cursor-pointer text-[var(--icon-color)] hover:text-[var(--sub-color)] hover:scale-[1.4] transition-all duration-150 ease-linear"
          />
        );
      })}
    </div>
  );
}

export default Icons;
