import {
  clamp,
  OklchColor,
  rgbToOklch,
  toCssOklch,
} from "@lib/utils/colorSpace";
import { dimLightSurfaceColorForDarkMode } from "@lib/utils/themeColor";
import {
  canUseFillAsLinePaint,
  collectCandidates,
  DARK_LIGHTNESS_THRESHOLD,
  extractGradientId,
  hasCandidateBelow,
  hasLightBelow,
  hasNonTransparentFilledBelow,
  hasStrongLightSurfaceSupportBelow,
  isDarkNeutralColor,
  LIGHT_ELEMENT_THRESHOLD,
  isLightNeutralColor,
  isLineLikeCandidate,
  isSuperLightColor,
  parseCssColor,
  PAINTABLE_SELECTOR,
  sanitizeSvg,
} from "@lib/utils/svgDarkModeUtils";

// Dark/neutral/light thresholds were tuned from the previous iteration of the
// SVG dark-mode work. They intentionally do not match the generic theme helper
// values exactly because SVG assets contain both UI surfaces and illustrations.
const SUPER_LIGHT_FILL_THRESHOLD = 0.9;
const NEUTRAL_THRESHOLD = 0.04;

function lightenDarkColor(value: string): string {
  // Default foreground lift used for dark text/shapes that sit on transparent
  // space and need to read on dark mode backgrounds.
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
  // Strong variant reserved for cases where dark text sits above a surface we
  // explicitly dimmed. This keeps contrast high after the background changes.
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

function dimSuperLightFillColor(value: string): string {
  // Reuse the shared dark-surface transform so SVG white cards and app cards
  // converge on the same dark-mode treatment.
  return dimLightSurfaceColorForDarkMode(value, {
    brightThreshold: SUPER_LIGHT_FILL_THRESHOLD,
    targetDarkLightness: 0.3,
    chromaScale: 0.82,
  });
}

function dimLightLineColor(value: string): string {
  // Decorative light strokes should recede in dark mode, but not as much as a
  // full surface panel.
  return dimLightSurfaceColorForDarkMode(value, {
    brightThreshold: LIGHT_ELEMENT_THRESHOLD,
    targetDarkLightness: 0.4,
    chromaScale: 0.7,
  });
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
  const shouldDimFillByElement = new Map<Element, boolean>();
  const shouldDimLineByElement = new Map<Element, boolean>();

  // Pass 1: detect exposed, very light filled surfaces that should become
  // darker in dark mode. A candidate is skipped when another visible filled
  // surface already sits underneath it, because that means it behaves like
  // foreground/detail content rather than an exposed panel.
  for (const candidate of candidates) {
    const tagName = candidate.element.tagName.toLowerCase();
    const shouldDimFill =
      tagName !== "text" &&
      candidate.hasFillPaint &&
      candidate.fillColor !== null &&
      isSuperLightColor(candidate.fillColor) &&
      !candidate.hasLightSurfaceBelow &&
      !hasNonTransparentFilledBelow(candidate, candidates);

    shouldDimFillByElement.set(candidate.element, shouldDimFill);

    const hasStandaloneLightStroke =
      candidate.strokeColor &&
      isLightNeutralColor(candidate.strokeColor) &&
      !candidate.hasFillPaint;
    const hasLineLikeLightFill =
      canUseFillAsLinePaint(candidate) &&
      candidate.fillColor &&
      isLightNeutralColor(candidate.fillColor);
    const lightStrokeLikePaint = hasStandaloneLightStroke || hasLineLikeLightFill;
    shouldDimLineByElement.set(candidate.element, false);
  }

  // Pass 2: dim only exposed decorative line geometry. This uses a stricter
  // "strong light surface support" test than the generic surface classifier:
  // small icon details fully inside a light control should stay unchanged,
  // while large dashed frames and connector arrows still dim even if light
  // cards exist somewhere inside their bounding box.
  for (const candidate of candidates) {
    const tagName = candidate.element.tagName.toLowerCase();
    const shouldDimFill = shouldDimFillByElement.get(candidate.element) === true;
    const isDecorativeStrokeRect =
      tagName === "rect" && candidate.element.hasAttribute("stroke-dasharray");
    const hasStandaloneLightStroke =
      candidate.strokeColor &&
      isLightNeutralColor(candidate.strokeColor) &&
      !candidate.hasFillPaint &&
      (tagName !== "rect" || isDecorativeStrokeRect);
    const hasLineLikeLightFill =
      canUseFillAsLinePaint(candidate) &&
      candidate.fillColor &&
      isLightNeutralColor(candidate.fillColor);
    const lightStrokeLikePaint = hasStandaloneLightStroke || hasLineLikeLightFill;
    const hasStrongLightSurfaceSupport = hasStrongLightSurfaceSupportBelow(
      candidate,
      candidates,
    );
    const shouldDimLine =
      tagName !== "text" &&
      !shouldDimFill &&
      !hasStrongLightSurfaceSupport &&
      Boolean(lightStrokeLikePaint) &&
      isLineLikeCandidate(candidate);

    shouldDimLineByElement.set(candidate.element, shouldDimLine);
  }

  const dimmedSurfaceCandidates = candidates.filter(
    (candidate) => shouldDimFillByElement.get(candidate.element) === true,
  );

  // Pass 3: lighten dark foreground only when it floats on transparent space,
  // or when it is painted above a surface we deliberately dimmed. The broader
  // "light support below" signal still tracks light strokes/fills separately
  // from the stricter filled-surface signals used in passes 1 and 2.
  for (const candidate of candidates) {
    const lightBelow = hasLightBelow(candidate, candidates);
    const filledBelow = hasNonTransparentFilledBelow(candidate, candidates);
    const dimmedSurfaceBelow = hasCandidateBelow(candidate, dimmedSurfaceCandidates);
    const supportedByLightSurface = candidate.hasLightSurfaceBelow;
    const faintBackgroundNeutral =
      candidate.hasDarkNeutralPaint && candidate.effectiveOpacity <= 0.12;
    const shouldLighten =
      (candidate.hasDarkNeutralPaint &&
        ((!lightBelow && !filledBelow) || faintBackgroundNeutral) &&
        !supportedByLightSurface) ||
      (!supportedByLightSurface &&
        dimmedSurfaceBelow &&
        (candidate.hasDarkPaint || candidate.hasDarkNeutralPaint));
    shouldLightenByElement.set(candidate.element, shouldLighten);
    strongLightenByElement.set(
      candidate.element,
      (faintBackgroundNeutral && !supportedByLightSurface) ||
        (!supportedByLightSurface &&
          dimmedSurfaceBelow &&
          (candidate.hasDarkPaint || candidate.hasDarkNeutralPaint)),
    );
  }

  const paintableElements = [
    ...svg.querySelectorAll<SVGGraphicsElement>(PAINTABLE_SELECTOR),
  ];

  const gradientsToLighten = new Set<string>();
  const gradientsToStronglyLighten = new Set<string>();

  paintableElements.forEach((element) => {
    const shouldLighten = shouldLightenByElement.get(element) || false;
    const strongLighten =
      shouldLighten &&
      ((strongLightenByElement.get(element) || false) ||
        element.tagName.toLowerCase() === "text");
    const shouldDimFill = shouldDimFillByElement.get(element) || false;
    const shouldDimLine = shouldDimLineByElement.get(element) || false;
    const candidate = candidateByElement.get(element);
    const target = element as Element;

    if (debug) {
      target.setAttribute("data-dark-should-lighten", shouldLighten ? "1" : "0");
      target.setAttribute(
        "data-dark-has-light-support-below",
        candidate && hasLightBelow(candidate, candidates) ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-dark-paint",
        candidate?.hasDarkPaint ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-light-surface-below",
        candidate?.hasLightSurfaceBelow ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-dark-neutral-paint",
        candidate?.hasDarkNeutralPaint ? "1" : "0",
      );
      target.setAttribute("data-dark-strong-lighten", strongLighten ? "1" : "0");
      target.setAttribute("data-dark-dim-fill", shouldDimFill ? "1" : "0");
      target.setAttribute("data-dark-dim-line", shouldDimLine ? "1" : "0");
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

      let next = value;
      if (attr === "fill" && shouldDimFill) {
        next = dimSuperLightFillColor(value);
      } else if (shouldDimLine) {
        next = dimLightLineColor(value);
      } else if (shouldLighten) {
        next = strongLighten
          ? stronglyLightenDarkColor(value)
          : lightenDarkColor(value);
      }

      if (next !== value) {
        target.setAttribute(attr, next);
      }
    });

    const style = target.getAttribute("style");
    if (!style) return;

    const transformedStyle = style.replace(
      /(fill|stroke)\s*:\s*([^;]+)(;?)/gi,
      (_, property: string, rawValue: string, semicolon: string) => {
        let next = rawValue.trim();
        if (property.toLowerCase() === "fill" && shouldDimFill) {
          next = dimSuperLightFillColor(next);
        } else if (shouldDimLine) {
          next = dimLightLineColor(next);
        } else if (shouldLighten) {
          next = strongLighten
            ? stronglyLightenDarkColor(next)
            : lightenDarkColor(next);
        }
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
