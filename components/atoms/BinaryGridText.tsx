import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@lib/utils/cn";

interface BinaryGridTextProps {
  text: string;
  inView: boolean;
  className?: string;
}

// Configuration constants (Kept from original)
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
  "#ff0000",
  "#00ff00",
  "#0000ff",
  "#ff00ff",
  "#00ffff",
  "#ffff00",
];

// --- Interfaces ---
interface Particle {
  char: string;
  baseChar: string;
  x: number; // Visual X (relative to canvas)
  y: number; // Visual Y
  baseX: number; // Grid Origin X
  baseY: number; // Grid Origin Y
  row: number;
  col: number;
  opacity: number;
  color: string;
}

// --- Helpers ---

function getTileSize(containerWidth: number): number {
  if (containerWidth >= DESKTOP_BREAKPOINT) return TILE_SIZE_DESKTOP;
  if (containerWidth >= TABLET_BREAKPOINT) return TILE_SIZE_TABLET;
  return TILE_SIZE_MOBILE;
}

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

function trimEmptyRows(grid: string[][]): {
  grid: string[][];
  offsetRow: number;
} {
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
  return {
    grid: grid.slice(firstNonEmptyRow, lastNonEmptyRow + 1),
    offsetRow: firstNonEmptyRow,
  };
}

function calculateTileOpacity(rowIndex: number, totalRows: number): number {
  if (totalRows === 0) return OPACITY_MIN;
  const progress = rowIndex / totalRows;
  if (progress <= OPACITY_MID_POINT) {
    return (
      OPACITY_MIN + (progress / OPACITY_MID_POINT) * (OPACITY_MID - OPACITY_MIN)
    );
  }

  return (
    OPACITY_MID +
    ((progress - OPACITY_MID_POINT) / OPACITY_MID_POINT) *
      (OPACITY_MAX - OPACITY_MID)
  );
}

function isTextTile(char: string | undefined): boolean {
  return char === "0" || char === "1";
}

// Logic from original displacement
function calculateDisplacement(
  px: number,
  py: number,
  mousePos: { x: number; y: number },
  tileSize: number,
): { x: number; y: number } {
  const dx = px - mousePos.x;
  const dy = py - mousePos.y;
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

// Logic from original displacement cascade
function applyCascadingPush(
  initialDisplacement: { x: number; y: number }[][],
  baseGrid: string[][],
  tileSize: number,
): { x: number; y: number }[][] {
  const rows = initialDisplacement.length;
  const cols = initialDisplacement[0]?.length || 0;

  // Clone the grid
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
            // If the target has NOT moved yet, move it by the same amount (push)
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

export default function BinaryGridText({
  text,
  inView,
  className,
}: BinaryGridTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State for logic
  const particlesRef = useRef<Particle[]>([]);
  const gridConfigRef = useRef({ cols: 0, rows: 0, tileSize: 0 });
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | null>(null);
  const revealedRef = useRef(false);

  // 1. Initialize Grid (Create Particles)
  useEffect(() => {
    const init = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const tileSize = getTileSize(containerWidth);
      const cols = Math.floor(containerWidth / tileSize);
      const rows = Math.floor(CONTAINER_HEIGHT / tileSize);

      gridConfigRef.current = { cols, rows, tileSize };

      const canvasResult = createTextCanvas(text, cols, rows, tileSize);
      if (!canvasResult) return;

      const { canvas, ctx } = canvasResult;
      const rawGrid = generateBinaryGrid(canvas, ctx, cols, rows, tileSize);
      const { grid, offsetRow } = trimEmptyRows(rawGrid); // We might not need offsetRow if we center visually, but let's keep logic close

      // Convert to particles
      const newParticles: Particle[] = [];
      const totalRows = grid.length;

      // Preserve old particles if available to avoid re-reveal
      const oldParticles = particlesRef.current;
      const wasRevealed = revealedRef.current;

      grid.forEach((row, r) => {
        row.forEach((char, c) => {
          if (isTextTile(char)) {
            const x = c * tileSize + tileSize / 2;
            const y = r * tileSize + tileSize / 2;

            // Try to find matching old particle to preserve opacity/color
            // Simple heuristic: if we are resizing, relative position might change,
            // but if we just want to avoid "blink", we can default to fully revealed if wasRevealed is true.

            let opacity = 0;
            const color = "#000";

            if (wasRevealed) {
              opacity = calculateTileOpacity(r, totalRows);
            }

            newParticles.push({
              char,
              baseChar: char,
              x,
              y,
              baseX: x,
              baseY: y,
              row: r,
              col: c,
              opacity,
              color,
            });
          }
        });
      });

      particlesRef.current = newParticles;
      // Do not reset revealedRef if it was already true
      if (!wasRevealed) {
        revealedRef.current = false;
      }

      // Update canvas size
      if (canvasRef.current) {
        const dpr = window.devicePixelRatio || 1;
        // Height needs to match the grid height roughly
        const h = totalRows * tileSize;
        canvasRef.current.width = containerWidth * dpr;
        canvasRef.current.height = h * dpr;
        canvasRef.current.style.width = `${containerWidth}px`;
        canvasRef.current.style.height = `${h}px`;
      }
    };

    init();

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(init, RESIZE_DEBOUNCE_MS);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [text]);

  // 2. Reveal Animation
  useEffect(() => {
    if (!inView || revealedRef.current || particlesRef.current.length === 0)
      return;

    let intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      const particles = particlesRef.current;
      // Calculate target opacities
      const targets = particles.map((p) => ({
        ...p,
        targetOpacity: calculateTileOpacity(p.row, gridConfigRef.current.rows), // This might be wrong, need total rows of trimmed grid
      }));
      // Fix opacity calc using actual particle bounds
      const maxRow = Math.max(...particles.map((p) => p.row));
      targets.forEach((t, i) => {
        // Store target opacity on the particle object?
        // Simpler: just set a flag or handle it in the loop?
        // The original code uses a randomized reveal.
        // Let's create a queue of indices to reveal.
      });

      // Let's do it simply:
      // Create a shuffled list of indices
      const indices = Array.from({ length: particles.length }, (_, i) => i);
      indices.sort(() => Math.random() - 0.5);

      let currentIndex = 0;

      intervalId = setInterval(() => {
        const count =
          Math.floor(
            Math.random() *
              (REVEAL_MAX_TILES_PER_FRAME - REVEAL_MIN_TILES_PER_FRAME + 1),
          ) + REVEAL_MIN_TILES_PER_FRAME;
        for (let i = 0; i < count && currentIndex < indices.length; i++) {
          const idx = indices[currentIndex++];
          const p = particles[idx];
          // Calculate final opacity based on row
          p.opacity = calculateTileOpacity(p.row, maxRow + 1);
        }

        if (currentIndex >= indices.length) {
          revealedRef.current = true;
          clearInterval(intervalId);
        }
      }, REVEAL_INTERVAL_MS);
    }, REVEAL_DELAY_MS);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [inView, text]); // Dependency on text ensures reset on prop change

  // 3. Glitch Loop (Data Update)
  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      const particles = particlesRef.current;
      if (particles.length === 0) return;

      // A. Char Glitch
      const charCount =
        Math.floor(
          Math.random() * (CHAR_GLITCH_MAX_COUNT - CHAR_GLITCH_MIN_COUNT + 1),
        ) + CHAR_GLITCH_MIN_COUNT;
      for (let i = 0; i < charCount; i++) {
        const idx = Math.floor(Math.random() * particles.length);
        particles[idx].char = getRandomChar();
        // Revert logic needed? Original didn't seem to revert quickly, just changed textContent.
        // But usually glitches are transient. The original randomizes 0/1 again later?
        // Actually original just sets it.
      }

      // B. Color Glitch
      const colorCount =
        Math.floor(
          Math.random() * (COLOR_GLITCH_MAX_COUNT - COLOR_GLITCH_MIN_COUNT + 1),
        ) + COLOR_GLITCH_MIN_COUNT;
      for (let i = 0; i < colorCount; i++) {
        const idx = Math.floor(Math.random() * particles.length);
        particles[idx].color =
          Math.random() < COLOR_GLITCH_COLORFUL_CHANCE
            ? GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)]
            : "#000";
      }

      // C. Block Glitch
      if (Math.random() > 1 - BLOCK_GLITCH_CHANCE) {
        const centerIdx = Math.floor(Math.random() * particles.length);
        const centerP = particles[centerIdx];
        const size =
          Math.floor(
            Math.random() * (BLOCK_GLITCH_MAX_SIZE - BLOCK_GLITCH_MIN_SIZE + 1),
          ) + BLOCK_GLITCH_MIN_SIZE;
        const color =
          GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)];

        // Find neighbors (brute force or spatial? Brute force is O(N), acceptable for <2000 particles)
        // Optimization: Use grid coordinates
        for (const p of particles) {
          if (
            Math.abs(p.row - centerP.row) <= size / 2 &&
            Math.abs(p.col - centerP.col) <= size / 2
          ) {
            p.color = color;
          }
        }
      }
    }, GLITCH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [inView]);

  // 4. Main Render Loop (Canvas + Physics)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !inView || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);

    const render = () => {
      const particles = particlesRef.current;
      const { tileSize } = gridConfigRef.current;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear raw pixels

      ctx.save();
      ctx.scale(dpr, dpr);

      // Use standard weight (400) for display to match original font-mono look
      // The FONT_WEIGHT (800) constant was only for the mask generation
      ctx.font = `400 ${tileSize}px "${FONT_FAMILY}", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Calculate displacement field
      const { rows, cols } = gridConfigRef.current;

      // 1. Initial Displacement Grid
      const initialDisplacement: { x: number; y: number }[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill({ x: 0, y: 0 }));
      const baseGrid: string[][] = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(" "));

      // Populate baseGrid and initialDisplacement from particles
      // Optimization: Only iterate particles to populate grid. Empty cells stay " ".
      for (const p of particles) {
        baseGrid[p.row][p.col] = p.baseChar;
        const d = calculateDisplacement(
          p.baseX,
          p.baseY,
          mouseRef.current,
          tileSize,
        );
        initialDisplacement[p.row][p.col] = d;
      }

      // 2. Apply Cascade
      const finalDisplacement = applyCascadingPush(
        initialDisplacement,
        baseGrid,
        tileSize,
      );

      // 3. Render
      for (const p of particles) {
        if (p.opacity <= 0.01) continue;

        const d = finalDisplacement[p.row][p.col];

        p.x = p.baseX + d.x;
        p.y = p.baseY + d.y;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.char, p.x, p.y);
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
    };
  }, [inView]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full cursor-default overflow-hidden",
        className,
      )}
    >
      <canvas ref={canvasRef} className="pointer-events-none block" />
    </div>
  );
}
