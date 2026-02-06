import Button from "@atoms/Button";
import Dialog from "@atoms/Dialog";
import Fade from "@atoms/Fade";
import InlineLink from "@atoms/InlineLink";
import { TextEncrypted } from "@atoms/TextEncrypted";
import Tooltip from "@atoms/Tooltip";
import { event } from "@lib/gtag";
import socialNetworks from "@lib/socialNetworks";

import { trackEvent } from "@lib/utils";
import React, { useEffect, useRef, useState } from "react";
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

  // ASCII art state
  const containerRef = useRef<HTMLDivElement>(null);
  const textMaskRef = useRef<HTMLCanvasElement>(null);
  const [binaryGrid, setBinaryGrid] = useState<string[][]>([]);
  const [colorGrid, setColorGrid] = useState<string[][]>([]); // Store colors for each tile
  const [visibilityGrid, setVisibilityGrid] = useState<boolean[][]>([]); // Track which tiles are visible
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
      let tileSize = 10;
      if (containerWidth >= 1024) {
        tileSize = 8; // Smaller tiles on desktop = more pieces
      } else if (containerWidth >= 768) {
        tileSize = 9; // Medium tiles on tablet
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
      // Use JetBrains Mono 800 weight for thick monospace letters with clear cutouts
      ctx.font = `900 ${fontSize}px "ABCOracle", sans-serif`;
      let textWidth = ctx.measureText(text).width;

      // Use 98% of canvas width for better coverage
      const targetWidth = canvasWidth * 0.98;

      console.log("Target width (98%):", targetWidth);
      console.log("Initial text width:", textWidth);

      // Scale font to fit target width
      // We'll add letter spacing after, so scale to ~85% to leave room for spacing
      fontSize = (targetWidth / textWidth) * fontSize * 0.85;
      ctx.font = `900 ${fontSize}px "ABCOracle", sans-serif`;

      console.log("Final font size:", fontSize);

      // Configure fill only (no stroke to preserve letter holes like in "A")
      ctx.fillStyle = "white";
      ctx.textBaseline = "bottom";

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

      // Draw each letter with fill only to preserve cutouts
      let x = (canvasWidth - targetWidth) / 2; // Center text
      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Only fill, no stroke (preserves letter holes)
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

      // Initialize color grid - all black (#000) initially
      const initialColorGrid = trimmedGrid.map((row) => row.map(() => "#000"));
      setColorGrid(initialColorGrid);

      // Initialize visibility grid - all hidden initially
      const initialVisibilityGrid = trimmedGrid.map((row) =>
        row.map(() => false),
      );
      setVisibilityGrid(initialVisibilityGrid);

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

  // Reveal animation: each tile appears randomly
  useEffect(() => {
    if (!inView || visibilityGrid.length === 0) return;

    console.log("🌊 Starting reveal animation");

    const rows = visibilityGrid.length;
    const cols = visibilityGrid[0]?.length || 0;

    // Collect all tiles that have text
    const allTiles: { row: number; col: number }[] = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseChar = baseGridRef.current[row]?.[col];
        // Only reveal tiles that have text
        if (baseChar === "0" || baseChar === "1") {
          allTiles.push({ row, col });
        }
      }
    }

    // Shuffle tiles completely randomly
    const shuffledTiles = [...allTiles].sort(() => Math.random() - 0.5);

    // Reveal tiles randomly over time
    let currentIndex = 0;

    const revealInterval = setInterval(() => {
      // Reveal 15-20 random tiles per frame
      const tilesPerFrame = Math.floor(Math.random() * 6) + 15;

      setVisibilityGrid((grid) => {
        const newGrid = grid.map((row) => [...row]);

        for (
          let i = 0;
          i < tilesPerFrame && currentIndex < shuffledTiles.length;
          i++
        ) {
          const tile = shuffledTiles[currentIndex];
          newGrid[tile.row][tile.col] = true;
          currentIndex++;
        }

        return newGrid;
      });

      // Stop when all tiles are revealed
      if (currentIndex >= shuffledTiles.length) {
        clearInterval(revealInterval);
        console.log("✅ Reveal animation complete");
      }
    }, 20); // 50fps

    return () => clearInterval(revealInterval);
  }, [inView, visibilityGrid.length]);

  // Glitch effect: randomly flip 0s and 1s continuously
  useEffect(() => {
    console.log("🎭 Glitch effect initialized");

    const glitchInterval = setInterval(() => {
      if (baseGridRef.current.length === 0) {
        console.log("⚠️ Base grid not ready yet");
        return;
      }

      // Update both character and color grids
      setBinaryGrid((currentGrid) => {
        if (currentGrid.length === 0) {
          console.log("⚠️ Current grid empty");
          return currentGrid;
        }

        const newGrid = currentGrid.map((row) => [...row]);

        // More dramatic glitch: 15-25 characters per interval
        const flipsCount = Math.floor(Math.random() * 11) + 15;
        let actualFlips = 0;

        // Random character pool: more empty spaces, less 0/1
        const getRandomChar = () => {
          const rand = Math.random();
          if (rand < 0.32) return "0"; // 32% chance (reduced from 40%)
          if (rand < 0.64) return "1"; // 32% chance (reduced from 40%)
          if (rand < 0.82) return " "; // 18% chance (increased from 8%)
          if (rand < 0.88) return "#"; // 6% chance
          if (rand < 0.93) return "*"; // 5% chance
          if (rand < 0.96) return "."; // 3% chance
          if (rand < 0.98) return "-"; // 2% chance
          if (rand < 0.99) return "+"; // 1% chance
          return "x"; // 1% chance
        };

        for (let i = 0; i < flipsCount; i++) {
          const rowIndex = Math.floor(Math.random() * newGrid.length);
          const colIndex = Math.floor(Math.random() * newGrid[rowIndex].length);

          const char = newGrid[rowIndex][colIndex];
          const baseChar = baseGridRef.current[rowIndex]?.[colIndex];

          // Glitch any non-empty character in the text area
          if (baseChar === "0" || baseChar === "1") {
            newGrid[rowIndex][colIndex] = getRandomChar();
            actualFlips++;
          }
        }

        console.log(`✨ Glitched ${actualFlips} characters`);
        return newGrid;
      });

      // Update colors - only 10-15% of tiles get colorful
      setColorGrid((currentColors) => {
        if (currentColors.length === 0) return currentColors;

        const newColors = currentColors.map((row) => [...row]);

        // Glitch colors palette
        const glitchColors = [
          "#ff0000", // red
          "#00ff00", // green
          "#0000ff", // blue
          "#ff00ff", // magenta
          "#00ffff", // cyan
          "#ffff00", // yellow
        ];

        // Color glitch: 5-10 tiles
        const colorGlitchCount = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < colorGlitchCount; i++) {
          const rowIndex = Math.floor(Math.random() * newColors.length);
          const colIndex = Math.floor(
            Math.random() * newColors[rowIndex].length,
          );
          const baseChar = baseGridRef.current[rowIndex]?.[colIndex];

          if (baseChar === "0" || baseChar === "1") {
            // 85% chance to stay black, 15% chance to get colorful
            if (Math.random() < 0.15) {
              newColors[rowIndex][colIndex] =
                glitchColors[Math.floor(Math.random() * glitchColors.length)];
            } else {
              newColors[rowIndex][colIndex] = "#000";
            }
          }
        }

        return newColors;
      });
    }, 50); // Flip every 50ms for much faster glitch effect

    return () => {
      console.log("🛑 Glitch effect cleanup");
      clearInterval(glitchInterval);
    };
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
                        display: "flex",
                        width: "100%",
                      }}
                    >
                      {row.map((char, colIndex) => {
                        const isVisible =
                          visibilityGrid[rowIndex]?.[colIndex] ?? false;
                        return (
                          <span
                            key={colIndex}
                            style={{
                              width: `${gridConfig.tileSize}px`,
                              display: "inline-block",
                              textAlign: "center",
                              flexShrink: 0,
                              color: colorGrid[rowIndex]?.[colIndex] || "#000",
                              opacity: isVisible ? opacity : 0,
                            }}
                          >
                            {char}
                          </span>
                        );
                      })}
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
