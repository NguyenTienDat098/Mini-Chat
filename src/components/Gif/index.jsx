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
import "./gif.css";
import { Grid } from "@giphy/react-components";
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

const giphyFetch = new GiphyFetch("9oxIV5EL37J5VHQPP2tP3ZKnLUw4deZz");
const fetchGifs = (offset) => giphyFetch.trending({ offset, limit: 10 });

function Gif({ show }) {
  const gifRef = useRef();
  const IconMessageData = useContext(IconsMessageContext);
  const { setGifMessage } = IconMessageData;
  const [modalGif, setModalGif] = useState(null);

  useEffect(() => {
    if (show) {
      gifRef.current.classList.add("show");
    } else {
      gifRef.current.classList.remove("show");
    }
  }, [show]);

  useEffect(() => {
    if (modalGif !== null) {
      setGifMessage(modalGif.images.original.url);
    }
  }, [modalGif]);

  return (
    <div
      className="flex flex-col bg-white shadow-lg rounded-lg p-2 absolute bottom-[80px] left-[20px] z-20 gif"
      ref={gifRef}
    >
      <div className="overflow-x-hidden max-h-[400px] overflow-y-scroll hidden-scroll">
        <Grid
          onGifClick={(gif, e) => {
            e.preventDefault();
            setModalGif(gif);
          }}
          fetchGifs={fetchGifs}
          width={300}
          columns={3}
          gutter={6}
        />
      </div>
      <div>
        {/* <input placeholder="Tìm kiếm gif..." type="text" onChange={(e) => {}} /> */}
      </div>
    </div>
  );
}

export default Gif;
