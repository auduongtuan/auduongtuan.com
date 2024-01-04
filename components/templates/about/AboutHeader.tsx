import { useState } from "react";
import CustomImage from "@atoms/CustomImage";
import { PhotoFrame } from "@atoms/Frame";
import useHeaderInView from "@hooks/useHeaderInView";
import Fade from "@atoms/Fade";
import Balancer from "react-wrap-balancer";
import InlineLink from "@atoms/InlineLink";

export default function AboutHeader() {
  const { ref, inView } = useHeaderInView();
  const images = ["tuan_smile.jpg", "tuan_grin.jpg"];
  const [image, setImage] = useState(0);
  return (
    <header ref={ref} className="z-10 w-full text-white bg-custom-neutral-900">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-x-8 gap-y-6 md:gap-y-8">
          <Fade
            as="h1"
            className="col-span-12 md:col-span-8 lg:mr-14"
            slide
            duration={100}
          >
            Xin chào!
          </Fade>
          <div className="self-end col-span-12 leading-relaxed md:col-span-8 lg:mr-14 big-body-text">
            <Balancer ratio={0.5}>
              <Fade delay={150}>
                <p className="">
                  I&apos;m a versatile software professional, seamlessly
                  transitioning between the roles of a designer, developer, or
                  any other hat required to bring my creative visions to life.
                  {/* I&apos;m Tuan - a software designer and developer. */}
                  {/* Proudly having many skills that span across a spectrum of
                  disciplines helps me to solve problems in creative, organized
                  and programmatic ways. */}
                </p>
              </Fade>
              <Fade delay={200}>
                <p className="mt-4 md:mt-8">
                  My journey began when I taught myself design and code while
                  tinkering with the Yahoo Blog theme. Then, I pursued a BFA in
                  design and a BSc degree in tech. You can read more at{" "}
                  <InlineLink href="/blog/my-digital-journey" dark>
                    my digital journey
                  </InlineLink>
                  .
                </p>
              </Fade>
              <Fade delay={250}>
                <p className="mt-4 md:mt-8">
                  Recently, I had worked on Design systems and Design ops at
                  companies like Aperia, BAEMIN. I am looking for a role in a
                  product company where I can enhance my technical abilities and
                  product mindset.
                </p>
              </Fade>
            </Balancer>
          </div>

          <div className="self-end col-span-12 md:col-span-4 md:row-start-1 md:col-start-9 md:row-span-2">
            <Fade duration={200} delay={400} slide>
              <div
                onMouseOver={() => setImage(1)}
                onMouseLeave={() => setImage(0)}
              >
                <PhotoFrame
                  name={images[image]}
                  closeTooltipContent="Hide my face 😢"
                  inverted
                  mainClassname="bg-gray-200"
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
        </div>
      </div>
    </header>
  );
}
