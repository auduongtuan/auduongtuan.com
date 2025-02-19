import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import IconButton from "@atoms/IconButton";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { event } from "@lib/gtag";
import { Fact } from "@lib/notion/fact";
import { NotionNowItem } from "@lib/notion/now";
import { trackEvent } from "@lib/utils";
import Reaction from "@molecules/comment/Reaction";
import Footer from "@molecules/Footer";
import HoverGif from "@molecules/HoverGif";
import { richTextObject } from "@notion/richText";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";
import { RiCrossFill } from "react-icons/ri";
import Now from "./Now";

export default function AboutPage({
  nowItems,
  facts,
}: {
  nowItems: NotionNowItem[];
  facts: Fact[];
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  // const [showImage, setShowImage] = useState(false);
  // const [position, setPosition] = useState([0, 0]);
  const [factToDisplay, setFactToDisplay] = useState(-1);
  const chooser = useMemo(() => {
    const array = Array.from({ length: facts.length }, (_, i) => i);
    let copy = array.slice(0);
    return function () {
      if (copy.length < 1) {
        copy = array.slice(0);
      }
      var index = Math.floor(Math.random() * copy.length);
      var item = copy[index];
      copy.splice(index, 1);
      return item;
    };
  }, [facts]);
  const reloadFact = useCallback(() => {
    setFactToDisplay(chooser());
  }, [chooser]);
  useEffect(() => {
    reloadFact();
  }, []);
  return (
    <div className="bg-surface">
      <main className="text-primary bg-surface z-10 w-full">
        <div className="main-container py-section-vertical">
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
                <Reaction
                  page="/about#avatar"
                  size="small"
                  className="inline-flex"
                />
              </Fade>
            </div>
            <div
              ref={contentRef}
              className="font-display col-span-12 text-lg leading-relaxed md:col-span-7 md:text-xl md:leading-relaxed lg:text-xl lg:leading-relaxed [&_h3:not(:first-child)]:mt-6 lg:[&_h3:not(:first-child)]:mt-13 [&_p:not(:first-child)]:mt-3 lg:[&_p:not(:first-child)]:mt-4"
            >
              <Fade delay={150} as="p">
                Xin chào!
              </Fade>
              <Fade delay={200} as="p">
                My name is Au Duong Tuan. I&apos;m a software{" "}
                <Tooltip content="View more information about this role">
                  <InlineLink href="/blog/ux-design-engineer">
                    {/* versatile software professional */}design engineer
                  </InlineLink>
                </Tooltip>
                , transitioning between the roles of a designer, developer, or
                any other hat required to bring my creative visions to life.
              </Fade>
              <Fade as="h3" delay={250} className="subheading">
                How I got started to the industry
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
              </Fade>
              <Fade
                as="h3"
                delay={450}
                className="subheading flex items-center gap-2"
              >
                <span>Random fact</span>
                <Tooltip content="Load another random fact">
                  <IconButton
                    size="small"
                    onClick={() => {
                      reloadFact();
                      event({
                        action: "reload_random_fact",
                        category: "about_page",
                        label: "Reload random fact",
                      });
                      trackEvent({
                        event: "reload_random_fact",
                        content: facts[factToDisplay].slug,
                        page: window.location.pathname,
                      });
                    }}
                  >
                    <FiRefreshCcw />
                  </IconButton>
                </Tooltip>
              </Fade>
              {factToDisplay >= 0 && (
                <>
                  <Fade as="p" delay={450}>
                    {richTextObject(facts[factToDisplay].content)}
                  </Fade>
                  <Fade as="p" delay={450}>
                    <Reaction
                      page={`/about#${facts[factToDisplay].slug}`}
                      size="small"
                      className="inline-flex"
                    />
                  </Fade>
                </>
              )}
              <Fade as="h3" delay={500} className="subheading mt-4 md:mt-8">
                Now ⏰{" "}
              </Fade>
              <Fade as="p" delay={500}>
                {`This section updates what I'm doing, as inspired by `}
                <InlineLink href="https://sive.rs/nowff">
                  Now page momment ↗
                </InlineLink>
                .
              </Fade>
              <Fade delay={550} slide className="mt-4 md:mt-6">
                <Now items={nowItems} />
              </Fade>
            </div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}
