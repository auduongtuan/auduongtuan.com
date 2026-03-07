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
export const SUPER_LIGHT_FILL_THRESHOLD = 0.8;
export const OVERLAP_THRESHOLD = 0.02;
export const FILLED_OVERLAP_THRESHOLD = 0.04;

type SvgPoint = { x: number; y: number };

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

export function isPureWhiteColor(parsed: ParsedColor): boolean {
  return parsed.r >= 250 && parsed.g >= 250 && parsed.b >= 250;
}

export function isLightNeutralColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l >= LIGHT_ELEMENT_THRESHOLD && oklch.c <= 0.08;
}

export function sanitizeSvg(doc: Document): void {
  doc
    .querySelectorAll("script, foreignObject")
    .forEach((node) => node.remove());

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

function parseSvgNumber(
  value: string | null | undefined,
  fallback = 0,
): number {
  if (!value) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseFontSize(element: SVGGraphicsElement, fallback = 16): number {
  const direct = parseSvgNumber(element.getAttribute("font-size"), fallback);
  if (direct !== fallback || element.hasAttribute("font-size")) return direct;

  const style = element.getAttribute("style");
  if (style) {
    const match = style.match(/font-size\s*:\s*([0-9.]+)/i);
    if (match) {
      const parsed = Number(match[1]);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
  }

  return fallback;
}

function estimateTextWidth(text: string, fontSize: number): number {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) return 0;
  return trimmed.length * fontSize * 0.56;
}

function getTextAttributeBBox(element: SVGGraphicsElement): DOMRect | null {
  const fontSize = parseFontSize(element, 16);
  const tspans = [...element.querySelectorAll("tspan")];

  if (tspans.length > 0) {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;

    for (const tspan of tspans) {
      const text = tspan.textContent ?? "";
      const width = estimateTextWidth(text, fontSize);
      if (width <= 0) continue;

      const x = parseSvgNumber(tspan.getAttribute("x"), Number.NaN);
      const y = parseSvgNumber(tspan.getAttribute("y"), Number.NaN);
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y - fontSize);
      maxX = Math.max(maxX, x + width);
      maxY = Math.max(maxY, y + fontSize * 0.3);
    }

    if (
      Number.isFinite(minX) &&
      Number.isFinite(minY) &&
      Number.isFinite(maxX) &&
      Number.isFinite(maxY) &&
      maxX > minX &&
      maxY > minY
    ) {
      return new DOMRect(minX, minY, maxX - minX, maxY - minY);
    }
  }

  const text = element.textContent ?? "";
  const width = estimateTextWidth(text, fontSize);
  if (width <= 0) return null;

  const x = parseSvgNumber(element.getAttribute("x"), Number.NaN);
  const y = parseSvgNumber(element.getAttribute("y"), Number.NaN);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;

  return new DOMRect(x, y - fontSize, width, fontSize * 1.3);
}

function getPathPointsFromData(d: string): SvgPoint[] | null {
  const tokens = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);
  if (!tokens || tokens.length === 0) return null;

  let index = 0;
  let command = "";
  let currentX = 0;
  let currentY = 0;
  let startX = 0;
  let startY = 0;
  const points: SvgPoint[] = [];

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
      const values = Array.from({ length: 4 }, () => readNumber());
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

    return null;
  }

  return points.length > 0 ? points : null;
}

function getPathAttributeBBox(d: string): DOMRect | null {
  const points = getPathPointsFromData(d);
  if (!points) return null;
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
  const points = getPathPointsFromData(d);
  if (!points) return false;
  if (points.length < 3) return false;

  let longAxisAlignedSegments = 0;
  let longSegments = 0;
  let shortDiagonalSegments = 0;

  for (let i = 1; i < points.length; i += 1) {
    const dx = Math.abs(points[i].x - points[i - 1].x);
    const dy = Math.abs(points[i].y - points[i - 1].y);
    const length = Math.hypot(dx, dy);
    if (length <= 0) continue;

    if (length >= 18) {
      longSegments += 1;
    }

    if ((dx >= 18 && dy <= 6) || (dy >= 18 && dx <= 6)) {
      longAxisAlignedSegments += 1;
    } else if (length <= 18 && dx > 0 && dy > 0) {
      shortDiagonalSegments += 1;
    }
  }

  // This remains only a fallback signal for path-based connectors. It keeps
  // arrow-like geometry eligible without being the primary source of truth for
  // line support/dimming decisions.
  return (
    (longAxisAlignedSegments >= 1 || longSegments >= 1) &&
    shortDiagonalSegments >= 1
  );
}

function parsePointList(value: string): SvgPoint[] {
  return value
    .trim()
    .split(/\s+/)
    .map((pair) => pair.split(",").map(Number))
    .filter((pair) => pair.length === 2 && pair.every(Number.isFinite))
    .map(([x, y]) => ({ x, y }));
}

function pointInsideRect(point: SvgPoint, rect: DOMRect): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

function getCandidatePolylinePoints(
  candidate: ElementCandidate,
): SvgPoint[] | null {
  const tagName = candidate.element.tagName.toLowerCase();

  if (tagName === "line") {
    return [
      {
        x: parseSvgNumber(candidate.element.getAttribute("x1"), 0),
        y: parseSvgNumber(candidate.element.getAttribute("y1"), 0),
      },
      {
        x: parseSvgNumber(candidate.element.getAttribute("x2"), 0),
        y: parseSvgNumber(candidate.element.getAttribute("y2"), 0),
      },
    ];
  }

  if (tagName === "polyline" || tagName === "polygon") {
    const rawPoints = candidate.element.getAttribute("points");
    if (!rawPoints) return null;
    const points = parsePointList(rawPoints);
    if (tagName === "polygon" && points.length > 0) {
      points.push(points[0]);
    }
    return points.length >= 2 ? points : null;
  }

  if (tagName === "rect") {
    const x = parseSvgNumber(candidate.element.getAttribute("x"), 0);
    const y = parseSvgNumber(candidate.element.getAttribute("y"), 0);
    const width = parseSvgNumber(candidate.element.getAttribute("width"), 0);
    const height = parseSvgNumber(candidate.element.getAttribute("height"), 0);
    if (width <= 0 || height <= 0) return null;
    return [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y },
    ];
  }

  if (tagName === "path") {
    const d = candidate.element.getAttribute("d");
    if (!d) return null;
    const points = getPathPointsFromData(d);
    return points && points.length >= 2 ? points : null;
  }

  return null;
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

  if (tag === "text") {
    return getTextAttributeBBox(element);
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
  const fill =
    element.getAttribute("data-original-fill") ?? element.getAttribute("fill");
  const stroke =
    element.getAttribute("data-original-stroke") ?? element.getAttribute("stroke");
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
  const direct =
    element.getAttribute(`data-original-${attr}`) ?? element.getAttribute(attr);
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
  const nodes = [
    ...svg.querySelectorAll<SVGGraphicsElement>(PAINTABLE_SELECTOR),
  ].slice(0, MAX_PROCESSABLE_NODES);

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
      const hasLightPaint = parsedPaintColors.some((color) =>
        isLightColor(color),
      );
      const hasDarkPaint = parsedPaintColors.some((color) =>
        isDarkColor(color),
      );
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
    candidate.hasLightSurfaceBelow = hasLightSurfaceBelow(
      candidate,
      candidates,
    );
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

function getLightSurfaceCandidatesBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): ElementCandidate[] {
  return allCandidates.filter((below) => {
    return (
      below.paintIndex < candidate.paintIndex &&
      !isResourceElement(below.element) &&
      below.hasFillPaint &&
      Boolean(below.fillColor && isLightColor(below.fillColor)) &&
      below.effectiveOpacity >= 0.5
    );
  });
}

function getSampledBoxSupportRatio(
  candidate: ElementCandidate,
  surfaces: ElementCandidate[],
): number {
  if (surfaces.length === 0) return 0;

  const { x, y, width, height } = candidate.bbox;
  const insetX = width * 0.2;
  const insetY = height * 0.2;
  const samplePoints: SvgPoint[] = [
    { x: x + width / 2, y: y + height / 2 },
    { x: x + insetX, y: y + insetY },
    { x: x + width - insetX, y: y + insetY },
    { x: x + insetX, y: y + height - insetY },
    { x: x + width - insetX, y: y + height - insetY },
  ];

  let insideCount = 0;
  for (const point of samplePoints) {
    if (surfaces.some((surface) => pointInsideRect(point, surface.bbox))) {
      insideCount += 1;
    }
  }

  return insideCount / samplePoints.length;
}

function getLineSupportRatio(
  candidate: ElementCandidate,
  surfaces: ElementCandidate[],
): number {
  const points = getCandidatePolylinePoints(candidate);
  if (!points || points.length < 2 || surfaces.length === 0) return 0;

  let supportedLength = 0;
  let totalLength = 0;

  for (let i = 1; i < points.length; i += 1) {
    const start = points[i - 1];
    const end = points[i];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);
    if (length <= 0) continue;

    totalLength += length;

    const segmentSamples: SvgPoint[] = [0.25, 0.5, 0.75].map((t) => ({
      x: start.x + dx * t,
      y: start.y + dy * t,
    }));

    let localSupport = 0;
    for (const point of segmentSamples) {
      if (surfaces.some((surface) => pointInsideRect(point, surface.bbox))) {
        localSupport += 1;
      }
    }

    supportedLength += length * (localSupport / segmentSamples.length);
  }

  return totalLength > 0 ? supportedLength / totalLength : 0;
}

export function hasLightSurfaceBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // "Light surface below" is the broad local-support signal used by the later
  // passes. It asks: does this element sit on a nearby light filled surface?
  //
  // Rules:
  // - only earlier painted filled surfaces count
  // - support is sampled locally, not from raw bbox-overlap percentages
  // - line-like geometry samples along the line itself
  // - other geometry samples points inside the candidate box
  const surfaces = getLightSurfaceCandidatesBelow(candidate, allCandidates);
  if (surfaces.length === 0) return false;

  if (isLineLikeCandidate(candidate)) {
    return getLineSupportRatio(candidate, surfaces) >= 0.3;
  }

  return getSampledBoxSupportRatio(candidate, surfaces) >= 0.6;
}

export function hasStrongLightSurfaceSupportBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // Strong support is the stricter variant used only to block decorative-line
  // dimming. It answers: is this line mostly carried by a light surface rather
  // than merely touching one part of it?
  const surfaces = getLightSurfaceCandidatesBelow(candidate, allCandidates);
  if (surfaces.length === 0) return false;

  if (isLineLikeCandidate(candidate)) {
    return getLineSupportRatio(candidate, surfaces) >= 0.72;
  }

  return getSampledBoxSupportRatio(candidate, surfaces) >= 0.8;
}

export function hasCandidateBelow(
  candidate: ElementCandidate,
  belowCandidates: ElementCandidate[],
): boolean {
  // Generic "painted below me" check used after pass 1 to find content sitting
  // above surfaces we decided to dim.
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

export function hasCandidateAbove(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // Surfaces should only dim when they actually carry painted content above
  // them. This prevents isolated light circles/blobs/cards from darkening just
  // because they are bright.
  for (const above of allCandidates) {
    if (above.paintIndex <= candidate.paintIndex) continue;
    if (isResourceElement(above.element)) continue;

    const overlapArea = intersects(candidate.bbox, above.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, above.area);
    if (overlapPortion >= Math.max(OVERLAP_THRESHOLD, 0.015)) {
      return true;
    }
  }

  return false;
}

export function hasMostlySuperLightContentAbove(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  // If most of the overlapping content above a surface is already super-light,
  // dimming the surface would usually reduce contrast instead of improving it.
  // This is the final guard in pass 1 that preserves light-on-light hero/logo
  // treatments from being inverted unnecessarily.
  let totalOverlap = 0;
  let superLightOverlap = 0;

  for (const above of allCandidates) {
    if (above.paintIndex <= candidate.paintIndex) continue;
    if (isResourceElement(above.element)) continue;

    const overlapArea = intersects(candidate.bbox, above.bbox);
    if (overlapArea <= 0) continue;

    const overlapPortion = overlapArea / Math.max(1, above.area);
    if (overlapPortion < Math.max(OVERLAP_THRESHOLD, 0.015)) continue;

    totalOverlap += overlapArea;
    if (above.parsedPaintColors.some((color) => isSuperLightColor(color))) {
      superLightOverlap += overlapArea;
    }
  }

  if (totalOverlap <= 0) return false;
  return superLightOverlap / totalOverlap >= 0.6;
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
    return thinDimension <= 12 || aspectRatio >= 6;
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
