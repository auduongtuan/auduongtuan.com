import { useState } from "react";
import Button from "@atoms/Button";
import CustomVideo from "@atoms/CustomVideo";
import Headline from "./Headline";
import { PhotoFrame } from "@atoms/Frame";
import useHeaderInView from "@hooks/useHeaderInView";
import Fade from "@atoms/Fade";
import GifText from "./GifText";
import Balancer from "react-wrap-balancer";
import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react";
import { event } from "@lib/gtag";

export default function Header() {
  const { ref } = useHeaderInView();
  const [activeGif, setActiveGif] = useState<number | null>(null);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    middleware: [
      offset(8),
      shift({
        padding: 8,
      }),
    ],
    open: activeGif != null,
    whileElementsMounted: autoUpdate,
  });
  const gifs = [
    {
      name: "lam-dau-tram-ho.gif",
      video: "designer.mp4",
      size: [480, 264],
    },
    {
      name: "muon-bung-chay.gif",
      video: "codes.mp4",
      size: [480, 270],
    },
    {
      name: "unicorn.gif",
      video: "unicorn.mp4",
      size: [480, 480],
    },
  ];
  const setupGif = (gifIndex: number) => {
    return {
      onMouseEnter: () => {
        setActiveGif(gifIndex);
        event({
          action: "hover_gif",
          category: "engagement",
          label: gifs[gifIndex].name,
          value: gifs[gifIndex].video,
        });
      },
      onMouseLeave: () => {
        setActiveGif(null);
      },
      ref: activeGif == gifIndex ? refs.setReference : null,
    };
  };

  return (
    <header
      ref={ref}
      className="z-10 w-full border-b bg-surface text-primary border-b-divider"
    >
      <div className="main-container p-header">
        <div className="flex items-center justify-center">
          <div className="lg:max-w-[50rem] ">
            <Headline />
            <Fade delay={200}>
              <p className="relative z-30 mt-4 font-serif text-center body-text text-secondary lg:mt-6">
                <Balancer className="max-w-[40rem]" ratio={1}>
                  A software <GifText {...setupGif(0)}>designer</GifText>{" "}
                  <span className="text-divider">/</span>{" "}
                  <GifText {...setupGif(1)}>developer</GifText>{" "}
                  <span className="text-divider">/</span>{" "}
                  <GifText {...setupGif(2)}>whatever</GifText> who strives to
                  make good products with the human at the center
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
              <Button href="/about" className="mt-4 md:mt-6" arrow>
                Get to know me
              </Button>
            </Fade>
          </div>
          {/* <div className="relative z-30 col-span-12 col-start-1 row-start-1 row-end-2 pointer-events-none lg:col-span-4 md:block"> */}

          <div ref={refs.setFloating} className="z-40" style={floatingStyles}>
            <div className="w-[360px] max-w-full grid grid-cols-1 grid-rows-1">
              {gifs.map((gif, i) => (
                <Fade
                  key={gif.name}
                  duration={100}
                  show={activeGif === i}
                  slide
                  className="inline col-start-1 row-start-1"
                >
                  <PhotoFrame
                    name={gif.name}
                    inverted
                    className="w-full h-auto"
                  >
                    <CustomVideo
                      slug="gif"
                      src={gif.video}
                      width={gif.size[0]}
                      height={gif.size[1]}
                      className="w-full h-auto"
                    />
                  </PhotoFrame>
                </Fade>
              ))}
            </div>
          </div>

          {/* </div> */}
        </div>
      </div>
    </header>
  );
}
