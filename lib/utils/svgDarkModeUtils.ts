import {
  clamp,
  oklchToRgb,
  ParsedColor,
  rgbToOklch,
} from "@lib/utils/colorSpace";

export const MAX_PROCESSABLE_NODES = 180;
export const PAINTABLE_SELECTOR =
  "path,rect,circle,ellipse,polygon,polyline,line,text,use";
export const DARK_LIGHTNESS_THRESHOLD = 0.56;
export const LIGHT_ELEMENT_THRESHOLD = 0.72;
export const SUPER_LIGHT_FILL_THRESHOLD = 0.9;
export const OVERLAP_THRESHOLD = 0.02;
export const FILLED_OVERLAP_THRESHOLD = 0.04;

function isResourceElement(element: Element): boolean {
  return Boolean(
    element.closest(
      "defs,clipPath,mask,pattern,marker,symbol,linearGradient,radialGradient",
    ),
  );
}

export type ElementCandidate = {
  element: SVGGraphicsElement;
  bbox: DOMRect;
  area: number;
  paintIndex: number;
  parsedPaintColors: ParsedColor[];
  effectiveOpacity: number;
  fillColor: ParsedColor | null;
  strokeColor: ParsedColor | null;
  hasFillPaint: boolean;
  hasLightPaint: boolean;
  // True when a real light filled surface (not just a stroke/grid) is painted
  // underneath this candidate with enough visible opacity to act as support.
  hasLightSurfaceBelow: boolean;
  hasDarkPaint: boolean;
  hasDarkNeutralPaint: boolean;
};

let colorParserElement: HTMLSpanElement | null = null;

function getColorParserElement(): HTMLSpanElement | null {
  if (typeof window === "undefined" || !document.body) return null;
  if (!colorParserElement) {
    colorParserElement = document.createElement("span");
    colorParserElement.style.display = "none";
    document.body.appendChild(colorParserElement);
  }
  return colorParserElement;
}

function isNonTransformableColor(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    !normalized ||
    normalized === "none" ||
    normalized === "transparent" ||
    normalized === "currentcolor" ||
    normalized === "inherit" ||
    normalized.startsWith("url(") ||
    normalized.startsWith("var(")
  );
}

export function parseCssColor(value: string): ParsedColor | null {
  if (isNonTransformableColor(value)) return null;

  // Some SVG attributes are already rewritten to OKLCH by an earlier pass.
  // Parse those directly so subsequent heuristics still work on the same node.
  const normalized = value.trim().toLowerCase();
  const oklchMatch = normalized.match(
    /^oklch\(\s*([0-9.]+%?)\s+([0-9.]+)\s+([0-9.\-]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/i,
  );
  if (oklchMatch) {
    const rawL = oklchMatch[1];
    const rawAlpha = oklchMatch[4];
    const l = rawL.endsWith("%")
      ? clamp(Number(rawL.slice(0, -1)) / 100, 0, 1)
      : clamp(Number(rawL), 0, 1);
    const c = Math.max(Number(oklchMatch[2]), 0);
    const h = Number(oklchMatch[3]);
    const alpha =
      rawAlpha === undefined
        ? 1
        : rawAlpha.endsWith("%")
          ? clamp(Number(rawAlpha.slice(0, -1)) / 100, 0, 1)
          : clamp(Number(rawAlpha), 0, 1);

    if (Number.isFinite(l) && Number.isFinite(c) && Number.isFinite(h)) {
      return oklchToRgb({ l, c, h }, alpha);
    }
  }

  const parser = getColorParserElement();
  if (!parser) return null;

  parser.style.color = "";
  parser.style.color = value;
  if (!parser.style.color) return null;

  const computed = window.getComputedStyle(parser).color;
  const match = computed.match(
    /rgba?\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*(\d+(?:\.\d+)?))?\)/i,
  );
  if (!match) return null;

  return {
    r: clamp(Number(match[1]), 0, 255),
    g: clamp(Number(match[2]), 0, 255),
    b: clamp(Number(match[3]), 0, 255),
    a: match[4] === undefined ? 1 : clamp(Number(match[4]), 0, 1),
  };
}

export function isDarkColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l < DARK_LIGHTNESS_THRESHOLD;
}

export function isLightColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l >= LIGHT_ELEMENT_THRESHOLD;
}

export function isDarkNeutralColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l < DARK_LIGHTNESS_THRESHOLD && oklch.c <= 0.08;
}

export function isSuperLightColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l >= SUPER_LIGHT_FILL_THRESHOLD;
}

export function isLightNeutralColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l >= LIGHT_ELEMENT_THRESHOLD && oklch.c <= 0.08;
}

export function sanitizeSvg(doc: Document): void {
  doc.querySelectorAll("script, foreignObject").forEach((node) => node.remove());

  doc.querySelectorAll("*").forEach((el) => {
    [...el.attributes].forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();

      if (name.startsWith("on")) {
        el.removeAttribute(attr.name);
      }

      if (
        (name === "href" || name === "xlink:href") &&
        /^javascript:/i.test(value)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });
}

function parseSvgNumber(value: string | null | undefined, fallback = 0): number {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getPathAttributeBBox(d: string): DOMRect | null {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens || tokens.length === 0) return null;

  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  const points: Array<{ x: number; y: number }> = [];

  const isCommand = (token: string) => /^[a-zA-Z]$/.test(token);
  const readNumber = (): number | null => {
    if (index >= tokens.length) return null;
    const token = tokens[index];
    if (isCommand(token)) return null;
    index += 1;
    const parsed = Number(token);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const pushPoint = (x: number, y: number) => {
    if (Number.isFinite(x) && Number.isFinite(y)) {
      points.push({ x, y });
    }
  };

  while (index < tokens.length) {
    const token = tokens[index];
    if (isCommand(token)) {
      command = token;
      index += 1;
    } else if (!command) {
      return null;
    }

    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();

    if (upper === "Z") {
      currentX = startX;
      currentY = startY;
      pushPoint(currentX, currentY);
      command = relative ? "z" : "Z";
      continue;
    }

    if (upper === "M") {
      const x = readNumber();
      const y = readNumber();
      if (x === null || y === null) break;
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      startX = currentX;
      startY = currentY;
      pushPoint(currentX, currentY);

      // Subsequent pairs after M/m are treated as L/l.
      command = relative ? "l" : "L";
      continue;
    }

    if (upper === "L") {
      const x = readNumber();
      const y = readNumber();
      if (x === null || y === null) break;
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "H") {
      const x = readNumber();
      if (x === null) break;
      currentX = relative ? currentX + x : x;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "V") {
      const y = readNumber();
      if (y === null) break;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "C") {
      const values = Array.from({ length: 6 }, () => readNumber());
      if (values.some((value) => value === null)) break;
      const [x1, y1, x2, y2, x, y] = values as number[];
      pushPoint(relative ? currentX + x1 : x1, relative ? currentY + y1 : y1);
      pushPoint(relative ? currentX + x2 : x2, relative ? currentY + y2 : y2);
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "S" || upper === "Q") {
      const valueCount = upper === "S" ? 4 : 4;
      const values = Array.from({ length: valueCount }, () => readNumber());
      if (values.some((value) => value === null)) break;
      const [x1, y1, x, y] = values as number[];
      pushPoint(relative ? currentX + x1 : x1, relative ? currentY + y1 : y1);
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "T") {
      const x = readNumber();
      const y = readNumber();
      if (x === null || y === null) break;
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "A") {
      const values = Array.from({ length: 7 }, () => readNumber());
      if (values.some((value) => value === null)) break;
      const [rx, ry, _rotation, _largeArcFlag, _sweepFlag, x, y] =
        values as number[];
      pushPoint(currentX - rx, currentY - ry);
      pushPoint(currentX + rx, currentY + ry);
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX - rx, currentY - ry);
      pushPoint(currentX + rx, currentY + ry);
      pushPoint(currentX, currentY);
      continue;
    }

    // Unsupported command or malformed sequence. Abort so we can fall back to
    // getBBox() for anything more complex than our conservative approximation.
    return null;
  }

  if (points.length === 0) return null;
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const width = maxX - minX;
  const height = maxY - minY;
  if (width < 0 || height < 0) return null;
  return new DOMRect(minX, minY, width, height);
}

function isConnectorLikePathData(d: string): boolean {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens || tokens.length === 0) return false;

  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  const points: Array<{ x: number; y: number }> = [];

  const isCommand = (token: string) => /^[a-zA-Z]$/.test(token);
  const readNumber = (): number | null => {
    if (index >= tokens.length) return null;
    const token = tokens[index];
    if (isCommand(token)) return null;
    index += 1;
    const parsed = Number(token);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const pushPoint = (x: number, y: number) => {
    if (Number.isFinite(x) && Number.isFinite(y)) points.push({ x, y });
  };

  while (index < tokens.length) {
    const token = tokens[index];
    if (isCommand(token)) {
      command = token;
      index += 1;
    } else if (!command) {
      return false;
    }

    const relative = command === command.toLowerCase();
    const upper = command.toUpperCase();

    if (upper === "Z") {
      continue;
    }

    if (upper === "M" || upper === "L" || upper === "T") {
      const x = readNumber();
      const y = readNumber();
      if (x === null || y === null) break;
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      if (upper === "M") command = relative ? "l" : "L";
      continue;
    }

    if (upper === "H") {
      const x = readNumber();
      if (x === null) break;
      currentX = relative ? currentX + x : x;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "V") {
      const y = readNumber();
      if (y === null) break;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "C") {
      const values = Array.from({ length: 6 }, () => readNumber());
      if (values.some((value) => value === null)) break;
      const [_x1, _y1, _x2, _y2, x, y] = values as number[];
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "S" || upper === "Q") {
      const values = Array.from({ length: 4 }, () => readNumber());
      if (values.some((value) => value === null)) break;
      const [_x1, _y1, x, y] = values as number[];
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    if (upper === "A") {
      const values = Array.from({ length: 7 }, () => readNumber());
      if (values.some((value) => value === null)) break;
      const [_rx, _ry, _rotation, _largeArcFlag, _sweepFlag, x, y] =
        values as number[];
      currentX = relative ? currentX + x : x;
      currentY = relative ? currentY + y : y;
      pushPoint(currentX, currentY);
      continue;
    }

    return false;
  }

  if (points.length < 3) return false;

  let longHorizontalOrVerticalSegments = 0;
  let shortDiagonalSegments = 0;

  for (let i = 1; i < points.length; i += 1) {
    const dx = Math.abs(points[i].x - points[i - 1].x);
    const dy = Math.abs(points[i].y - points[i - 1].y);
    const length = Math.hypot(dx, dy);
    if (length <= 0) continue;

    if ((dx >= 18 && dy <= 6) || (dy >= 18 && dx <= 6)) {
      longHorizontalOrVerticalSegments += 1;
    } else if (length <= 18 && dx > 0 && dy > 0) {
      shortDiagonalSegments += 1;
    }
  }

  return (
    longHorizontalOrVerticalSegments >= 1 &&
    shortDiagonalSegments >= 2
  );
}

function getAttributeBBox(element: SVGGraphicsElement): DOMRect | null {
  const tag = element.tagName.toLowerCase();

  if (tag === "rect") {
    const x = parseSvgNumber(element.getAttribute("x"), 0);
    const y = parseSvgNumber(element.getAttribute("y"), 0);
    const width = parseSvgNumber(element.getAttribute("width"), 0);
    const height = parseSvgNumber(element.getAttribute("height"), 0);
    if (width <= 0 || height <= 0) return null;
    return new DOMRect(x, y, width, height);
  }

  if (tag === "circle") {
    const cx = parseSvgNumber(element.getAttribute("cx"), 0);
    const cy = parseSvgNumber(element.getAttribute("cy"), 0);
    const r = parseSvgNumber(element.getAttribute("r"), 0);
    if (r <= 0) return null;
    return new DOMRect(cx - r, cy - r, r * 2, r * 2);
  }

  if (tag === "ellipse") {
    const cx = parseSvgNumber(element.getAttribute("cx"), 0);
    const cy = parseSvgNumber(element.getAttribute("cy"), 0);
    const rx = parseSvgNumber(element.getAttribute("rx"), 0);
    const ry = parseSvgNumber(element.getAttribute("ry"), 0);
    if (rx <= 0 || ry <= 0) return null;
    return new DOMRect(cx - rx, cy - ry, rx * 2, ry * 2);
  }

  if (tag === "line") {
    const x1 = parseSvgNumber(element.getAttribute("x1"), 0);
    const y1 = parseSvgNumber(element.getAttribute("y1"), 0);
    const x2 = parseSvgNumber(element.getAttribute("x2"), 0);
    const y2 = parseSvgNumber(element.getAttribute("y2"), 0);
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    return new DOMRect(minX, minY, width, height);
  }

  if (tag === "path") {
    const d = element.getAttribute("d");
    if (!d) return null;
    return getPathAttributeBBox(d);
  }

  return null;
}

function getTransformedBBox(element: SVGGraphicsElement): DOMRect {
  let bbox: DOMRect;
  const attrBBox = getAttributeBBox(element);
  if (attrBBox) {
    // For basic SVG primitives, attribute-derived geometry is more stable than
    // getBBox() in our parsed/off-DOM transform pipeline.
    bbox = attrBBox;
  } else {
    try {
      bbox = element.getBBox();
    } catch {
      throw new Error("Cannot resolve bbox");
    }
  }

  const ctm = element.getCTM();
  if (!ctm) return bbox;

  const corners = [
    new DOMPoint(bbox.x, bbox.y),
    new DOMPoint(bbox.x + bbox.width, bbox.y),
    new DOMPoint(bbox.x, bbox.y + bbox.height),
    new DOMPoint(bbox.x + bbox.width, bbox.y + bbox.height),
  ].map((point) => point.matrixTransform(ctm));

  const xs = corners.map((point) => point.x);
  const ys = corners.map((point) => point.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  return new DOMRect(minX, minY, maxX - minX, maxY - minY);
}

function getEffectiveOpacity(element: Element): number {
  let node: Element | null = element;
  let opacity = 1;

  while (node && node.tagName.toLowerCase() !== "svg") {
    const attrOpacity = node.getAttribute("opacity");
    if (attrOpacity) {
      const parsed = Number(attrOpacity);
      if (Number.isFinite(parsed)) opacity *= clamp(parsed, 0, 1);
    }

    const style = node.getAttribute("style");
    if (style) {
      const match = style.match(/opacity\s*:\s*([0-9.]+)/i);
      if (match) {
        const parsed = Number(match[1]);
        if (Number.isFinite(parsed)) opacity *= clamp(parsed, 0, 1);
      }
    }

    node = node.parentElement;
  }

  return opacity;
}

function getStrokeWidth(element: SVGGraphicsElement): number {
  const direct = element.getAttribute("stroke-width");
  if (direct) {
    const parsed = Number(direct);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  const style = element.getAttribute("style");
  if (style) {
    const match = style.match(/stroke-width\s*:\s*([0-9.]+)/i);
    if (match) {
      const parsed = Number(match[1]);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }

  return 1;
}

export function intersects(a: DOMRect, b: DOMRect): number {
  const x1 = Math.max(a.x, b.x);
  const y1 = Math.max(a.y, b.y);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (x2 <= x1 || y2 <= y1) return 0;
  return (x2 - x1) * (y2 - y1);
}

function extractPaintColors(element: SVGGraphicsElement): ParsedColor[] {
  const values: string[] = [];
  const fill = element.getAttribute("fill");
  const stroke = element.getAttribute("stroke");
  if (fill) values.push(fill);
  if (stroke) values.push(stroke);

  const style = element.getAttribute("style");
  if (style) {
    const fillMatch = style.match(/fill\s*:\s*([^;]+)/i);
    const strokeMatch = style.match(/stroke\s*:\s*([^;]+)/i);
    if (fillMatch) values.push(fillMatch[1].trim());
    if (strokeMatch) values.push(strokeMatch[1].trim());
  }

  return values
    .map((value) => parseCssColor(value))
    .filter((color): color is ParsedColor => Boolean(color));
}

function extractPaintColor(
  element: SVGGraphicsElement,
  attr: "fill" | "stroke",
): ParsedColor | null {
  const direct = element.getAttribute(attr);
  if (direct) {
    const parsed = parseCssColor(direct);
    if (parsed) return parsed;
  }

  const style = element.getAttribute("style");
  if (!style) return null;
  const match = style.match(new RegExp(`${attr}\\s*:\\s*([^;]+)`, "i"));
  if (!match) return null;
  return parseCssColor(match[1].trim());
}

export function collectCandidates(svg: SVGSVGElement): ElementCandidate[] {
  const nodes = [...svg.querySelectorAll<SVGGraphicsElement>(PAINTABLE_SELECTOR)].slice(
    0,
    MAX_PROCESSABLE_NODES,
  );

  const candidates: ElementCandidate[] = [];

  for (let paintIndex = 0; paintIndex < nodes.length; paintIndex++) {
    const element = nodes[paintIndex];

    try {
      const bbox = getTransformedBBox(element);
      const strokeWidth = getStrokeWidth(element);
      const effectiveWidth = Math.max(bbox.width, strokeWidth);
      const effectiveHeight = Math.max(bbox.height, strokeWidth);
      const area = effectiveWidth * effectiveHeight;
      if (!Number.isFinite(area) || area <= 0) continue;

      const fillColor = extractPaintColor(element, "fill");
      const strokeColor = extractPaintColor(element, "stroke");
      const parsedPaintColors = extractPaintColors(element);
      const effectiveOpacity = getEffectiveOpacity(element);
      const hasFillPaint =
        fillColor !== null && effectiveOpacity * fillColor.a > 0.08;
      const hasLightPaint = parsedPaintColors.some((color) => isLightColor(color));
      const hasDarkPaint = parsedPaintColors.some((color) => isDarkColor(color));
      const hasDarkNeutralPaint = parsedPaintColors.some((color) =>
        isDarkNeutralColor(color),
      );

      candidates.push({
        element,
        bbox,
        area,
        paintIndex,
        parsedPaintColors,
        effectiveOpacity,
        fillColor,
        strokeColor,
        hasFillPaint,
        hasLightPaint,
        hasLightSurfaceBelow: false,
        hasDarkPaint,
        hasDarkNeutralPaint,
      });
    } catch {
      // skip invalid geometry
    }
  }

  for (const candidate of candidates) {
    candidate.hasLightSurfaceBelow = hasLightSurfaceBelow(candidate, candidates);
  }

  return candidates;
}

export function hasLightBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // Broad light-support signal used by foreground-lightening heuristics. This
  // includes light fills and light strokes, so it can catch grid/line support
  // that is not a real surface.
  for (const below of allCandidates) {
    if (below.paintIndex >= candidate.paintIndex) continue;
    if (isResourceElement(below.element)) continue;
    if (!below.hasLightPaint) continue;
    if (below.effectiveOpacity < 0.35) continue;

    const overlapArea = intersects(candidate.bbox, below.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, candidate.area);
    if (overlapPortion >= Math.max(OVERLAP_THRESHOLD, 0.01)) {
      return true;
    }
  }

  return false;
}

export function hasNonTransparentFilledBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // Broader support check used by dim-line / dim-fill gating. Any visible fill
  // underneath means the candidate is no longer "floating" on transparent space.
  for (const below of allCandidates) {
    if (below.paintIndex >= candidate.paintIndex) continue;
    if (isResourceElement(below.element)) continue;
    if (!below.hasFillPaint) continue;
    if (below.effectiveOpacity < 0.08) continue;

    const overlapArea = intersects(candidate.bbox, below.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, candidate.area);
    if (overlapPortion >= FILLED_OVERLAP_THRESHOLD) {
      return true;
    }
  }

  return false;
}

export function hasLightSurfaceBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // Stricter than hasLightBelow(): only real light fills with >= 0.5 effective
  // opacity count as a supporting surface. For generic surface/foreground
  // classification we allow either full containment (small icon/control detail
  // inside a light card) or meaningful overlap.
  for (const below of allCandidates) {
    if (below.paintIndex >= candidate.paintIndex) continue;
    if (isResourceElement(below.element)) continue;
    if (!below.hasFillPaint) continue;
    if (!below.fillColor || !isLightColor(below.fillColor)) continue;
    if (below.effectiveOpacity < 0.5) continue;

    const fullyContained =
      candidate.bbox.x >= below.bbox.x &&
      candidate.bbox.y >= below.bbox.y &&
      candidate.bbox.x + candidate.bbox.width <= below.bbox.x + below.bbox.width &&
      candidate.bbox.y + candidate.bbox.height <= below.bbox.y + below.bbox.height;
    if (fullyContained) {
      return true;
    }

    const overlapArea = intersects(candidate.bbox, below.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, candidate.area);
    if (overlapPortion >= FILLED_OVERLAP_THRESHOLD) {
      return true;
    }
  }

  return false;
}

export function hasStrongLightSurfaceSupportBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // Line dimming needs a stricter notion of "supported by a light surface"
  // than generic foreground/surface classification. Small icons fully inside a
  // light control should stay unchanged, but large dashed frames or connector
  // paths should still dim even if their bounding box overlaps light panels
  // elsewhere inside the same region. We therefore require either full
  // containment or a strong overlap ratio.
  for (const below of allCandidates) {
    if (below.paintIndex >= candidate.paintIndex) continue;
    if (isResourceElement(below.element)) continue;
    if (!below.hasFillPaint) continue;
    if (!below.fillColor || !isLightColor(below.fillColor)) continue;
    if (below.effectiveOpacity < 0.5) continue;

    const fullyContained =
      candidate.bbox.x >= below.bbox.x &&
      candidate.bbox.y >= below.bbox.y &&
      candidate.bbox.x + candidate.bbox.width <= below.bbox.x + below.bbox.width &&
      candidate.bbox.y + candidate.bbox.height <= below.bbox.y + below.bbox.height;
    if (fullyContained) {
      return true;
    }

    const overlapArea = intersects(candidate.bbox, below.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, candidate.area);
    if (overlapPortion >= 0.35) {
      return true;
    }
  }

  return false;
}

export function hasCandidateBelow(
  candidate: ElementCandidate,
  belowCandidates: ElementCandidate[],
): boolean {
  // Used to find content painted above surfaces we decided to dim.
  for (const below of belowCandidates) {
    if (below.paintIndex >= candidate.paintIndex) continue;
    if (isResourceElement(below.element)) continue;

    const overlapArea = intersects(candidate.bbox, below.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, candidate.area);
    if (overlapPortion >= Math.max(OVERLAP_THRESHOLD, 0.015)) {
      return true;
    }
  }

  return false;
}

export function isLineLikeCandidate(candidate: ElementCandidate): boolean {
  // Decorative lines are allowed to dim; regular controls should not. The tag
  // and aspect-ratio checks keep that distinction intentionally conservative.
  const tagName = candidate.element.tagName.toLowerCase();
  if (tagName === "line" || tagName === "polyline") return true;

  const width = Math.max(candidate.bbox.width, 1);
  const height = Math.max(candidate.bbox.height, 1);
  const aspectRatio = Math.max(width / height, height / width);
  const thinDimension = Math.min(width, height);

  if (tagName === "rect") {
    const hasDashArray = candidate.element.hasAttribute("stroke-dasharray");
    return hasDashArray || thinDimension <= 6 || aspectRatio >= 8;
  }

  if (tagName === "circle" || tagName === "ellipse") {
    return false;
  }

  if (tagName === "path" || tagName === "polygon") {
    const d = candidate.element.getAttribute("d");
    if (d && isConnectorLikePathData(d)) {
      return true;
    }
    return thinDimension <= 12 || aspectRatio >= 8;
  }

  return thinDimension <= 12 || aspectRatio >= 8;
}

export function canUseFillAsLinePaint(candidate: ElementCandidate): boolean {
  const tagName = candidate.element.tagName.toLowerCase();
  return tagName === "path" || tagName === "polygon" || tagName === "polyline";
}

export function extractGradientId(value: string): string | null {
  const match = value.match(/^url\(#(.+)\)$/i);
  return match ? match[1] : null;
}
