import { useCallback, useEffect, useRef, useState } from "react";

interface BinaryGridTextProps {
  text: string;
  inView: boolean;
}

// Configuration constants
const CONTAINER_HEIGHT = 200;
const CANVAS_SAFE_HEIGHT_MULTIPLIER = 1.2;
const TARGET_WIDTH_PERCENTAGE = 0.98;
const FONT_SCALE_WITH_SPACING = 0.85;
const FONT_WEIGHT = 800;
const FONT_FAMILY = "JetBrains Mono";
const PIXEL_ALPHA_THRESHOLD = 128;

const TILE_SIZE_DESKTOP = 8;
const TILE_SIZE_TABLET = 9;
const TILE_SIZE_MOBILE = 10;
const DESKTOP_BREAKPOINT = 1024;
const TABLET_BREAKPOINT = 768;

const RESIZE_DEBOUNCE_MS = 150;

const REVEAL_DELAY_MS = 200;
const REVEAL_INTERVAL_MS = 30;
const REVEAL_MIN_TILES_PER_FRAME = 8;
const REVEAL_MAX_TILES_PER_FRAME = 15;

const GLITCH_INTERVAL_MS = 50;
const CHAR_GLITCH_MIN_COUNT = 15;
const CHAR_GLITCH_MAX_COUNT = 25;
const COLOR_GLITCH_MIN_COUNT = 5;
const COLOR_GLITCH_MAX_COUNT = 10;
const COLOR_GLITCH_COLORFUL_CHANCE = 0.1;
const BLOCK_GLITCH_CHANCE = 0.3;
const BLOCK_GLITCH_MIN_SIZE = 1;
const BLOCK_GLITCH_MAX_SIZE = 3;

const DISPLACEMENT_INFLUENCE_RADIUS_TILES = 8;
const DISPLACEMENT_STRENGTH_MULTIPLIER = 2;
const DISPLACEMENT_CASCADE_ITERATIONS = 4;

const OPACITY_MIN = 0.2;
const OPACITY_MID = 0.5;
const OPACITY_MAX = 1.0;
const OPACITY_MID_POINT = 0.5;

const GLITCH_COLORS = [
  "#ff0000", // red
  "#00ff00", // green
  "#0000ff", // blue
  "#ff00ff", // magenta
  "#00ffff", // cyan
  "#ffff00", // yellow
];

// Helper: Get responsive tile size based on container width
function getTileSize(containerWidth: number): number {
  if (containerWidth >= DESKTOP_BREAKPOINT) return TILE_SIZE_DESKTOP;
  if (containerWidth >= TABLET_BREAKPOINT) return TILE_SIZE_TABLET;
  return TILE_SIZE_MOBILE;
}

// Helper: Get random character for glitch effect
function getRandomChar(): string {
  const rand = Math.random();
  if (rand < 0.32) return "0";
  if (rand < 0.64) return "1";
  if (rand < 0.82) return " ";
  if (rand < 0.88) return "#";
  if (rand < 0.93) return "*";
  if (rand < 0.96) return ".";
  if (rand < 0.98) return "-";
  if (rand < 0.99) return "+";
  return "x";
}

// Helper: Create canvas and render text
function createTextCanvas(
  text: string,
  cols: number,
  rows: number,
  tileSize: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  const canvasWidth = cols * tileSize;
  const canvasHeight = Math.floor(
    rows * tileSize * CANVAS_SAFE_HEIGHT_MULTIPLIER,
  );

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  let fontSize = 100;
  ctx.font = `${FONT_WEIGHT} ${fontSize}px "${FONT_FAMILY}", monospace`;
  let textWidth = ctx.measureText(text).width;

  const targetWidth = canvasWidth * TARGET_WIDTH_PERCENTAGE;
  fontSize = (targetWidth / textWidth) * fontSize * FONT_SCALE_WITH_SPACING;
  ctx.font = `${FONT_WEIGHT} ${fontSize}px "${FONT_FAMILY}", monospace`;

  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";

  textWidth = ctx.measureText(text).width;
  const letterSpacing =
    text.length > 1 ? (targetWidth - textWidth) / (text.length - 1) : 0;

  let x = (canvasWidth - targetWidth) / 2;
  const y = canvasHeight / 2;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    ctx.fillText(char, x, y);
    x += ctx.measureText(char).width + letterSpacing;
  }

  return { canvas, ctx };
}

// Helper: Generate binary grid from canvas pixel data
function generateBinaryGrid(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  tileSize: number,
): string[][] {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;
  const grid: string[][] = [];

  for (let row = 0; row < rows; row++) {
    const rowData: string[] = [];
    for (let col = 0; col < cols; col++) {
      const x = Math.floor(col * tileSize + tileSize / 2);
      const y = Math.floor(row * tileSize + tileSize / 2);
      const pixelIndex = (y * canvas.width + x) * 4;

      if (pixelIndex + 3 >= pixels.length) {
        rowData.push(" ");
        continue;
      }

      const alpha = pixels[pixelIndex + 3];
      rowData.push(
        alpha > PIXEL_ALPHA_THRESHOLD ? (Math.random() > 0.5 ? "0" : "1") : " ",
      );
    }
    grid.push(rowData);
  }

  return grid;
}

// Helper: Trim empty rows from grid
function trimEmptyRows(grid: string[][]): string[][] {
  const isRowEmpty = (row: string[]) => row.every((char) => char === " ");

  let firstNonEmptyRow = 0;
  let lastNonEmptyRow = grid.length - 1;

  for (let i = 0; i < grid.length; i++) {
    if (!isRowEmpty(grid[i])) {
      firstNonEmptyRow = i;
      break;
    }
  }

  for (let i = grid.length - 1; i >= 0; i--) {
    if (!isRowEmpty(grid[i])) {
      lastNonEmptyRow = i;
      break;
    }
  }

  return grid.slice(firstNonEmptyRow, lastNonEmptyRow + 1);
}

// Helper: Calculate tile opacity based on row position
function calculateTileOpacity(rowIndex: number, totalRows: number): number {
  if (totalRows === 0) return OPACITY_MIN;

  const progress = rowIndex / totalRows;
  if (progress <= OPACITY_MID_POINT) {
    return (
      OPACITY_MIN + (progress / OPACITY_MID_POINT) * (OPACITY_MID - OPACITY_MIN)
    );
  } else {
    return (
      OPACITY_MID +
      ((progress - OPACITY_MID_POINT) / OPACITY_MID_POINT) *
        (OPACITY_MAX - OPACITY_MID)
    );
  }
}

// Helper: Check if character is text tile
function isTextTile(char: string | undefined): boolean {
  return char === "0" || char === "1";
}

// Helper: Calculate displacement for a single tile
function calculateTileDisplacement(
  rowIndex: number,
  colIndex: number,
  baseChar: string | undefined,
  mousePos: { x: number; y: number },
  tileSize: number,
): { x: number; y: number } {
  if (!isTextTile(baseChar)) {
    return { x: 0, y: 0 };
  }

  const tileCenterX = colIndex * tileSize + tileSize / 2;
  const tileCenterY = rowIndex * tileSize + tileSize / 2;

  const dx = tileCenterX - mousePos.x;
  const dy = tileCenterY - mousePos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const influenceRadius = tileSize * DISPLACEMENT_INFLUENCE_RADIUS_TILES;

  if (distance < influenceRadius && distance > 0) {
    const strength =
      (1 - distance / influenceRadius) *
      tileSize *
      DISPLACEMENT_STRENGTH_MULTIPLIER;
    const angle = Math.atan2(dy, dx);
    const rawX = Math.cos(angle) * strength;
    const rawY = Math.sin(angle) * strength;

    return {
      x: Math.round(rawX / tileSize) * tileSize,
      y: Math.round(rawY / tileSize) * tileSize,
    };
  }

  return { x: 0, y: 0 };
}

// Helper: Apply cascading push effect
function applyCascadingPush(
  initialDisplacement: { x: number; y: number }[][],
  baseGrid: string[][],
  tileSize: number,
): { x: number; y: number }[][] {
  const rows = initialDisplacement.length;
  const cols = initialDisplacement[0]?.length || 0;
  const finalDisplacement = initialDisplacement.map((row) =>
    row.map((d) => ({ x: d.x, y: d.y })),
  );

  for (
    let iteration = 0;
    iteration < DISPLACEMENT_CASCADE_ITERATIONS;
    iteration++
  ) {
    const pushedThisIteration = new Set<string>();

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const displacement = finalDisplacement[row][col];

        if (displacement.x === 0 && displacement.y === 0) continue;

        const newRow = row + Math.round(displacement.y / tileSize);
        const newCol = col + Math.round(displacement.x / tileSize);

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
          const targetTile = baseGrid[newRow]?.[newCol];
          const targetKey = `${newRow},${newCol}`;

          if (isTextTile(targetTile) && !pushedThisIteration.has(targetKey)) {
            const currentTargetDisplacement = finalDisplacement[newRow][newCol];
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

    if (pushedThisIteration.size === 0) break;
  }

  return finalDisplacement;
}

export default function BinaryGridText({ text, inView }: BinaryGridTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const baseGridRef = useRef<string[][]>([]);
  const rafIdRef = useRef<number>(0);
  const revealedRef = useRef(false);

  // Only state that triggers re-render: grid structure (changes on mount + resize only)
  const [gridConfig, setGridConfig] = useState({
    cols: 0,
    rows: 0,
    tileSize: 0,
  });
  const [binaryGrid, setBinaryGrid] = useState<string[][]>([]);

  // Stable ref callback for tile elements
  const setTileRef = useCallback(
    (rowIndex: number, colIndex: number, el: HTMLSpanElement | null) => {
      if (!tileRefs.current[rowIndex]) {
        tileRefs.current[rowIndex] = [];
      }
      tileRefs.current[rowIndex][colIndex] = el;
    },
    [],
  );

  // Generate binary pattern grid masked by text
  useEffect(() => {
    const calculateGrid = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const tileSize = getTileSize(containerWidth);
      const cols = Math.floor(containerWidth / tileSize);
      const rows = Math.floor(CONTAINER_HEIGHT / tileSize);

      setGridConfig({ cols, rows, tileSize });

      const canvasResult = createTextCanvas(text, cols, rows, tileSize);
      if (!canvasResult) return;

      const { canvas, ctx } = canvasResult;
      const grid = generateBinaryGrid(canvas, ctx, cols, rows, tileSize);
      const trimmedGrid = trimEmptyRows(grid);

      baseGridRef.current = trimmedGrid.map((row) => [...row]);
      tileRefs.current = trimmedGrid.map((row) => row.map(() => null));
      revealedRef.current = false;
      setBinaryGrid(trimmedGrid);
    };

    calculateGrid();

    let resizeTimeout: NodeJS.Timeout;
    const debouncedCalculateGrid = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(calculateGrid, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener("resize", debouncedCalculateGrid);
    return () => {
      window.removeEventListener("resize", debouncedCalculateGrid);
      clearTimeout(resizeTimeout);
    };
  }, [text]);

  // Reveal animation: each tile appears randomly — direct DOM manipulation
  useEffect(() => {
    if (!inView || baseGridRef.current.length === 0 || revealedRef.current)
      return;

    let revealInterval: NodeJS.Timeout;

    const delayTimeout = setTimeout(() => {
      const baseGrid = baseGridRef.current;
      const totalRows = baseGrid.length;

      const allTiles: { row: number; col: number; opacity: number }[] = [];
      for (let row = 0; row < totalRows; row++) {
        const opacity = calculateTileOpacity(row, totalRows);
        for (let col = 0; col < (baseGrid[row]?.length || 0); col++) {
          if (isTextTile(baseGrid[row][col])) {
            allTiles.push({ row, col, opacity });
          }
        }
      }

      const shuffledTiles = [...allTiles].sort(() => Math.random() - 0.5);
      let currentIndex = 0;

      revealInterval = setInterval(() => {
        const tilesPerFrame =
          Math.floor(
            Math.random() *
              (REVEAL_MAX_TILES_PER_FRAME - REVEAL_MIN_TILES_PER_FRAME + 1),
          ) + REVEAL_MIN_TILES_PER_FRAME;

        for (
          let i = 0;
          i < tilesPerFrame && currentIndex < shuffledTiles.length;
          i++
        ) {
          const tile = shuffledTiles[currentIndex];
          const el = tileRefs.current[tile.row]?.[tile.col];
          if (el) {
            el.style.opacity = String(tile.opacity);
          }
          currentIndex++;
        }

        if (currentIndex >= shuffledTiles.length) {
          revealedRef.current = true;
          clearInterval(revealInterval);
        }
      }, REVEAL_INTERVAL_MS);
    }, REVEAL_DELAY_MS);

    return () => {
      clearTimeout(delayTimeout);
      if (revealInterval) clearInterval(revealInterval);
    };
  }, [inView, binaryGrid]);

  // Glitch effect — direct DOM manipulation, paused when not in view
  useEffect(() => {
    if (!inView) return;

    const glitchInterval = setInterval(() => {
      const baseGrid = baseGridRef.current;
      if (baseGrid.length === 0) return;

      const rows = baseGrid.length;
      const cols = baseGrid[0]?.length || 0;

      // Character glitch
      const flipsCount =
        Math.floor(
          Math.random() * (CHAR_GLITCH_MAX_COUNT - CHAR_GLITCH_MIN_COUNT + 1),
        ) + CHAR_GLITCH_MIN_COUNT;

      for (let i = 0; i < flipsCount; i++) {
        const rowIndex = Math.floor(Math.random() * rows);
        const colIndex = Math.floor(Math.random() * cols);
        if (isTextTile(baseGrid[rowIndex]?.[colIndex])) {
          const el = tileRefs.current[rowIndex]?.[colIndex];
          if (el) el.textContent = getRandomChar();
        }
      }

      // Single tile color glitches
      const colorGlitchCount =
        Math.floor(
          Math.random() * (COLOR_GLITCH_MAX_COUNT - COLOR_GLITCH_MIN_COUNT + 1),
        ) + COLOR_GLITCH_MIN_COUNT;

      for (let i = 0; i < colorGlitchCount; i++) {
        const rowIndex = Math.floor(Math.random() * rows);
        const colIndex = Math.floor(Math.random() * cols);
        if (isTextTile(baseGrid[rowIndex]?.[colIndex])) {
          const el = tileRefs.current[rowIndex]?.[colIndex];
          if (el) {
            el.style.color =
              Math.random() < COLOR_GLITCH_COLORFUL_CHANCE
                ? GLITCH_COLORS[
                    Math.floor(Math.random() * GLITCH_COLORS.length)
                  ]
                : "#000";
          }
        }
      }

      // Block color glitches
      if (Math.random() > 1 - BLOCK_GLITCH_CHANCE) {
        const centerRow = Math.floor(Math.random() * rows);
        const centerCol = Math.floor(Math.random() * cols);
        const blockSize =
          Math.floor(
            Math.random() * (BLOCK_GLITCH_MAX_SIZE - BLOCK_GLITCH_MIN_SIZE + 1),
          ) + BLOCK_GLITCH_MIN_SIZE;
        const color =
          GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)];

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
            if (isTextTile(baseGrid[r]?.[c])) {
              const el = tileRefs.current[r]?.[c];
              if (el) el.style.color = color;
            }
          }
        }
      }
    }, GLITCH_INTERVAL_MS);

    return () => clearInterval(glitchInterval);
  }, [inView]);

  // Mouse displacement — direct DOM manipulation via rAF, no React state
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = 0;
        const baseGrid = baseGridRef.current;
        const tileSize = gridConfig.tileSize;
        if (baseGrid.length === 0 || tileSize === 0) return;

        const rows = baseGrid.length;
        const cols = baseGrid[0]?.length || 0;

        const initialDisplacement: { x: number; y: number }[][] = [];
        for (let row = 0; row < rows; row++) {
          const rowDisp: { x: number; y: number }[] = [];
          for (let col = 0; col < cols; col++) {
            rowDisp.push(
              calculateTileDisplacement(
                row,
                col,
                baseGrid[row]?.[col],
                mousePos,
                tileSize,
              ),
            );
          }
          initialDisplacement.push(rowDisp);
        }

        const finalDisplacement = applyCascadingPush(
          initialDisplacement,
          baseGrid,
          tileSize,
        );

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const el = tileRefs.current[row]?.[col];
            if (el) {
              const d = finalDisplacement[row][col];
              el.style.transform = `translate(${d.x}px, ${d.y}px)`;
            }
          }
        }
      });
    };

    const handleMouseLeave = () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      for (const row of tileRefs.current) {
        if (!row) continue;
        for (const el of row) {
          if (el) el.style.transform = "translate(0px, 0px)";
        }
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [gridConfig.tileSize]);

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
      {binaryGrid.map((row, rowIndex) => (
        <div
          key={rowIndex}
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          {row.map((char, colIndex) => (
            <span
              key={colIndex}
              ref={(el) => setTileRef(rowIndex, colIndex, el)}
              style={{
                width: `${gridConfig.tileSize}px`,
                display: "inline-block",
                textAlign: "center",
                flexShrink: 0,
                color: "#000",
                opacity: 0,
                transform: "translate(0px, 0px)",
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
