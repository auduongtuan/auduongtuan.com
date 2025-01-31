import { useState } from "react";
import Button from "@atoms/Button";
import CustomVideo from "@atoms/CustomVideo";
import Headline from "./Headline";
import { PhotoFrame } from "@atoms/Frame";
import Fade from "@atoms/Fade";
import GifText from "./GifText";
import Balancer from "react-wrap-balancer";
import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react";
import { event } from "@lib/gtag";
import { Transition } from "@headlessui/react";
import { trackEvent } from "@lib/utils";

export default function Header() {
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
        });
        trackEvent({
          event: "hover_gif",
          content: gifs[gifIndex].name,
          page: window.location.pathname,
        });
      },
      onMouseLeave: () => {
        setActiveGif(null);
      },
      ref: activeGif == gifIndex ? refs.setReference : null,
    };
  };

  return (
    <header className="z-10 w-full bg-surface text-primary ">
      <div className="main-container p-header">
        <div className="flex items-center justify-center">
          <div className="lg:max-w-[50rem]  py-4 md:py-6">
            <Headline />
            <Fade delay={200}>
              <p className="relative z-30 mt-4 font-mono tracking-tight text-center body-text text-secondary lg:mt-6">
                <Balancer className="max-w-[40rem]" ratio={1}>
                  Wearing <GifText {...setupGif(0)}>🧑‍🎨 designer</GifText>{" "}
                  <span className="text-divider">/</span>{" "}
                  <GifText {...setupGif(1)}>👨‍💻 developer</GifText>{" "}
                  <span className="text-divider">/</span>{" "}
                  <GifText {...setupGif(2)}>🦄 whatever</GifText> hats to bring
                  exceptional digital products to life.
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

          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-40 w-[360px] max-w-[100vw]"
          >
            {gifs.map((gif, i) => (
              <Transition
                key={gif.name}
                show={activeGif !== null && activeGif === i}
              >
                <Transition.Child
                  enter="transition-all duration-200"
                  enterFrom="opacity-0 translate-y-10"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition-all duration-200"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-10"
                >
                  <PhotoFrame name={gif.name} inverted>
                    <CustomVideo
                      slug="gif"
                      src={gif.video}
                      width={gif.size[0]}
                      height={gif.size[1]}
                    />
                  </PhotoFrame>
                </Transition.Child>
              </Transition>
            ))}
          </div>

          {/* </div> */}
        </div>
      </div>
    </header>
  );
}
