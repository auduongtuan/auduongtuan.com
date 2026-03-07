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
  hasCandidateAbove,
  hasCandidateBelow,
  hasLightBelow,
  hasMostlySuperLightContentAbove,
  hasNonTransparentFilledBelow,
  hasStrongLightSurfaceSupportBelow,
  isDarkNeutralColor,
  LIGHT_ELEMENT_THRESHOLD,
  isLightNeutralColor,
  isLineLikeCandidate,
  isPureWhiteColor,
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
    force: true,
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

function preserveOriginalPaint(target: Element, attr: "fill" | "stroke", value: string) {
  const originalAttr = `data-original-${attr}`;
  if (!target.hasAttribute(originalAttr)) {
    target.setAttribute(originalAttr, value);
  }
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

  // Pass 1: dim filled "panel-like" surfaces only when all of these are true:
  // - the element is a non-text filled shape
  // - the fill is super-light, but not pure white
  // - the shape actually carries painted content above it
  // - there is no light/filled surface below that would make this shape behave
  //   like foreground/detail content instead of an exposed panel
  //
  // This keeps dark mode focused on cards/chips/panels that need a darker
  // backdrop, while leaving isolated decorative light blobs and white badges
  // alone.
  for (const candidate of candidates) {
    const tagName = candidate.element.tagName.toLowerCase();
    const shouldDimFill =
      tagName !== "text" &&
      candidate.hasFillPaint &&
      candidate.fillColor !== null &&
      isSuperLightColor(candidate.fillColor) &&
      !isPureWhiteColor(candidate.fillColor) &&
      hasCandidateAbove(candidate, candidates) &&
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

  // Pass 2: dim only exposed decorative line geometry.
  //
  // Rules:
  // - never dim text here
  // - never dim line-like content that is actually carried by a light surface
  // - allow true decorative strokes/connectors/frames to recede in dark mode
  //
  // The support check here is intentionally stricter than the generic
  // light-surface check, so tiny icon details inside a light control are
  // preserved while long dashed frames and connectors can still dim.
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

  // Pass 3: lighten/reverse foreground when dark content would otherwise sit on
  // an unsuitable dark-mode backdrop.
  //
  // There are two supported cases:
  // - dark neutral content floating on transparent/dark space
  // - dark content painted above a surface we deliberately dimmed in pass 1
  //
  // Raw "light surface below" is not enough to block this pass when that
  // supporting surface has itself been selected for dimming. In that case the
  // foreground should reverse against the new darkened panel.
  for (const candidate of candidates) {
    const lightBelow = hasLightBelow(candidate, candidates);
    const filledBelow = hasNonTransparentFilledBelow(candidate, candidates);
    const dimmedSurfaceBelow = hasCandidateBelow(candidate, dimmedSurfaceCandidates);
    // Once a supporting light surface is selected for dimming, dark foreground
    // above it should be allowed to reverse/lighten against the new darkened
    // panel rather than staying locked to the original light-surface rule.
    const supportedByLightSurface =
      candidate.hasLightSurfaceBelow && !dimmedSurfaceBelow;
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
      // Debug attrs intentionally expose both raw and effective support:
      // - raw: what the original geometry/color analysis found
      // - effective: what remains true after dimmed-surface overrides
      target.setAttribute(
        "data-dark-has-light-surface-below",
        candidate?.hasLightSurfaceBelow ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-content-above",
        candidate && hasCandidateAbove(candidate, candidates) ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-has-mostly-super-light-content-above",
        candidate && hasMostlySuperLightContentAbove(candidate, candidates)
          ? "1"
          : "0",
      );
      target.setAttribute(
        "data-dark-dimmed-surface-below",
        candidate && hasCandidateBelow(candidate, dimmedSurfaceCandidates) ? "1" : "0",
      );
      target.setAttribute(
        "data-dark-supported-by-light-surface",
        candidate &&
          candidate.hasLightSurfaceBelow &&
          !hasCandidateBelow(candidate, dimmedSurfaceCandidates)
          ? "1"
          : "0",
      );
      target.setAttribute(
        "data-dark-has-dark-neutral-paint",
        candidate?.hasDarkNeutralPaint ? "1" : "0",
      );
      target.setAttribute("data-dark-strong-lighten", strongLighten ? "1" : "0");
      target.setAttribute("data-dark-dim-fill", shouldDimFill ? "1" : "0");
      target.setAttribute("data-dark-dim-line", shouldDimLine ? "1" : "0");
    }

    (["fill", "stroke"] as const).forEach((attr) => {
      const value = target.getAttribute(attr);
      if (!value) return;
      preserveOriginalPaint(target, attr, value);

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
          const normalizedProperty = property.toLowerCase() as "fill" | "stroke";
          preserveOriginalPaint(target, normalizedProperty, next);
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
