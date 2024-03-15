import CustomImage from "@atoms/CustomImage";
import { PhotoFrame } from "@atoms/Frame";
import { useState } from "react";

const TuanPhoto = ({ onClose }: { onClose: () => void }) => {
  const images = ["tuan_smile.jpg", "tuan_grin.jpg"];
  const [image, setImage] = useState(0);
  return (
    <div onMouseOver={() => setImage(1)} onMouseLeave={() => setImage(0)}>
      <PhotoFrame
        draggable
        name={images[image]}
        closeTooltipContent="Hide my face 😢"
        inverted
        onClose={onClose}
        mainClassname="bg-gray-200"
        className="w-[400px] max-w-[calc(100vw-32px)] "
      >
        <div className="grid grid-cols-1 grid-rows-1">
          <div className="col-start-1 row-start-1">
            <CustomImage
              src={images[0]}
              slug="about"
              width="1256"
              height="1570"
            />
          </div>
          <div
            className={`col-start-1 row-start-1 transition-opacity duration-200 ${
              image == 1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <CustomImage
              src={images[1]}
              slug="about"
              width="1256"
              height="1570"
            />
          </div>
        </div>
      </PhotoFrame>
    </div>
  );
};

export default TuanPhoto;
