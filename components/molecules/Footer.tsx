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

  // ASCII art state
  const containerRef = useRef<HTMLDivElement>(null);
  const textMaskRef = useRef<HTMLCanvasElement>(null);
  const [binaryGrid, setBinaryGrid] = useState<string[][]>([]);
  const baseGridRef = useRef<string[][]>([]); // Store original grid for glitch effect
  const [gridConfig, setGridConfig] = useState({
    cols: 0,
    rows: 0,
    tileSize: 0,
  });

  // Generate binary pattern grid (0, 1) masked by "AUDUONGTUAN" text
  useEffect(() => {
    const calculateGrid = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = 200; // Fixed height for the background text area

      // DEBUG: Log container dimensions
      console.log("=== FOOTER BINARY GRID DEBUG ===");
      console.log("Container element:", containerRef.current);
      console.log("Container width:", containerWidth);
      console.log("Container clientWidth:", containerRef.current.clientWidth);
      console.log("Container scrollWidth:", containerRef.current.scrollWidth);
      console.log("Container className:", containerRef.current.className);

      // Define tile size based on breakpoint (smaller tiles = more pieces)
      let tileSize = 8;
      if (containerWidth >= 1024) {
        tileSize = 6; // Smaller tiles on desktop = more pieces
      } else if (containerWidth >= 768) {
        tileSize = 7; // Medium tiles on tablet
      }

      const cols = Math.floor(containerWidth / tileSize);
      const rows = Math.floor(containerHeight / tileSize);

      console.log("Tile size:", tileSize);
      console.log("Grid cols:", cols);
      console.log("Grid rows:", rows);

      setGridConfig({ cols, rows, tileSize });

      // STEP 1: Fix canvas dimensions to exactly match grid
      const canvasWidth = cols * tileSize; // Perfect grid alignment
      const canvasHeight = rows * tileSize;

      console.log("Canvas width:", canvasWidth);
      console.log("Canvas height:", canvasHeight);

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // STEP 2: Make letter strokes wider with spacing
      const text = "AUDUONGTUAN";
      let fontSize = 100;
      ctx.font = `bold ${fontSize}px sans-serif`;
      let textWidth = ctx.measureText(text).width;

      // Use 98% of canvas width for better coverage
      const targetWidth = canvasWidth * 0.98;

      console.log("Target width (98%):", targetWidth);
      console.log("Initial text width:", textWidth);

      // Scale font to fit target width
      // We'll add letter spacing after, so scale to ~85% to leave room for spacing
      fontSize = (targetWidth / textWidth) * fontSize * 0.85;
      ctx.font = `bold ${fontSize}px sans-serif`;

      console.log("Final font size:", fontSize);

      // Configure stroke for thicker letters
      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";
      ctx.lineWidth = tileSize * 1.5; // Stroke width = 1.5 tiles thick
      ctx.textBaseline = "bottom";

      console.log("Stroke width:", ctx.lineWidth);

      // Calculate letter spacing to fill the target width exactly
      textWidth = ctx.measureText(text).width;
      const letterSpacing = (targetWidth - textWidth) / (text.length - 1);

      console.log("Final text width:", textWidth);
      console.log("Letter spacing:", letterSpacing);
      console.log(
        "Total width (text + spacing):",
        textWidth + letterSpacing * (text.length - 1),
      );
      console.log("================================");

      // Draw each letter with stroke + fill for thickness
      let x = (canvasWidth - targetWidth) / 2; // Center text
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Draw stroke first (makes letters thicker)
        ctx.strokeText(char, x, canvasHeight);
        // Then fill
        ctx.fillText(char, x, canvasHeight);

        x += ctx.measureText(char).width + letterSpacing;
      }

      // Get pixel data to create mask
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const pixels = imageData.data;

      // Generate grid based on text mask
      const grid: string[][] = [];

      for (let row = 0; row < rows; row++) {
        const rowData: string[] = [];
        for (let col = 0; col < cols; col++) {
          // STEP 3: Sample from center of each tile for accuracy
          const x = Math.floor(col * tileSize + tileSize / 2);
          const y = Math.floor(row * tileSize + tileSize / 2);
          const pixelIndex = (y * canvasWidth + x) * 4;
          const alpha = pixels[pixelIndex + 3]; // Alpha channel

          // If pixel is visible (part of text), add 0 or 1, otherwise empty
          if (alpha > 128) {
            rowData.push(Math.random() > 0.5 ? "0" : "1");
          } else {
            rowData.push(" ");
          }
        }
        grid.push(rowData);
      }

      // Trim empty rows from top and bottom
      const isRowEmpty = (row: string[]) => row.every((char) => char === " ");

      let firstNonEmptyRow = 0;
      let lastNonEmptyRow = grid.length - 1;

      // Find first non-empty row
      for (let i = 0; i < grid.length; i++) {
        if (!isRowEmpty(grid[i])) {
          firstNonEmptyRow = i;
          break;
        }
      }

      // Find last non-empty row
      for (let i = grid.length - 1; i >= 0; i--) {
        if (!isRowEmpty(grid[i])) {
          lastNonEmptyRow = i;
          break;
        }
      }

      // Slice to keep only rows with text
      const trimmedGrid = grid.slice(firstNonEmptyRow, lastNonEmptyRow + 1);

      // Store base grid for glitch effect
      baseGridRef.current = trimmedGrid.map((row) => [...row]);
      setBinaryGrid(trimmedGrid);

      // DEBUG: Check rendered grid dimensions
      console.log("Grid generated - first row length:", grid[0]?.length);
      console.log(
        "First row sample (first 20 chars):",
        grid[0]?.slice(0, 20).join(""),
      );
    };

    calculateGrid();

    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, []);

  // Glitch effect: randomly flip 0s and 1s continuously
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (baseGridRef.current.length === 0) return;

      setBinaryGrid((currentGrid) => {
        if (currentGrid.length === 0) return currentGrid;

        const newGrid = currentGrid.map((row) => [...row]);

        // Randomly flip 8-15 characters per interval for more visible effect
        const flipsCount = Math.floor(Math.random() * 8) + 8;

        for (let i = 0; i < flipsCount; i++) {
          const rowIndex = Math.floor(Math.random() * newGrid.length);
          const colIndex = Math.floor(Math.random() * newGrid[rowIndex].length);

          const char = newGrid[rowIndex][colIndex];

          // Only flip 0s and 1s, not empty spaces
          if (char === "0" || char === "1") {
            newGrid[rowIndex][colIndex] = char === "0" ? "1" : "0";
          }
        }

        return newGrid;
      });
    }, 80); // Flip every 80ms for faster animation

    return () => clearInterval(glitchInterval);
  }, []); // Run once and continuously

  // Gradient colors from top to bottom - stronger opacity
  const getLineColor = (index: number, total: number) => {
    // Transition from 0.1 (top) to 0.8 (bottom) opacity
    const opacity = 0.1 + (index / total) * 0.7; // 0.1 + (0 to 0.7) = 0.1 to 0.8

    // Extract RGB values from CSS variable and apply opacity
    const color = `color-mix(in srgb, var(--base-fg) ${opacity * 100}%, transparent)`;

    // Debug: log a few samples
    if (index === 0 || index === Math.floor(total / 2) || index === total - 1) {
      console.log(
        `Row ${index}/${total}: opacity=${opacity.toFixed(2)}, color="${color}"`,
      );
    }

    return color;
  };

  return (
    <div id="contact" className="relative">
      <footer className="text-primary sticky bottom-0 z-0">
        <div
          className="main-container relative pt-0 pb-12 md:pb-16 lg:pb-24"
          ref={ref}
        >
          {/* Background binary grid text */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              ref={containerRef}
              className="max-w-main relative mx-auto h-full"
            >
              <div
                className="absolute right-0 left-0 font-mono tracking-tighter whitespace-pre"
                style={{
                  bottom: "-12px",
                  fontSize: `${gridConfig.tileSize}px`,
                  lineHeight: `${gridConfig.tileSize}px`,
                  letterSpacing: 0,
                  width: `${gridConfig.cols * gridConfig.tileSize}px`, // Force exact width
                  transform: "scaleX(1)", // Ensure no scaling
                }}
              >
                {binaryGrid.map((row, rowIndex) => {
                  const opacity = 0.1 + (rowIndex / binaryGrid.length) * 0.7;
                  return (
                    <div
                      key={rowIndex}
                      style={{
                        color: "#000",
                        opacity: opacity,
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      {row.map((char, colIndex) => (
                        <span
                          key={colIndex}
                          style={{
                            width: `${gridConfig.tileSize}px`,
                            display: "inline-block",
                            textAlign: "center",
                            flexShrink: 0,
                          }}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  );
                })}
              </div>
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
