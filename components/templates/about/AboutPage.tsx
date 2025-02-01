import React from "react";
import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import { PhotoFrame } from "@atoms/Frame";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import {
  autoUpdate,
  offset,
  shift,
  size,
  useFloating,
} from "@floating-ui/react";
import { Portal } from "@headlessui/react";
import { event } from "@lib/gtag";
import { useRef, useState } from "react";
import { RiCrossFill } from "react-icons/ri";
import Now from "./Now";
import { NotionNowItem } from "@lib/notion/now";
import Footer from "@molecules/Footer";
import { trackEvent } from "@lib/utils";
import Reaction from "@molecules/comment/Reaction";

function HoverGif({
  text,
  children,
  label,
}: {
  text: React.ReactElement;
  label: string;
  children: React.ReactNode;
}) {
  const [showGif, setShowGif] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    middleware: [
      offset(8),
      shift({
        padding: 8,
      }),
      size({
        padding: 8,
        apply({ availableWidth, availableHeight, elements }) {
          // Change styles, e.g.
          Object.assign(elements.floating.style, {
            maxWidth: `${availableWidth}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
      }),
    ],
    open: showGif,
    whileElementsMounted: autoUpdate,
  });
  const el = React.cloneElement(text as React.ReactElement<any>, {
    onMouseEnter: (e: React.MouseEvent) => {
      setShowGif(true);
      event({
        action: "hover_gif",
        category: "about_page",
        label: label,
      });
      trackEvent({
        event: "hover_gif",
        content: label,
        page: window.location.pathname,
      });
    },
    onMouseLeave: () => {
      setShowGif(false);
    },
    ref: refs.setReference,
  });
  return (
    <>
      {el}
      <Portal>
        <div ref={refs.setFloating} className="z-40" style={floatingStyles}>
          <Fade duration={100} show={showGif} slide>
            <PhotoFrame name={label} inverted>
              {children}
            </PhotoFrame>
          </Fade>
        </div>
      </Portal>
    </>
  );
}

export default function AboutPage({ nowItems }: { nowItems: NotionNowItem[] }) {
  const contentRef = useRef<HTMLDivElement>(null);
  // const [showImage, setShowImage] = useState(false);
  // const [position, setPosition] = useState([0, 0]);

  return (
    <div className="bg-surface">
      <main className="text-primary bg-surface z-10 w-full">
        <div className="main-container p-header">
          <div className="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-8">
            <div className="relative col-span-12 flex items-start justify-center self-stretch md:col-span-5 md:justify-start">
              <Fade
                delay={50}
                className="border-divider inline-flex flex-col items-start justify-start gap-3 rounded-lg border p-4"
              >
                <CustomImage
                  src="/portrait.jpg"
                  alt="Tuan's portrait"
                  width={1920}
                  height={2556}
                  className="max-w-[20rem] self-stretch rounded-md"
                />
                <div className="font-mono">
                  <p className="font-semibold">@auduongtuan</p>
                  <p className="mt-1 text-xs">
                    Lập xuân đua nở hoa đào 🌸
                    <br />
                    Tim cậu liệu có ai vào hay chưa? 😳
                  </p>
                </div>
                <Reaction page="/about" size="small" className="inline-flex" />
              </Fade>
            </div>
            <div
              ref={contentRef}
              className="font-display col-span-12 text-lg leading-relaxed md:col-span-7 md:text-xl md:leading-relaxed lg:text-xl lg:leading-relaxed [&_h3:not(:first-child)]:mt-6 lg:[&_h3:not(:first-child)]:mt-10 [&_p:not(:first-child)]:mt-3 lg:[&_p:not(:first-child)]:mt-4"
            >
              <Fade delay={150} as="p">
                Xin chào!
              </Fade>
              <Fade delay={200} as="p">
                My name is Au Duong Tuan
                {/* <Tooltip
                  content={showImage ? "Close my photo" : "Open my photo"}
                >
                  <InlineLink
                    href={"#"}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      let rect = contentRef.current?.getBoundingClientRect();
                      // console.log(rect);
                      if (!rect) return;
                      event({
                        action: "view_about_photo",
                        category: "about_page",
                        label: "View Tuan's photo",
                      });
                      setPosition([rect.left, rect.top + 40]);
                      setShowImage(true);
                    }}
                  >
                    Tuan 👨‍💻
                   <CustomImage
                      src="/favicon/apple-icon-180x180.png"
                      width={24}
                      height={24}
                      className="inline w-6 h-6"
                    ></CustomImage> 
                  </InlineLink>
                </Tooltip>*/}
                . I&apos;m a software{" "}
                <Tooltip content="View more information about this role">
                  <InlineLink href="/blog/ux-design-engineer">
                    {/* versatile software professional */}design engineer
                  </InlineLink>
                </Tooltip>
                , transitioning between the roles of a designer, developer, or
                any other hat required to bring my creative visions to life.
                {/* I&apos;m Tuan - a software designer and developer. */}
                {/* Proudly having many skills that span across a spectrum of
            disciplines helps me to solve problems in creative, organized
            and programmatic ways. */}
              </Fade>
              <Fade as="h3" delay={250} className="subheading">
                How I got started
              </Fade>
              <Fade delay={250} as="p">
                My journey began when I taught myself design and code while
                tinkering with the Yahoo! blog theme. Then, I pursued a BFA in
                Design at{" "}
                <HoverGif
                  text={
                    <InlineLink
                      className="text-[#ab3632]"
                      href="https://uah.edu.vn"
                    >
                      UAH
                    </InlineLink>
                  }
                  label="uah.jpg"
                >
                  <CustomImage
                    src="/uploads/about/uah.jpg"
                    width={512}
                    height={341}
                  />
                </HoverGif>{" "}
                and a BS in Tech at{" "}
                <HoverGif
                  text={
                    <InlineLink
                      className="text-[#183679]"
                      href="https://hcmus.edu.vn/"
                    >
                      HCMUS
                    </InlineLink>
                  }
                  label="hcmus.jpg"
                >
                  <CustomImage
                    src="/uploads/about/hcmus.jpg"
                    width={340}
                    height={512}
                  />
                </HoverGif>
                . You can read more at{" "}
                <InlineLink href="/blog/my-digital-journey">
                  my &quot;digital&quot; journey
                </InlineLink>
                .
              </Fade>
              <Fade as="h3" delay={300} className="subheading">
                My professional work
              </Fade>
              <Fade delay={350} as="p">
                Currently, I spend my days working on bioinformatics products at{" "}
                <InlineLink
                  className="text-[#00B4DB]"
                  href="https://bioturing.com/"
                >
                  BioTuring
                </InlineLink>
                . Previously, I had worked on products, design systems and
                design ops at companies like{" "}
                <InlineLink
                  className="text-[#05295d]"
                  href="https://aperia.com"
                >
                  Aperia
                </InlineLink>
                ,{" "}
                <HoverGif
                  text={
                    <InlineLink
                      href="https://www.baemin.vn"
                      className="text-[#54b0ad]"
                    >
                      BAEMIN VN
                    </InlineLink>
                  }
                  label="baemin-cry.gif"
                >
                  <CustomVideo
                    slug="gif"
                    src="baemin.mp4"
                    width={480}
                    height={480}
                  />
                </HoverGif>
                <RiCrossFill className="text-secondary mb-1 inline h-4 w-4" />.
                {/* <span>Curious for more details?</span>{" "}
                <InlineLink
                  href={cvLink}
                  onClick={() => {
                    event({
                      action: "download_cv",
                      category: "about_page",
                      label: "Download CV",
                    });
                  }}
                >
                  Download my CV
                </InlineLink>. */}
              </Fade>
              {/* <div className="col-span-12 lg:col-span-4 lg:col-start-9"> */}
              <Fade as="h3" delay={450} className="subheading mt-4 md:mt-8">
                Now ⏰{" "}
              </Fade>
              <Fade as="p" delay={450}>
                {`This section updates what I'm doing, as inspired by `}
                <InlineLink href="https://sive.rs/nowff">
                  Now page momment ↗
                </InlineLink>
                .
              </Fade>
              <Fade delay={400} slide className="mt-4 md:mt-6">
                <Now items={nowItems} />
              </Fade>
              {/* </div> */}
            </div>
          </div>
          {/* <Portal>
            <div
              className="absolute w-0 z-80"
              style={{ left: position[0], top: position[1] }}
            >
              <Fade show={showImage} as="div" duration={100} slide>
                <TuanPhoto
                  onClose={() => {
                    setShowImage(false);
                    event({
                      action: "close_about_photo",
                      category: "about_page",
                      label: "Close Tuan's photo",
                    });
                  }}
                />
              </Fade>
            </div>
          </Portal> */}
        </div>
      </main>
      {/* <AboutContent /> */}
      <Footer></Footer>
    </div>
  );
}
