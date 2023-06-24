import { useRef, useState } from "react";
import Button from "../../atoms/Button";
import CustomVideo from "../../atoms/CustomVideo";
import Headline from "./Headline";
import { PhotoFrame } from "../../atoms/Frame";
import useHeaderInView from "../../../hooks/useHeaderInView";
import Tooltip from "../../atoms/Tooltip";
import Fade from "../../atoms/Fade";
import GifText from "./GifText";
import Balancer from "react-wrap-balancer";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating,
} from "@floating-ui/react";

export default function Header() {
  const { ref } = useHeaderInView();
  const [activeGif, setActiveGif] = useState<number | null>(null);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    middleware: [
      offset(8),
      flip(),
      shift({
        padding: 8,
      }),
    ],
    open: activeGif != null,
    whileElementsMounted: autoUpdate,
  });

  const setupGif = (gifIndex: number) => {
    return {
      onMouseEnter: () => setActiveGif(gifIndex),
      onMouseLeave: () => {
        setActiveGif(null);
      },
      ref: activeGif == gifIndex ? refs.setReference : null,
    };
  };

  return (
    <header ref={ref} className="z-10 w-full text-white bg-custom-neutral-900">
      <div className="main-container p-header">
        <div className="flex items-center justify-center">
          <div className="lg:max-w-[50rem] z-4">
            <Headline />
            <Fade delay={200}>
              <p className="mt-6 text-center page-description lg:mt-9">
                <Balancer>
                  A software <GifText {...setupGif(0)}>designer</GifText>{" "}
                  <span className="text-white/40">/</span>{" "}
                  <GifText {...setupGif(1)}>developer</GifText>{" "}
                  <span className="text-white/40">/</span>{" "}
                  <GifText {...setupGif(2)}>whatever</GifText> who tries to make
                  good stuff with the human at the center
                </Balancer>
                {/* (maybe a{" "}
                <Tooltip content="Read more about this term">
                  <GifText
                    href="https://www.google.com/search?q=unicorn+designer"
                    {...setupGif(2)}
                    external
                  >
                    unicorn
                  </GifText>
                </Tooltip>
                ?). */}
              </p>
            </Fade>

            <Fade delay={500} className="flex justify-center">
              <Button href="/about" className="mt-6 md:mt-10" colorful arrow>
                Get to know me
              </Button>
            </Fade>
          </div>
          {/* <div className="relative z-30 col-span-12 col-start-1 row-start-1 row-end-2 pointer-events-none lg:col-span-4 md:block"> */}

          <div ref={refs.setFloating} style={floatingStyles}>
            <div className="max-w-[480px] w-full grid grid-cols-1 grid-rows-1">
              <Fade
                duration={100}
                show={activeGif === 0}
                slide
                className="inline col-start-1 row-start-1"
              >
                <PhotoFrame
                  name="lam-dau-tram-ho.gif"
                  inverted
                  className="w-full h-auto"
                >
                  <CustomVideo
                    slug="gif"
                    src="designer.mp4"
                    width={480}
                    height={264}
                    className="w-full h-auto"
                  />
                </PhotoFrame>
              </Fade>
              <Fade
                duration={100}
                show={activeGif === 1}
                slide
                className="inline col-start-1 row-start-1"
              >
                <PhotoFrame name="muon-bung-chay.gif" inverted>
                  <CustomVideo
                    slug="gif"
                    src="codes.mp4"
                    width={480}
                    height={270}
                  />
                </PhotoFrame>
              </Fade>
              <Fade
                duration={100}
                show={activeGif === 2}
                slide
                className="inline col-start-1 row-start-1"
              >
                <PhotoFrame name="unicorn.gif" inverted>
                  <CustomVideo
                    slug="gif"
                    src="unicorn.mp4"
                    width={480}
                    height={480}
                  />
                </PhotoFrame>
              </Fade>
            </div>
          </div>

          {/* </div> */}
        </div>
      </div>
    </header>
  );
}
