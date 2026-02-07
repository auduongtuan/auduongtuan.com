import BinaryGridText from "@atoms/BinaryGridText";
import Button from "@atoms/Button";
import Dialog from "@atoms/Dialog";
import Fade from "@atoms/Fade";
import InlineLink from "@atoms/InlineLink";
import { TextEncrypted } from "@atoms/TextEncrypted";
import Tooltip from "@atoms/Tooltip";
import { event } from "@lib/gtag";
import socialNetworks from "@lib/socialNetworks";

import { trackEvent } from "@lib/utils";
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
      <footer className="text-primary sticky bottom-0 z-0">
        <div className="relative pt-0 pb-0" ref={ref}>
          <section className="main-container border-t-divider pt-section-vertical relative mb-8 grid grid-cols-12 gap-x-3 gap-y-8 border-t lg:grid-rows-2">
            <Fade
              slide
              show={inView}
              as={"div"}
              delay={0}
              className={`col-span-12 lg:col-span-6 lg:row-span-1 lg:self-center`}
            >
              <SpotifyPlayer />
            </Fade>

            <div className="col-span-12 lg:col-span-6 lg:row-span-1 lg:self-center lg:justify-self-end">
              <Fade slide show={inView} delay={100} as="div">
                <p className="_text-secondary _text-sm muted-text">
                  Let&apos;s connect{" "}
                </p>
                <div className="flex items-center gap-4 font-mono text-lg leading-relaxed font-medium md:text-xl md:leading-relaxed lg:text-2xl lg:leading-relaxed">
                  <Tooltip content="Say hi to me">
                    <InlineLink href="mailto:hi@auduongtuan.com" className="">
                      <TextEncrypted interval={40} text="hi@auduongtuan.com" />
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
              className={`body-text col-span-12 text-sm leading-loose lg:col-span-4 lg:row-span-1 lg:row-start-2 lg:self-start`}
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
                  trackEvent({
                    event: "view_colophon",
                    page: window.location.pathname,
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
                <div className="p-4 leading-relaxed [&>p:not(:first-child)]:mt-4">
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
                      <s>Headless UI</s>
                    </InlineLink>
                    ,{" "}
                    <InlineLink href="https://base-ui.com">Base UI</InlineLink>.
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
                    <InlineLink href="https://abcdinamo.com/typefaces/oracle">
                      Oracle
                    </InlineLink>{" "}
                    and{" "}
                    <InlineLink href="https://fonts.google.com/specimen/JetBrains+Mono">
                      JetBrains Mono
                    </InlineLink>
                    .
                  </p>
                  <div className="mt-6 flex gap-x-2">
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
            {/* Binary grid text at the bottom - full width to edges */}
          </section>
          <div className="">
            <BinaryGridText text="AUDUONGTUAN" inView={inView} />
          </div>
        </div>
      </footer>
    </div>
  );
}
