import Button from "@atoms/Button";
import Dialog from "@atoms/Dialog";
import Fade from "@atoms/Fade";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { event } from "@lib/gtag";
import socialNetworks from "@lib/socialNetworks";
import React, { useState } from "react";
import {
  PiBehanceLogoBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
} from "react-icons/pi";
import { useInView } from "react-intersection-observer";
import SpotifyPlayer from "./SpotifyPlayer";

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
  const [isOpen, setIsOpen] = useState(false);

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
              className={`col-span-12 lg:col-span-6 lg:row-span-1 lg:self-center`}
            >
              <SpotifyPlayer />
            </Fade>

            <div className="col-span-12 lg:col-span-6 lg:row-span-1 lg:justify-self-end lg:self-center">
              <Fade slide show={inView} delay={100} as="div">
                <p className="text-sm text-secondary">Let&apos;s connect </p>
                <div className="flex items-center gap-4 font-mono text-lg font-medium leading-relaxed md:text-xl lg:text-2xl md:leading-relaxed lg:leading-relaxed">
                  <Tooltip content="Say hi to me">
                    <InlineLink href="mailto:hi@auduongtuan.com" className="">
                      hi@auduongtuan.com
                    </InlineLink>
                  </Tooltip>{" "}
                  {socialNetworks.map((item, i) => (
                    <React.Fragment key={i}>
                      <Tooltip content={item.name}>
                        <InlineLink href={item.url}>
                          {icons[item.name]}
                        </InlineLink>
                      </Tooltip>
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
              <InlineLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  event({
                    action: "view_colophon",
                    category: "engagement",
                    label: "View Colophon",
                  });
                  setIsOpen((open) => !open);
                }}
              >
                Colophon.
              </InlineLink>
              <Dialog
                open={isOpen}
                onClose={() => setIsOpen((open) => !open)}
                title="Colophon"
              >
                <div className="p-4 [&>p:not(:first-child)]:mt-4 leading-relaxed">
                  <p>
                    This site is designed in{" "}
                    <InlineLink href="https://figma.com">Figma</InlineLink> and
                    built using{" "}
                    <InlineLink href="https://nextjs.org/">Next.js</InlineLink>{" "}
                    and{" "}
                    <InlineLink href="https://tailwindcss.com/">
                      TailwindCSS
                    </InlineLink>
                    . Some other libraries used are{" "}
                    <InlineLink href="https://floating-ui.com/">
                      Floating UI
                    </InlineLink>
                    ,{" "}
                    <InlineLink href="https://headlessui.com">
                      Headless UI
                    </InlineLink>
                    .
                  </p>
                  <p>
                    Content is managed in Notion and rendered into static pages
                    using{" "}
                    <InlineLink href="https://developers.notion.com/">
                      Notion API
                    </InlineLink>{" "}
                    with custom code. The music player is powered by{" "}
                    <InlineLink href="https://developer.spotify.com/documentation/web-api">
                      Spotify API
                    </InlineLink>
                    .
                  </p>

                  <p>
                    Texts are set in{" "}
                    <InlineLink href="https://rsms.me/inter/">Inter</InlineLink>{" "}
                    and{" "}
                    <InlineLink href="https://fonts.google.com/specimen/Roboto+Mono">
                      Roboto Mono
                    </InlineLink>
                    .
                  </p>
                  <div className="flex mt-6 flex-gap-x-2">
                    <Button
                      href="/blog/enhance-skills-building-personal-websites"
                      arrow
                    >
                      See site history
                    </Button>
                    <Button secondary onClick={() => setIsOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </Dialog>
            </Fade>
          </section>
        </div>
      </footer>
    </div>
  );
}
