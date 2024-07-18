import React from "react";
import socialNetworks from "@lib/socialNetworks";
import { useInView } from "react-intersection-observer";
import Fade from "@atoms/Fade";
import InlineLink from "@atoms/InlineLink";
import SpotifyPlayer from "./SpotifyPlayer";
import {
  PiBehanceLogoBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
} from "react-icons/pi";

export default function Footer() {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.5,
    initialInView: false,
    triggerOnce: true,
    // rootMargin: '-10px'
  });
  const icons = {
    Github: <PiGithubLogoBold />,
    Behance: <PiBehanceLogoBold />,
    Linkedin: <PiLinkedinLogoBold />,
  };
  return (
    <div id="contact" className="relative">
      <footer className="sticky bottom-0 z-0 text-primary">
        <div className="pt-0 pb-12 main-container md:pb-16 lg:pb-24" ref={ref}>
          <section className="grid grid-cols-12 pt-12 border-t lg:grid-rows-2 gap-x-3 gap-y-8 border-t-divider ">
            <Fade
              slide
              show={inView}
              as={"div"}
              delay={0}
              className={`col-span-12 lg:col-span-5 lg:row-span-1 lg:self-center`}
            >
              <SpotifyPlayer />
            </Fade>

            <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:row-span-1 lg:justify-self-end lg:self-center">
              <Fade slide show={inView} delay={100} as="p">
                <p className="text-sm text-secondary">Let&apos;s connect </p>
                <div className="flex items-center gap-4 text-lg font-medium leading-relaxed font-display md:text-xl lg:text-2xl md:leading-relaxed lg:leading-relaxed">
                  <InlineLink href="mailto:hi@auduongtuan.com" className="">
                    hi@auduongtuan.com
                  </InlineLink>{" "}
                  {socialNetworks.map((item, i) => (
                    <React.Fragment key={i}>
                      <InlineLink href={item.url}>
                        {icons[item.name]}
                      </InlineLink>
                    </React.Fragment>
                  ))}
                </div>
              </Fade>
            </div>

            <Fade
              slide
              as="div"
              delay={100}
              show={inView}
              className={`text-sm leading-loose col-span-12 lg:col-span-4 lg:row-start-2 lg:row-span-1 lg:self-start`}
            >
              Written, designed and built by Tuan.
              <br />© {new Date().getFullYear()}.{` `}
              <InlineLink href="/blog/enhance-skills-building-personal-websites">
                Colophon.
              </InlineLink>
            </Fade>
          </section>
        </div>
      </footer>
    </div>
  );
}
