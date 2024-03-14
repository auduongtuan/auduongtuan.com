import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import { AppFrame, PhotoFrame } from "@atoms/Frame";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { autoUpdate, offset, shift, useFloating } from "@floating-ui/react";
import { Portal } from "@headlessui/react";
import useHeaderInView from "@hooks/useHeaderInView";
import { useRef, useState } from "react";
import { RiCrossFill } from "react-icons/ri";
import { cvLink, now } from "./content";

export default function AboutHeader() {
  const { ref } = useHeaderInView();
  const contentRef = useRef<HTMLDivElement>(null);
  const images = ["tuan_smile.jpg", "tuan_grin.jpg"];
  const [image, setImage] = useState(0);
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
    <header ref={ref} className="z-10 w-full text-primary bg-surface">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-4 md:gap-8">
          <div
            ref={contentRef}
            className="col-span-12 lg:col-span-7 text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed lg:leading-relaxed font-display [&_p:not(:first-child)]:mt-6"
          >
            <Fade delay={150} as="p">
              Xin chào!
            </Fade>
            <Fade delay={200} as="p">
              My name is{" "}
              <Tooltip content={showImage ? "Close my photo" : "Open my photo"}>
                <InlineLink
                  href={"#"}
                  onClick={(e) => {
                    e.preventDefault();
                    var rect = contentRef.current?.getBoundingClientRect();
                    if (!rect) return;
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
              , transitioning between the roles of a designer, developer, or any
              other hat required to bring my creative visions to life.
              {/* I&apos;m Tuan - a software designer and developer. */}
              {/* Proudly having many skills that span across a spectrum of
            disciplines helps me to solve problems in creative, organized
            and programmatic ways. */}
            </Fade>
            <Fade delay={250} as="p">
              My journey began when I taught myself design and code while
              tinkering with the Yahoo! blog theme. Then, I pursued a BFA in
              Design at{" "}
              <InlineLink className="text-[#ab3632]" href="https://uah.edu.vn">
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
              <InlineLink className="text-[#05295d]" href="https://aperia.com">
                Aperia
              </InlineLink>
              ,{" "}
              <InlineLink
                href="https://www.baemin.vn"
                className="text-[#54b0ad]"
                onMouseEnter={(e) => {
                  console.log("a");
                  setShowGif(true);
                }}
                onMouseLeave={() => {
                  setShowGif(false);
                }}
                ref={refs.setReference}
              >
                BAEMIN VN
              </InlineLink>
              <RiCrossFill className="inline w-4 h-4 mb-1 text-secondary" />. I
              am currently seeking a role in a product company where I can
              enhance my technical abilities and product mindset.
            </Fade>
            <Fade delay={350} as="p">
              <span>Curious for more details?</span>{" "}
              <InlineLink href={cvLink}>Download my CV </InlineLink>
            </Fade>
          </div>
          <Portal>
            <div ref={refs.setFloating} className="z-40" style={floatingStyles}>
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
            <Fade delay={400} slide>
              <AppFrame title="Now">
                <div className="flex flex-col gap-4 p-4 leading-normal">
                  <p>
                    {`This section updates what I'm doing, as inspired by `}
                    <InlineLink href="https://sive.rs/nowff">
                      Now page momment ↗
                    </InlineLink>
                    .
                  </p>
                  <div className="flex flex-col gap-2">
                    {now.map((item, i) => (
                      <div
                        className="px-3 py-2 rounded-md md:px-4 bg-slate-100"
                        key={`now-${i}`}
                      >
                        <p className="text-sm mt-0.5 text-gray-500">
                          {item.title}
                        </p>
                        <div className="mt-1 font-medium text-md body-text">
                          {item.link ? (
                            <InlineLink href={item.link}>
                              {item.content}
                            </InlineLink>
                          ) : (
                            item.content
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AppFrame>
            </Fade>
          </div>
        </div>
        <Portal>
          <div
            className="absolute w-0 z-80"
            style={{ left: position[0], top: position[1] }}
          >
            <Fade show={showImage} as="div" duration={100} slide>
              <div
                onMouseOver={() => setImage(1)}
                onMouseLeave={() => setImage(0)}
              >
                <PhotoFrame
                  draggable
                  name={images[image]}
                  closeTooltipContent="Hide my face 😢"
                  inverted
                  onClose={() => setShowImage(false)}
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
            </Fade>
          </div>
        </Portal>
      </div>
    </header>
  );
}
