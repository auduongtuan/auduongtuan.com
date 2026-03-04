const MAX_PROCESSABLE_NODES = 180;
const PAINTABLE_SELECTOR =
  "path,rect,circle,ellipse,polygon,polyline,line,text,use";
const DARK_LIGHTNESS_THRESHOLD = 0.56;
const LIGHT_ELEMENT_THRESHOLD = 0.72;
const OVERLAP_THRESHOLD = 0.02;
const NEUTRAL_THRESHOLD = 0.04;

type ParsedColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type OklchColor = {
  l: number;
  c: number;
  h: number;
};

type ElementCandidate = {
  element: SVGGraphicsElement;
  bbox: DOMRect;
  area: number;
  paintIndex: number;
  parsedPaintColors: ParsedColor[];
  effectiveOpacity: number;
  hasLightPaint: boolean;
  hasDarkPaint: boolean;
  hasDarkNeutralPaint: boolean;
};

let colorParserElement: HTMLSpanElement | null = null;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

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

function parseCssColor(value: string): ParsedColor | null {
  if (isNonTransformableColor(value)) return null;

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

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function rgbToOklch({ r, g, b }: ParsedColor): OklchColor {
  const rLinear = srgbToLinear(r / 255);
  const gLinear = srgbToLinear(g / 255);
  const bLinear = srgbToLinear(b / 255);

  const l = Math.cbrt(
    0.4122214708 * rLinear + 0.5363325363 * gLinear + 0.0514459929 * bLinear,
  );
  const m = Math.cbrt(
    0.2119034982 * rLinear + 0.6806995451 * gLinear + 0.1073969566 * bLinear,
  );
  const s = Math.cbrt(
    0.0883024619 * rLinear + 0.2817188376 * gLinear + 0.6299787005 * bLinear,
  );

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bComponent = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const c = Math.sqrt(a * a + bComponent * bComponent);
  const rawHue = (Math.atan2(bComponent, a) * 180) / Math.PI;

  return {
    l: L,
    c,
    h: rawHue < 0 ? rawHue + 360 : rawHue,
  };
}

function toCssOklch(color: OklchColor, alpha = 1): string {
  const l = clamp(color.l, 0, 1);
  const c = Math.max(color.c, 0);
  const h = Number.isFinite(color.h) ? color.h : 0;
  const a = clamp(alpha, 0, 1);

  if (a >= 0.999) {
    return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
  }
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)} / ${a.toFixed(3)})`;
}

function isDarkColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l < DARK_LIGHTNESS_THRESHOLD;
}

function isLightColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l >= LIGHT_ELEMENT_THRESHOLD;
}

function isDarkNeutralColor(parsed: ParsedColor): boolean {
  const oklch = rgbToOklch(parsed);
  return oklch.l < DARK_LIGHTNESS_THRESHOLD && oklch.c <= 0.08;
}

function lightenDarkColor(value: string): string {
  const parsed = parseCssColor(value);
  if (!parsed) return value;

  const oklch = rgbToOklch(parsed);
  if (oklch.l >= DARK_LIGHTNESS_THRESHOLD) return value;

  const transformed: OklchColor =
    oklch.c < NEUTRAL_THRESHOLD
      ? {
          l: clamp(oklch.l + 0.32, 0, 0.88),
          c: oklch.c,
          h: oklch.h,
        }
      : {
          l: clamp(oklch.l + 0.26, 0, 0.84),
          c: clamp(oklch.c * 0.92, 0, 0.34),
          h: oklch.h,
        };

  return toCssOklch(transformed, parsed.a);
}

function stronglyLightenDarkColor(value: string): string {
  const parsed = parseCssColor(value);
  if (!parsed) return value;

  const oklch = rgbToOklch(parsed);
  if (oklch.l >= DARK_LIGHTNESS_THRESHOLD) return value;

  const transformed: OklchColor =
    oklch.c < NEUTRAL_THRESHOLD
      ? {
          l: 0.92,
          c: oklch.c,
          h: oklch.h,
        }
      : {
          l: clamp(oklch.l + 0.42, 0, 0.9),
          c: clamp(oklch.c * 0.9, 0, 0.34),
          h: oklch.h,
        };

  return toCssOklch(transformed, parsed.a);
}

export function transformForegroundColorForDarkMode(value: string): string {
  return lightenDarkColor(value);
}

export function transformBackgroundColorForDarkMode(value: string): string {
  return lightenDarkColor(value);
}

function sanitizeSvg(doc: Document): void {
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

  return null;
}

function getTransformedBBox(element: SVGGraphicsElement): DOMRect {
  let bbox: DOMRect;
  try {
    bbox = element.getBBox();
  } catch {
    const attrBBox = getAttributeBBox(element);
    if (!attrBBox) {
      throw new Error("Cannot resolve bbox");
    }
    bbox = attrBBox;
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

function intersects(a: DOMRect, b: DOMRect): number {
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

function collectCandidates(svg: SVGSVGElement): ElementCandidate[] {
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

      const parsedPaintColors = extractPaintColors(element);
      const effectiveOpacity = getEffectiveOpacity(element);
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
        hasLightPaint,
        hasDarkPaint,
        hasDarkNeutralPaint,
      });
    } catch {
      // skip invalid geometry
    }
  }

  return candidates;
}

function hasLightBelow(
  candidate: ElementCandidate,
  allCandidates: ElementCandidate[],
): boolean {
  for (const below of allCandidates) {
    if (below.paintIndex >= candidate.paintIndex) continue;
    if (!below.hasLightPaint) continue;
    // Background-like support should be sufficiently visible.
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

function extractGradientId(value: string): string | null {
  const match = value.match(/^url\(#(.+)\)$/i);
  return match ? match[1] : null;
}

export function transformSvgMarkupForDarkMode(
  svgMarkup: string,
  enabled: boolean,
  debug: boolean = false,
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgMarkup, "image/svg+xml");

  if (doc.querySelector("parsererror")) {
    return svgMarkup;
  }

  sanitizeSvg(doc);

  if (!enabled) {
    return new XMLSerializer().serializeToString(doc.documentElement);
  }

  const root = doc.documentElement;
  if (root.tagName.toLowerCase() !== "svg") {
    return svgMarkup;
  }
  const svg = root as unknown as SVGSVGElement;

  const candidates = collectCandidates(svg);
  const candidateByElement = new Map(
    candidates.map((candidate) => [candidate.element, candidate]),
  );

  const shouldLightenByElement = new Map<Element, boolean>();
  const strongLightenByElement = new Map<Element, boolean>();

  for (const candidate of candidates) {
    const lightBelow = hasLightBelow(candidate, candidates);
    const faintBackgroundNeutral =
      candidate.hasDarkNeutralPaint && candidate.effectiveOpacity <= 0.12;
    const shouldLighten =
      candidate.hasDarkNeutralPaint && (!lightBelow || faintBackgroundNeutral);
    shouldLightenByElement.set(candidate.element, shouldLighten);
    strongLightenByElement.set(candidate.element, faintBackgroundNeutral);
  }

  const paintableElements = [
    ...svg.querySelectorAll<SVGGraphicsElement>(PAINTABLE_SELECTOR),
  ];

  const gradientsToLighten = new Set<string>();
  const gradientsToStronglyLighten = new Set<string>();

  paintableElements.forEach((element) => {
    const shouldLighten = shouldLightenByElement.get(element) || false;
    const strongLighten = strongLightenByElement.get(element) || false;
    const candidate = candidateByElement.get(element);
    const target = element as Element;

    if (debug) {
      target.setAttribute("data-dark-should-lighten", shouldLighten ? "1" : "0");
      target.setAttribute(
        "data-dark-has-light-below",
        candidate && hasLightBelow(candidate, candidates) ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-dark-paint",
        candidate?.hasDarkPaint ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-dark-neutral-paint",
        candidate?.hasDarkNeutralPaint ? "1" : "0",
      );
      target.setAttribute("data-dark-strong-lighten", strongLighten ? "1" : "0");
    }

    ["fill", "stroke"].forEach((attr) => {
      const value = target.getAttribute(attr);
      if (!value) return;

      const gradientId = extractGradientId(value.trim());
      if (gradientId && shouldLighten) {
        gradientsToLighten.add(gradientId);
        if (strongLighten) {
          gradientsToStronglyLighten.add(gradientId);
        }
      }

      if (!shouldLighten) return;
      const next = strongLighten
        ? stronglyLightenDarkColor(value)
        : lightenDarkColor(value);
      if (next !== value) {
        target.setAttribute(attr, next);
      }
    });

    const style = target.getAttribute("style");
    if (!style) return;

    const transformedStyle = style.replace(
      /(fill|stroke)\s*:\s*([^;]+)(;?)/gi,
      (_, property: string, rawValue: string, semicolon: string) => {
        if (!shouldLighten) return `${property}:${rawValue}${semicolon}`;
        const next = strongLighten
          ? stronglyLightenDarkColor(rawValue.trim())
          : lightenDarkColor(rawValue.trim());
        return `${property}:${next}${semicolon}`;
      },
    );

    if (transformedStyle !== style) {
      target.setAttribute("style", transformedStyle);
    }
  });

  doc.querySelectorAll("stop").forEach((stopEl) => {
    const parentGradient = stopEl.parentElement;
    const gradientId = parentGradient?.id;
    if (!gradientId || !gradientsToLighten.has(gradientId)) return;
    const strongGradient = gradientsToStronglyLighten.has(gradientId);

    const stopColor = stopEl.getAttribute("stop-color");
    if (stopColor) {
      const next = strongGradient
        ? stronglyLightenDarkColor(stopColor)
        : lightenDarkColor(stopColor);
      if (next !== stopColor) {
        stopEl.setAttribute("stop-color", next);
      }
    }

    const style = stopEl.getAttribute("style");
    if (style) {
      const transformedStyle = style.replace(
        /(stop-color)\s*:\s*([^;]+)(;?)/gi,
        (_, property: string, rawValue: string, semicolon: string) => {
          const next = strongGradient
            ? stronglyLightenDarkColor(rawValue.trim())
            : lightenDarkColor(rawValue.trim());
          return `${property}:${next}${semicolon}`;
        },
      );

      if (transformedStyle !== style) {
        stopEl.setAttribute("style", transformedStyle);
      }
    }
  });

  return new XMLSerializer().serializeToString(doc.documentElement);
}
