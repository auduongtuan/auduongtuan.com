import React, { forwardRef, useEffect, useRef, useState, Ref } from "react";
import Button from "../atoms/Button";
import CustomVideo from "../atoms/CustomVideo";
import ExternalLink from "../atoms/ExternalLink";
import Headline from "../atoms/Headline";
import Link from "next/link";
import { PhotoFrame } from "../atoms/Frame";
import useHeaderInView from "../../hooks/useHeaderInView";
import Tooltip from "../atoms/Tooltip";

interface GifTextProps extends React.HTMLProps<HTMLAnchorElement> {
  // gif?: HTMLElement|null;
  external?: boolean;
}
const GifText = forwardRef<HTMLAnchorElement, GifTextProps>(
  (
    { children, href, external = false, ...rest },
    ref
  ) => {
    const className =
      "underline decoration-2 underline-offset-4 transition-all duration-200 decoration-gray-600 hover:decoration-transparent inline-block -mx-2 -my-1 px-2 py-1 rounded-xl hover:bg-white/5";
    const Component = (href) ? ExternalLink : 'span';
    if (external || !href) {
      return (
        <Component
          href={href}
          className={className}
          {...rest}
          ref={ref}
        >
          {children}
        </Component>
      );
    } else {
      return (
        <Link href={href} legacyBehavior>
          <a
            className={className}
            {...rest}
            ref={ref}
          >
            {children}
          </a>
        </Link>
      );
    }
  }
);
GifText.displayName = "GifText";
export default function Header() {
  const { ref } = useHeaderInView();

  const gifs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeGif, setActiveGif] = useState<number | null>(null);
  
  const showGif = (gifIndex) => {
    gifs.current[gifIndex]?.classList.add("animate-slide-in-fast");
    if (setActiveGif) setActiveGif(gifIndex);
  };
  const hideGif = (gifIndex) => {
    gifs.current[gifIndex]?.classList.remove("animate-slide-in-fast");
    if (setActiveGif) setActiveGif(null);
  };

  const setupGif = (gifIndex) => {
    return {
      onMouseEnter: (e) => showGif(gifIndex),
      onMouseLeave: (e) => hideGif(gifIndex),
    }
  }
  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-8 lg:max-w-[50rem] z-4">
            <Headline />
            <p className="text-base md:text-2xl mt-6 lg:mt-9 _tracking-tight opacity-0 animate-fade-in-fast animation-delay-400">
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
            <p className="text-base md:text-2xl mt-2 _tracking-tight opacity-0 animate-fade-in-fast animation-delay-500">
              Everyday I try to make good products with the human at the center.
            </p>
            <Button
              href="/about"
              className="mt-6 md:mt-10 opacity-0 animate-fade-in-fast animation-delay-500"
              colorful
              arrow
            >
              Get to know me
            </Button>
          </div>
          <div className="col-span-12 col-start-1 row-start-1 row-end-2 lg:col-span-4 relative z-30 pointer-events-none md:block">
            <PhotoFrame
              ref={(el) => (gifs.current[0] = el)}
              className="absolute md:top-0 opacity-0"
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
            <PhotoFrame
              ref={(el) => (gifs.current[1] = el)}
              className="absolute md:bottom-0 opacity-0"
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
            <PhotoFrame
              ref={(el) => (gifs.current[2] = el)}
              className="absolute md:-bottom-8 opacity-0"
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
          </div>
        </div>
      </div>
    </header>
  );
}
