import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import IconButton from "@atoms/IconButton";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { Transition } from "@headlessui/react";
import { useWindowSize } from "@hooks";
import { Fact } from "@lib/notion/fact";
import { NotionNowItem } from "@lib/notion/now";
import { cn } from "@lib/utils/cn";
import { getInnerDimensions } from "@lib/utils/getElementContentWidth";
import Now from "@molecules/about/Now";
import PhotoCards from "@molecules/about/photo/PhotoCards";
import { usePhotoStore } from "@molecules/about/photo/photoStore";
import RandomFacts from "@molecules/about/RandomFacts";
import Footer from "@molecules/Footer";
import HoverGif from "@molecules/HoverGif";
import { useCallback, useRef, useState } from "react";
import { FiGrid, FiInfo, FiLayers } from "react-icons/fi";
import { RiCrossFill } from "react-icons/ri";

export default function AboutPage({
  nowItems,
  facts,
}: {
  nowItems: NotionNowItem[];
  facts: Fact[];
}) {
  const { width } = useWindowSize();
  const containerRef = useCallback(
    (node: HTMLDivElement) => {
      if (node) {
        node.style.setProperty(
          "--container-width",
          getInnerDimensions(node).width + "px",
        );
      }
    },
    [width],
  );

  const { isExpanded, setIsExpanded, setIsExpanding, isExpanding } =
    usePhotoStore();

  return (
    <div className="bg-surface overflow-x-hidden overflow-y-hidden">
      <main className="text-primary bg-surface z-10 w-full">
        <div className="main-container py-section-vertical" ref={containerRef}>
          <div
            className={cn(
              "flex flex-wrap [--gap-x:calc(var(--spacing)*4)] [--gap-y:calc(var(--spacing)*8)] md:flex-nowrap md:[--gap-x:calc(var(--spacing)*8)] md:[--gap-y:calc(var(--spacing)*8)]",
              "gap-x-(--gap-x) gap-y-(--gap-y)",
            )}
          >
            <div
              className={cn(
                "relative col-span-12 flex shrink-0 grow-0 flex-col items-center justify-center gap-2 self-stretch transition-all duration-100 md:justify-start",
                "transition-width duration-1000",
                isExpanded
                  ? "md:w-full"
                  : "md:w-[calc(((100%+var(--gap-x))*5)/12-var(--gap-x))]",
              )}
            >
              {/* <Fade delay={50} className="w-full max-w-90"> */}
              <Fade
                delay={50}
                as="p"
                className="subheading2 inline-flex gap-2 pt-1.5 pb-2 text-center"
              >
                <span>
                  <s>50</s> 9 shades of Tuấn
                </span>
                <Tooltip
                  content={isExpanded ? "Collapse as stack" : "Expand as grid"}
                >
                  <IconButton
                    size="small"
                    variant="ghost"
                    className="hidden md:block"
                    onClick={() => {
                      if (isExpanding) return;
                      if (isExpanded === true) {
                        setIsExpanded(false);
                        setIsExpanding(true);
                      } else {
                        setIsExpanded(true);
                        setIsExpanding(true);
                      }
                    }}
                  >
                    {isExpanded ? <FiLayers /> : <FiGrid />}
                  </IconButton>
                </Tooltip>
              </Fade>
              <PhotoCards />
              {/* </Fade> */}
            </div>
            <Transition
              show={!isExpanded}
              as="div"
              enter="transition-all duration-200"
              enterFrom="opacity-0 md:max-w-1/3"
              enterTo="opacity-100 md:max-w-[calc(((100%+var(--gap-x))*7)/12-var(--gap-x))]"
              leave="transition-all duration-200"
              leaveFrom="opacity-100 md:max-w-[calc(((100%+var(--gap-x))*7)/12-var(--gap-x))]"
              leaveTo="opacity-0 md:max-w-1/3"
              className={cn(
                "font-display w-full shrink grow-0 text-base leading-relaxed md:text-lg md:leading-relaxed [&_.item:not(:first-child)]:mt-2 lg:[&_.item:not(:first-child)]:mt-3 [&_.section:not(:first-child)]:mt-6 lg:[&_.section:not(:first-child)]:mt-10",
              )}
            >
              <Fade delay={150} as="p" className="item">
                Xin chào!
              </Fade>
              <Fade delay={200} as="p" className="item">
                My name is Âu Dương Tuấn. I&apos;m a software{" "}
                <Tooltip content="View more information about this role">
                  <InlineLink href="/blog/ux-design-engineer">
                    {/* versatile software professional */}design engineer
                  </InlineLink>
                </Tooltip>
                , utilising my diverse skillset to bring great products to life.
              </Fade>
              <Fade delay={250} as="p" className="item">
                I spend my days crafting design systems and bioinformatics
                products at{" "}
                <InlineLink
                  className="text-[#00B4DB]"
                  href="https://bioturing.com/"
                >
                  BioTuring
                </InlineLink>
                . Previously,{" "}
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
              </Fade>
              <Fade as="h3" delay={300} className="subheading2 section">
                How I got into the industry
              </Fade>
              <Fade delay={350} as="p" className="item">
                It started with teaching myself design and code to tinker with{" "}
                <InlineLink href="https://vi.wikipedia.org/wiki/Yahoo!_360%C2%B0_Plus">
                  Yahoo! 360° Plus
                </InlineLink>{" "}
                themes. That curiosity turned into a BFA in Design (
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
                </HoverGif>
                ) and a BS in Tech (
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
                ).{" "}
                <InlineLink href="/blog/my-digital-journey">
                  More about my journey
                </InlineLink>
                .
              </Fade>

              <RandomFacts facts={facts} />
              <Fade
                as="h3"
                delay={500}
                className="subheading2 section flex items-center gap-2"
              >
                <span>Now</span>
                <span>
                  <Tooltip
                    content={
                      <>
                        {" "}
                        {`This section updates what I'm doing, as inspired by `}
                        <InlineLink href="https://sive.rs/nowff">
                          Now page momment ↗
                        </InlineLink>
                        .
                      </>
                    }
                  >
                    <IconButton size="small" variant="ghost">
                      <FiInfo />
                    </IconButton>
                  </Tooltip>
                </span>
              </Fade>

              <Fade delay={550} slide className="item">
                <Now items={nowItems} />
              </Fade>
            </Transition>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
