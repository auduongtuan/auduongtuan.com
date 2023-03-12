import { useRef, useState } from "react";
import Button from "../../atoms/Button";
import CustomVideo from "../../atoms/CustomVideo";
import Headline from "./Headline";
import { PhotoFrame } from "../../atoms/Frame";
import useHeaderInView from "../../../hooks/useHeaderInView";
import Tooltip from "../../atoms/Tooltip";
import Fade from "../../atoms/Fade";
import GifText from "./GifText";

export default function Header() {
  const { ref } = useHeaderInView();
  const [activeGif, setActiveGif] = useState<number | null>(null);
  const setupGif = (gifIndex: number) => {
    return {
      onMouseEnter: () => setActiveGif(gifIndex),
      onMouseLeave: () => setActiveGif(null),
    }
  }
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-8 lg:max-w-[50rem] z-4">
            <Headline />
            <Fade delay={200}>
            <p className="big-body-text mt-6 lg:mt-9">
              I am a hybrid{" "}
              <GifText {...setupGif(0)}>
                designer
              </GifText>{" "}
              x{" "}
              <GifText {...setupGif(1)}>
                developer
              </GifText>{" "}
              (maybe a{" "}
              <Tooltip content="Read more about this term">
                <GifText
                  href="https://www.google.com/search?q=unicorn+designer"
                  {...setupGif(2)}
                  external
                >
                  unicorn
                </GifText>
              </Tooltip>
              ?).
            </p>
            </Fade>
            <Fade className="big-body-text mt-2" delay={300}>
              Everyday I try to make good products with the human at the center.
            </Fade>
            <Fade delay={500}>
              <Button
                href="/about"
                className="mt-6 md:mt-10"
                colorful
                arrow
              >
                Get to know me
              </Button>
            </Fade>
          </div>
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-4 relative z-30 pointer-events-none md:block">
            <Fade duration={100} show={activeGif == 0} slide className="w-full absolute md:top-0">
              <PhotoFrame
                name="lam-dau-tram-ho.gif"
                inverted
              >
                <CustomVideo
                  className="w-full h-auto"
                  slug="gif"
                  src="designer.mp4"
                  width={480}
                  height={264}
                  show={activeGif == 0}
                />
              </PhotoFrame>
            </Fade>
            <Fade duration={100} show={activeGif == 1} slide className="w-full absolute md:bottom-0">
              <PhotoFrame
                name="muon-bung-chay.gif"
                inverted
              >
                <CustomVideo
                  className="w-full h-auto"
                  slug="gif"
                  src="codes.mp4"
                  width={480}
                  height={270}
                  show={activeGif == 1}
                />
              </PhotoFrame>
            </Fade>
            <Fade duration={100} show={activeGif == 2} slide className="w-full absolute md:-bottom-8">
              <PhotoFrame
                name="unicorn-designer.gif"
                inverted
              >
                <CustomVideo
                  className="w-full h-auto"
                  slug="gif"
                  src="unicorn.mp4"
                  width={480}
                  height={480}
                  show={activeGif == 2}
                />
              </PhotoFrame>
            </Fade>
          </div>
        </div>
      </div>
    </header>
  );
}