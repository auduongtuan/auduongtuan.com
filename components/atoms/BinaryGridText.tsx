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
  const [displacementGrid, setDisplacementGrid] = useState<
    { x: number; y: number }[][]
  >([]); // Track tile displacement
  const baseGridRef = useRef<string[][]>([]);
  const [gridConfig, setGridConfig] = useState({
    cols: 0,
    rows: 0,
    tileSize: 0,
  });
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(
    null,
  );

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

      // STEP 1: Canvas with vertical safe space for letters
      const canvasWidth = cols * tileSize; // Perfect grid alignment
      // Add 20% extra height as safe space to prevent letter cropping
      const canvasSafeHeight = Math.floor(rows * tileSize * 1.2);
      const canvasHeight = canvasSafeHeight;

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
      ctx.textBaseline = "middle"; // Use middle baseline to center text vertically

      // Calculate letter spacing to fill the target width exactly
      textWidth = ctx.measureText(text).width;
      const letterSpacing =
        text.length > 1 ? (targetWidth - textWidth) / (text.length - 1) : 0;

      // Draw each letter with fill only to preserve cutouts
      // Center text both horizontally and vertically
      let x = (canvasWidth - targetWidth) / 2;
      const y = canvasHeight / 2; // Center vertically

      for (let i = 0; i < text.length; i++) {
        const char = text[i];

        // Only fill, no stroke (preserves letter holes)
        ctx.fillText(char, x, y);

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

          // Bounds check for pixel array access
          if (pixelIndex + 3 >= pixels.length) {
            rowData.push(" ");
            continue;
          }

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
      // Note: Canvas already has 20% extra height for safe space, so natural padding exists
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

      // Keep all rows from first to last non-empty (includes natural padding from canvas safe space)
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

      // Initialize displacement grid - no displacement initially
      const initialDisplacementGrid = trimmedGrid.map((row) =>
        row.map(() => ({ x: 0, y: 0 })),
      );
      setDisplacementGrid(initialDisplacementGrid);
    };

    calculateGrid();

    // Debounce resize to prevent excessive recalculations
    let resizeTimeout: NodeJS.Timeout;
    const debouncedCalculateGrid = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateGrid, 150);
    };

    window.addEventListener("resize", debouncedCalculateGrid);
    return () => {
      window.removeEventListener("resize", debouncedCalculateGrid);
      clearTimeout(resizeTimeout);
    };
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

        // Single tile character glitches
        const flipsCount = Math.floor(Math.random() * 11) + 15; // 15-25 single tiles

        // Random character pool: more empty spaces, less 0/1
        const getRandomChar = () => {
          const rand = Math.random();
          if (rand < 0.32) return "0"; // 32% chance
          if (rand < 0.64) return "1"; // 32% chance
          if (rand < 0.82) return " "; // 18% chance
          if (rand < 0.88) return "#"; // 6% chance
          if (rand < 0.93) return "*"; // 5% chance
          if (rand < 0.96) return "."; // 3% chance
          if (rand < 0.98) return "-"; // 2% chance
          if (rand < 0.99) return "+"; // 1% chance
          return "x"; // 1% chance
        };

        // Single tile character flips
        for (let i = 0; i < flipsCount; i++) {
          const rowIndex = Math.floor(Math.random() * newGrid.length);
          if (!newGrid[rowIndex]) continue;

          const colIndex = Math.floor(Math.random() * newGrid[rowIndex].length);
          if (newGrid[rowIndex][colIndex] === undefined) continue;

          const baseChar = baseGridRef.current[rowIndex]?.[colIndex];

          if (baseChar === "0" || baseChar === "1") {
            newGrid[rowIndex][colIndex] = getRandomChar();
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

        // Single tile color glitches: 5-10 tiles
        const colorGlitchCount = Math.floor(Math.random() * 6) + 5;

        for (let i = 0; i < colorGlitchCount; i++) {
          const rowIndex = Math.floor(Math.random() * newColors.length);
          if (!newColors[rowIndex]) continue;

          const colIndex = Math.floor(
            Math.random() * newColors[rowIndex].length,
          );
          if (newColors[rowIndex][colIndex] === undefined) continue;

          const baseChar = baseGridRef.current[rowIndex]?.[colIndex];

          if (baseChar === "0" || baseChar === "1") {
            // 90% chance to stay black, 10% chance to get colorful
            if (Math.random() < 0.1) {
              newColors[rowIndex][colIndex] =
                glitchColors[Math.floor(Math.random() * glitchColors.length)];
            } else {
              newColors[rowIndex][colIndex] = "#000";
            }
          }
        }

        // Bigger block color glitches: occasionally 0-1 blocks of 3-4 tiles
        const blockGlitchCount = Math.random() > 0.7 ? 1 : 0; // 30% chance of 1 block

        for (let i = 0; i < blockGlitchCount; i++) {
          const centerRow = Math.floor(Math.random() * newColors.length);
          const centerCol = Math.floor(
            Math.random() * (newColors[centerRow]?.length || 0),
          );

          const blockSize = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3 tile block
          const color =
            glitchColors[Math.floor(Math.random() * glitchColors.length)]; // Same color for the whole block

          // Apply to surrounding tiles in a block
          for (
            let dr = -Math.floor(blockSize / 2);
            dr <= Math.floor(blockSize / 2);
            dr++
          ) {
            for (
              let dc = -Math.floor(blockSize / 2);
              dc <= Math.floor(blockSize / 2);
              dc++
            ) {
              const r = centerRow + dr;
              const c = centerCol + dc;

              if (newColors[r] && newColors[r][c] !== undefined) {
                const baseChar = baseGridRef.current[r]?.[c];
                if (baseChar === "0" || baseChar === "1") {
                  newColors[r][c] = color;
                }
              }
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

  // Mouse displacement effect
  useEffect(() => {
    if (!containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setMousePos(null);
      // Reset all displacements
      setDisplacementGrid((grid) =>
        grid.map((row) => row.map(() => ({ x: 0, y: 0 }))),
      );
    };

    const container = containerRef.current;
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Calculate displacement based on mouse position with cascading push
  useEffect(() => {
    if (!mousePos || displacementGrid.length === 0) return;

    const rows = displacementGrid.length;
    const cols = displacementGrid[0]?.length || 0;

    // Initialize displacement grid with direct mouse influence
    const initialDisplacement: { x: number; y: number }[][] =
      displacementGrid.map((row, rowIndex) =>
        row.map((_, colIndex) => {
          const baseChar = baseGridRef.current[rowIndex]?.[colIndex];
          if (baseChar !== "0" && baseChar !== "1") {
            return { x: 0, y: 0 };
          }

          // Calculate tile center position
          const tileCenterX =
            colIndex * gridConfig.tileSize + gridConfig.tileSize / 2;
          const tileCenterY =
            rowIndex * gridConfig.tileSize + gridConfig.tileSize / 2;

          // Calculate distance from mouse
          const dx = tileCenterX - mousePos.x;
          const dy = tileCenterY - mousePos.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Influence radius in pixels
          const influenceRadius = gridConfig.tileSize * 8;

          if (distance < influenceRadius && distance > 0) {
            // Calculate displacement strength (stronger when closer)
            const strength =
              (1 - distance / influenceRadius) * gridConfig.tileSize * 2;

            // Push tiles away from cursor
            const angle = Math.atan2(dy, dx);
            const rawX = Math.cos(angle) * strength;
            const rawY = Math.sin(angle) * strength;

            // Snap to tile grid multiples
            return {
              x: Math.round(rawX / gridConfig.tileSize) * gridConfig.tileSize,
              y: Math.round(rawY / gridConfig.tileSize) * gridConfig.tileSize,
            };
          }

          return { x: 0, y: 0 };
        }),
      );

    // Apply cascading push effect (up to 4 iterations)
    const finalDisplacement = JSON.parse(JSON.stringify(initialDisplacement));

    for (let iteration = 0; iteration < 4; iteration++) {
      const pushedThisIteration = new Set<string>();

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const displacement = finalDisplacement[row][col];

          // Skip if no displacement
          if (displacement.x === 0 && displacement.y === 0) continue;

          // Calculate new position
          const newRow = row + Math.round(displacement.y / gridConfig.tileSize);
          const newCol = col + Math.round(displacement.x / gridConfig.tileSize);

          // Check if new position is valid and occupied by another tile
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const targetTile = baseGridRef.current[newRow]?.[newCol];
            const targetKey = `${newRow},${newCol}`;

            // If target tile exists and hasn't been pushed yet this iteration
            if (
              (targetTile === "0" || targetTile === "1") &&
              !pushedThisIteration.has(targetKey)
            ) {
              // Push the target tile in the same direction with reduced strength
              const currentTargetDisplacement =
                finalDisplacement[newRow][newCol];
              if (
                currentTargetDisplacement.x === 0 &&
                currentTargetDisplacement.y === 0
              ) {
                finalDisplacement[newRow][newCol] = {
                  x: displacement.x,
                  y: displacement.y,
                };
                pushedThisIteration.add(targetKey);
              }
            }
          }
        }
      }

      // Stop if no tiles were pushed this iteration
      if (pushedThisIteration.size === 0) break;
    }

    setDisplacementGrid(finalDisplacement);
  }, [mousePos, gridConfig.tileSize]);

  return (
    <div
      ref={containerRef}
      className="pointer-events-auto relative w-full overflow-hidden font-mono tracking-tighter whitespace-pre"
      style={{
        fontSize: `${gridConfig.tileSize}px`,
        lineHeight: `${gridConfig.tileSize}px`,
        letterSpacing: 0,
        cursor: "default",
      }}
    >
      {binaryGrid.map((row, rowIndex) => {
        // Two-stage opacity gradient for less dramatic transition:
        // First half (0-50%): 0.2 → 0.8 (faster transition)
        // Second half (50-100%): 0.8 → 1.0 (slower, subtle refinement)
        let opacity = 0.2;
        if (binaryGrid.length > 0) {
          const progress = rowIndex / binaryGrid.length; // 0 to 1
          if (progress <= 0.5) {
            // First half: 0.2 to 0.8 (60% range over 50% of rows)
            opacity = 0.2 + (progress / 0.5) * 0.6;
          } else {
            // Second half: 0.8 to 1.0 (20% range over 50% of rows)
            opacity = 0.8 + ((progress - 0.5) / 0.5) * 0.2;
          }
        }
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
              const displacement = displacementGrid[rowIndex]?.[colIndex] || {
                x: 0,
                y: 0,
              };

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
                    transform: `translate(${displacement.x}px, ${displacement.y}px)`,
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
