import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import { PhotoFrame } from "@atoms/Frame";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react";
import { Portal } from "@headlessui/react";
import useHeaderInView from "@hooks/useHeaderInView";
import { event } from "@lib/gtag";
import { useRef, useState } from "react";
import { RiCrossFill } from "react-icons/ri";
import { cvLink } from "./content";
import Now from "./Now";
import TuanPhoto from "./TuanPhoto";
import { NotionNowItem } from "@lib/notion/now";
import Footer from "@molecules/Footer";

export default function AboutPage({ nowItems }: { nowItems: NotionNowItem[] }) {
  const { ref } = useHeaderInView();
  const contentRef = useRef<HTMLDivElement>(null);
  const [showImage, setShowImage] = useState(false);
  const [position, setPosition] = useState([0, 0]);
  const [showGif, setShowGif] = useState(false);
  const { refs, floatingStyles } = useFloating({
    placement: "bottom",
    middleware: [
      offset(8),
      shift({
        padding: 8,
      }),
    ],
    open: showGif,
    whileElementsMounted: autoUpdate,
  });
  return (
    <div className="bg-surface">
      <main
        ref={ref}
        className="z-10 w-full overflow-hidden text-primary bg-surface"
      >
        <div className="main-container p-header">
          <div className="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-y-8 md:gap-x-8">
            <div
              ref={contentRef}
              className="col-span-12 lg:col-span-7 text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-display [&_p:not(:first-child)]:mt-4 lg:[&_p:not(:first-child)]:mt-6"
            >
              <Fade delay={150} as="p">
                Xin chào!
              </Fade>
              <Fade delay={200} as="p">
                My name is{" "}
                <Tooltip
                  content={showImage ? "Close my photo" : "Open my photo"}
                >
                  <InlineLink
                    href={"#"}
                    onClick={(e) => {
                      e.preventDefault();
                      var rect = contentRef.current?.getBoundingClientRect();
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
                    Tuan{" "}
                    <CustomImage
                      src="/favicon/apple-icon-180x180.png"
                      width={24}
                      height={24}
                      className="inline w-6 h-6"
                    ></CustomImage>
                  </InlineLink>
                </Tooltip>
                . I&apos;m a{" "}
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
              <Fade delay={250} as="p">
                My journey began when I taught myself design and code while
                tinkering with the Yahoo! blog theme. Then, I pursued a BFA in
                Design at{" "}
                <InlineLink
                  className="text-[#ab3632]"
                  href="https://uah.edu.vn"
                >
                  UAH
                </InlineLink>{" "}
                and a BS in Tech at{" "}
                <InlineLink
                  className="text-[#183679]"
                  href="https://hcmus.edu.vn/"
                >
                  HCMUS
                </InlineLink>
                . You can read more at{" "}
                <InlineLink href="/blog/my-digital-journey">
                  my digital journey
                </InlineLink>
                .
              </Fade>
              <Fade delay={300} as="p">
                Previously, I had worked on Design systems and Design ops at
                companies like{" "}
                <InlineLink
                  className="text-[#05295d]"
                  href="https://aperia.com"
                >
                  Aperia
                </InlineLink>
                ,{" "}
                <InlineLink
                  href="https://www.baemin.vn"
                  className="text-[#54b0ad]"
                  onMouseEnter={(e) => {
                    setShowGif(true);
                    event({
                      action: "hover_gif",
                      category: "about_page",
                      label: "baemin-cry.gif",
                    });
                  }}
                  onMouseLeave={() => {
                    setShowGif(false);
                  }}
                  ref={refs.setReference}
                >
                  BAEMIN VN
                </InlineLink>
                <RiCrossFill className="inline w-4 h-4 mb-1 text-secondary" />.
                I am currently seeking a role in a product company where I can
                enhance my technical abilities and product mindset.
              </Fade>
              <Fade delay={350} as="p">
                <span>Curious for more details?</span>{" "}
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
                  Download my CV{" "}
                </InlineLink>
              </Fade>
            </div>
            <Portal>
              <div
                ref={refs.setFloating}
                className="z-40"
                style={floatingStyles}
              >
                <Fade
                  duration={100}
                  show={showGif}
                  slide
                  className="inline col-start-1 row-start-1"
                >
                  <PhotoFrame name="baemin-cry.gif" inverted>
                    <CustomVideo
                      slug="gif"
                      src="baemin.mp4"
                      width={480}
                      height={480}
                    />
                  </PhotoFrame>
                </Fade>
              </div>
            </Portal>
            <div className="col-span-12 lg:col-span-4 lg:col-start-9">
              <Fade
                delay={400}
                slide
                className="flex flex-col items-center justify-center h-full"
              >
                <Now items={nowItems} />
              </Fade>
            </div>
          </div>
          <Portal>
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
          </Portal>
        </div>
      </main>
      {/* <AboutContent /> */}
      <Footer></Footer>
    </div>
  );
}
