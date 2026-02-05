import Button from "@atoms/Button";
import Dialog from "@atoms/Dialog";
import Fade from "@atoms/Fade";
import InlineLink from "@atoms/InlineLink";
import Tooltip from "@atoms/Tooltip";
import { event } from "@lib/gtag";
import socialNetworks from "@lib/socialNetworks";
import { TextEncrypted } from "@atoms/TextEncrypted";

import React, { useState, useEffect, useRef } from "react";
import {
  PiBehanceLogoBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
} from "react-icons/pi";
import { useInView } from "react-intersection-observer";
import SpotifyPlayer from "./SpotifyPlayer";
import { trackEvent } from "@lib/utils";

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

  // FitText logic for background text
  const textRef = useRef<HTMLParagraphElement>(null);
  const svgTextRef = useRef<SVGTextElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(100);
  const [containerWidth, setContainerWidth] = useState(0);

  // Create multiple independent binary pattern pieces
  const patternPiecesRef = useRef<{ value: string; nextFlipTime: number }[]>(
    [],
  );
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const calculateFontSize = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;

      // Create a temporary element to measure text width
      const temp = document.createElement("span");
      temp.style.fontSize = "1000px";
      temp.style.fontWeight = "bold";
      temp.style.position = "absolute";
      temp.style.visibility = "hidden";
      temp.style.whiteSpace = "nowrap";
      temp.textContent = "AUDUONGTUAN";
      document.body.appendChild(temp);

      const textWidth = temp.offsetWidth;
      const ratio = containerWidth / textWidth;
      const newFontSize = 1000 * ratio;

      document.body.removeChild(temp);
      setFontSize(newFontSize);
      setContainerWidth(containerWidth);
    };

    calculateFontSize();

    window.addEventListener("resize", calculateFontSize);
    return () => window.removeEventListener("resize", calculateFontSize);
  }, []);

  // Initialize pattern pieces - create grid of independent flipping bits
  useEffect(() => {
    if (fontSize === 100 || containerWidth === 0) return;

    const textHeight = fontSize * 1.2;

    // Calculate grid dimensions based on character size (8px width, 16px height)
    const charsPerRow = Math.ceil(containerWidth / 8);
    const rows = Math.ceil(textHeight / 16);
    const piecesCount = charsPerRow * rows;

    console.log("Creating pattern:", {
      containerWidth,
      fontSize,
      charsPerRow,
      rows,
      piecesCount,
    });

    const patterns = ["0", "1"];

    patternPiecesRef.current = Array(piecesCount)
      .fill(null)
      .map(() => ({
        value: patterns[Math.floor(Math.random() * patterns.length)],
        nextFlipTime: Date.now() + Math.random() * 3000, // Random initial delay
      }));

    forceUpdate({});
  }, [fontSize, containerWidth]);

  // Bit flipping animation - each piece flips independently
  useEffect(() => {
    const animationFrame = () => {
      const now = Date.now();
      let hasChanges = false;

      patternPiecesRef.current = patternPiecesRef.current.map((piece) => {
        if (now >= piece.nextFlipTime) {
          hasChanges = true;
          return {
            value: piece.value === "0" ? "1" : "0",
            nextFlipTime: now + 1000 + Math.random() * 2000, // 1-3 seconds
          };
        }
        return piece;
      });

      if (hasChanges) {
        forceUpdate({});
      }

      requestAnimationFrame(animationFrame);
    };

    const rafId = requestAnimationFrame(animationFrame);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div id="contact" className="relative">
      <footer className="text-primary sticky bottom-0 z-0">
        <div
          className="main-container relative pt-0 pb-12 md:pb-16 lg:pb-24"
          ref={ref}
        >
          {/* Background text with binary pattern mask - SVG */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              ref={containerRef}
              className="max-w-main relative mx-auto h-full"
            >
              <svg
                className="animate-binary-glitch absolute"
                style={{
                  left: 0,
                  right: 0,
                  bottom: "-12px",
                  width: "100%",
                  height: fontSize * 1.2,
                }}
                aria-hidden="true"
              >
                <defs>
                  {/* Gradient for opacity transition across whole text */}
                  <linearGradient
                    id="opacityGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="100%" stopColor="white" stopOpacity="1" />
                  </linearGradient>

                  {/* Text mask with gradient */}
                  <mask id="textMask">
                    <text
                      ref={svgTextRef}
                      x="0"
                      y={fontSize}
                      fill="url(#opacityGradient)"
                      fontFamily="inherit"
                      fontWeight="bold"
                      fontSize={fontSize}
                      style={{ whiteSpace: "nowrap" }}
                    >
                      AUDUONGTUAN
                    </text>
                  </mask>
                </defs>

                {/* Binary pattern layer - render individual flipping bits */}
                <g mask="url(#textMask)">
                  {containerWidth > 0 &&
                    patternPiecesRef.current.map((piece, index) => {
                      const charsPerRow = Math.ceil(containerWidth / 8);
                      const x = (index % charsPerRow) * 8;
                      const y = Math.floor(index / charsPerRow) * 16 + 12;

                      return (
                        <text
                          key={index}
                          x={x}
                          y={y}
                          fill="#555"
                          fontFamily="monospace"
                          fontSize="12"
                          letterSpacing="-1"
                          style={{
                            transition: "opacity 0.2s ease-out",
                            opacity: 1,
                          }}
                        >
                          {piece.value}
                        </text>
                      );
                    })}
                </g>
              </svg>
            </div>
          </div>

          <section className="border-t-divider relative z-10 grid grid-cols-12 gap-x-3 gap-y-8 border-t pt-12 pb-8 lg:grid-rows-2">
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
          </section>
        </div>
      </footer>
    </div>
  );
}
