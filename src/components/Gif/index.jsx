import { GiphyFetch } from "@giphy/js-fetch-api";
import { useContext, useEffect, useRef, useState } from "react";
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
import { IconsMessageContext } from "../../providers/IconsMessage";
import Error from "../giphy/Error";
import TextList from "../giphy/TextList";

import "./gif.css";

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

const giphy = new GiphyFetch("9oxIV5EL37J5VHQPP2tP3ZKnLUw4deZz");

function Gif({ show }) {
  const gifRef = useRef();
  const IconMessageData = useContext(IconsMessageContext);
  const { setGifMessage } = IconMessageData;
  const [results, setResults] = useState([]);
  const [err, setErr] = useState(false);

  const handleFindGif = (text) => {
    if (text.length === 0) {
      setErr(true);
      return;
    }

    console.log(text);
    const apiCall = async () => {
      const res = await giphy.animate(text, { limit: 20 });
      setResults(res.data);
    };

    apiCall();
    setErr(false);
  };

  useEffect(() => {
    if (show && gifRef.current) {
      gifRef.current.classList.add("show");
    } else {
      gifRef.current.classList.remove("show");
    }
  }, [show]);
  return (
    <div
      className="grid grid-cols-3 gap-1 bg-white shadow-lg rounded-lg p-2 absolute bottom-[80px] left-[20px] z-20 gif"
      ref={gifRef}
    >
      <div>
        <Error isError={err} text="need length longer than 0 for input" />
        {results && <TextList gifs={results} />}
      </div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            handleFindGif(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default Gif;
//
{
  /* {GIFS.map((e) => {
        return (
          <img
            onClick={() => {
              setGifMessage(e.name);
            }}
            src={e.gif}
            alt="gif"
            key={e.name}
            className="p-2 rounded-lg w-[80px] m-2 cursor-pointer hover:text-[var(--sub-color)] hover:scale-[1.4] transition-all duration-150 ease-linear"
          />
        );
      })} */
}
