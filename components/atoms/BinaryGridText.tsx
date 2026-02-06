import React, { useEffect, useRef, useState } from "react";

interface BinaryGridTextProps {
  text: string;
  inView: boolean;
}

export default function BinaryGridText({ text, inView }: BinaryGridTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [binaryGrid, setBinaryGrid] = useState<string[][]>([]);
  const [colorGrid, setColorGrid] = useState<string[][]>([]);
  const [visibilityGrid, setVisibilityGrid] = useState<boolean[][]>([]);
  const baseGridRef = useRef<string[][]>([]);
  const [gridConfig, setGridConfig] = useState({
    cols: 0,
    rows: 0,
    tileSize: 0,
  });

  // Generate binary pattern grid (0, 1) masked by text
  useEffect(() => {
    const calculateGrid = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = 200; // Fixed height for the background text area

      // DEBUG: Log container dimensions

      // Define tile size based on breakpoint (smaller tiles = more pieces)
      let tileSize = 10;
      if (containerWidth >= 1024) {
        tileSize = 8; // Smaller tiles on desktop = more pieces
      } else if (containerWidth >= 768) {
        tileSize = 9; // Medium tiles on tablet
      }

      const cols = Math.floor(containerWidth / tileSize);
      const rows = Math.floor(containerHeight / tileSize);

      setGridConfig({ cols, rows, tileSize });

      // STEP 1: Fix canvas dimensions to exactly match grid
      const canvasWidth = cols * tileSize; // Perfect grid alignment
      const canvasHeight = rows * tileSize;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      // STEP 2: Make letter strokes wider with spacing
      let fontSize = 100;
      // Use JetBrains Mono 800 weight for thick monospace letters with clear cutouts
      ctx.font = `800 ${fontSize}px "JetBrains Mono", monospace`;
      let textWidth = ctx.measureText(text).width;

      // Use 98% of canvas width for better coverage
      const targetWidth = canvasWidth * 0.98;

      // Scale font to fit target width
      // We'll add letter spacing after, so scale to ~85% to leave room for spacing
      fontSize = (targetWidth / textWidth) * fontSize * 0.85;
      ctx.font = `800 ${fontSize}px "JetBrains Mono", monospace`;

      // Configure fill only (no stroke to preserve letter holes like in "A")
      ctx.fillStyle = "white";
      ctx.textBaseline = "bottom";

      // Calculate letter spacing to fill the target width exactly
      textWidth = ctx.measureText(text).width;
      const letterSpacing = (targetWidth - textWidth) / (text.length - 1);

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
    };

    calculateGrid();

    window.addEventListener("resize", calculateGrid);
    return () => window.removeEventListener("resize", calculateGrid);
  }, [text]);

  // Reveal animation: each tile appears randomly
  useEffect(() => {
    if (!inView || visibilityGrid.length === 0) return;

    let revealInterval: NodeJS.Timeout;

    // Add 200ms delay before starting
    const delayTimeout = setTimeout(() => {
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

      revealInterval = setInterval(() => {
        // Reveal 8-15 tiles per frame
        const tilesPerFrame = Math.floor(Math.random() * 8) + 8;

        setVisibilityGrid((grid) => {
          const newGrid = grid.map((row) => [...row]);

          for (
            let i = 0;
            i < tilesPerFrame && currentIndex < shuffledTiles.length;
            i++
          ) {
            const tile = shuffledTiles[currentIndex];
            // Bounds checking: skip if grid was resized
            if (
              newGrid[tile.row] &&
              newGrid[tile.row][tile.col] !== undefined
            ) {
              newGrid[tile.row][tile.col] = true;
            }
            currentIndex++;
          }

          return newGrid;
        });

        // Stop when all tiles are revealed
        if (currentIndex >= shuffledTiles.length) {
          clearInterval(revealInterval);
        }
      }, 30); // Slower: 30ms interval instead of 20ms
    }, 200); // 200ms delay

    return () => {
      clearTimeout(delayTimeout);
      if (revealInterval) clearInterval(revealInterval);
    };
  }, [inView, visibilityGrid.length]);

  // Glitch effect: randomly flip 0s and 1s continuously
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (baseGridRef.current.length === 0) {
        return;
      }

      // Update both character and color grids
      setBinaryGrid((currentGrid) => {
        if (currentGrid.length === 0) {
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
          if (!newGrid[rowIndex]) continue; // Skip if row doesn't exist

          const colIndex = Math.floor(Math.random() * newGrid[rowIndex].length);
          if (!newGrid[rowIndex][colIndex] === undefined) continue; // Skip if column doesn't exist

          const baseChar = baseGridRef.current[rowIndex]?.[colIndex];

          // Glitch any non-empty character in the text area
          if (baseChar === "0" || baseChar === "1") {
            newGrid[rowIndex][colIndex] = getRandomChar();
            actualFlips++;
          }
        }

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
          if (!newColors[rowIndex]) continue; // Skip if row doesn't exist

          const colIndex = Math.floor(
            Math.random() * newColors[rowIndex].length,
          );
          if (newColors[rowIndex][colIndex] === undefined) continue; // Skip if column doesn't exist

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
      clearInterval(glitchInterval);
    };
  }, []); // Run once and continuously

  return (
    <div
      ref={containerRef}
      className="pointer-events-none relative w-full overflow-hidden font-mono tracking-tighter whitespace-pre"
      style={{
        fontSize: `${gridConfig.tileSize}px`,
        lineHeight: `${gridConfig.tileSize}px`,
        letterSpacing: 0,
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
              const isVisible = visibilityGrid[rowIndex]?.[colIndex] ?? false;
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
  );
}
