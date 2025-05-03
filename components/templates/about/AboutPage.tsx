import CustomImage from "@atoms/CustomImage";
import CustomVideo from "@atoms/CustomVideo";
import Fade from "@atoms/Fade";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { Fact } from "@lib/notion/fact";
import { NotionNowItem } from "@lib/notion/now";
import Footer from "@molecules/Footer";
import HoverGif from "@molecules/HoverGif";
import { useRef } from "react";
import { RiCrossFill } from "react-icons/ri";
import Now from "@molecules/about/Now";
import PhotoCards from "@molecules/about/PhotoCards";
import RandomFacts from "@molecules/about/RandomFacts";

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

  return (
    <div className="bg-surface overflow-x-hidden">
      <main className="text-primary bg-surface z-10 w-full">
        <div className="main-container py-section-vertical">
          <div className="grid grid-cols-12 gap-x-4 gap-y-8 md:gap-x-12 md:gap-y-8">
            <div className="relative col-span-12 flex items-start justify-center self-stretch md:col-span-5 md:justify-start">
              <Fade delay={50} className="w-full max-w-90">
                <PhotoCards />
              </Fade>
            </div>
            <div
              ref={contentRef}
              className="font-display col-span-12 text-lg leading-relaxed md:col-span-7 md:text-xl md:leading-relaxed lg:text-xl lg:leading-relaxed [&_.item:not(:first-child)]:mt-3 lg:[&_.item:not(:first-child)]:mt-4 [&_.section:not(:first-child)]:mt-6 lg:[&_.section:not(:first-child)]:mt-13"
            >
              <Fade delay={150} as="p" className="item">
                Xin chào!
              </Fade>
              <Fade delay={200} as="p" className="item">
                My name is Au Duong Tuan. I&apos;m a software{" "}
                <Tooltip content="View more information about this role">
                  <InlineLink href="/blog/ux-design-engineer">
                    {/* versatile software professional */}design engineer
                  </InlineLink>
                </Tooltip>
                , transitioning between the roles of a designer, developer, or
                any other hat required to bring my creative visions to life.
              </Fade>
              <Fade as="h3" delay={250} className="subheading section">
                How I got started to the industry
              </Fade>
              <Fade delay={250} as="p" className="item">
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
              <Fade as="h3" delay={300} className="subheading section">
                My professional work
              </Fade>
              <Fade delay={350} as="p" className="item">
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
              <RandomFacts facts={facts} />
              <Fade as="h3" delay={500} className="subheading section">
                Now ⏰{" "}
              </Fade>
              <Fade as="p" delay={500} className="item">
                {`This section updates what I'm doing, as inspired by `}
                <InlineLink href="https://sive.rs/nowff">
                  Now page momment ↗
                </InlineLink>
                .
              </Fade>
              <Fade delay={550} slide className="item">
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
