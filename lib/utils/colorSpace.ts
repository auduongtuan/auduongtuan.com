export type ParsedColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type OklchColor = {
  l: number;
  c: number;
  h: number;
};

// Shared numeric guard used by both the generic theme helpers and SVG transforms.
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(v: number): number {
  return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
}

export function rgbToOklch({ r, g, b }: ParsedColor): OklchColor {
  // Convert sRGB into OKLCH so light/dark adjustments happen in a perceptual space.
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

export function oklchToRgb(
  { l, c, h }: OklchColor,
  alpha = 1,
): ParsedColor {
  // Inverse conversion used when callers provide OKLCH input that must be parsed
  // back into normalized RGB channels for internal comparisons.
  const hueRadians = ((Number.isFinite(h) ? h : 0) * Math.PI) / 180;
  const a = c * Math.cos(hueRadians);
  const bComponent = c * Math.sin(hueRadians);

  const lComponent = Math.pow(
    l + 0.3963377774 * a + 0.2158037573 * bComponent,
    3,
  );
  const mComponent = Math.pow(
    l - 0.1055613458 * a - 0.0638541728 * bComponent,
    3,
  );
  const sComponent = Math.pow(
    l - 0.0894841775 * a - 1.291485548 * bComponent,
    3,
  );

  const rLinear =
    4.0767416621 * lComponent -
    3.3077115913 * mComponent +
    0.2309699292 * sComponent;
  const gLinear =
    -1.2684380046 * lComponent +
    2.6097574011 * mComponent -
    0.3413193965 * sComponent;
  const bLinear =
    -0.0041960863 * lComponent -
    0.7034186147 * mComponent +
    1.707614701 * sComponent;

  return {
    r: clamp(Math.round(linearToSrgb(rLinear) * 255), 0, 255),
    g: clamp(Math.round(linearToSrgb(gLinear) * 255), 0, 255),
    b: clamp(Math.round(linearToSrgb(bLinear) * 255), 0, 255),
    a: clamp(alpha, 0, 1),
  };
}

export function toCssOklch(color: OklchColor, alpha = 1): string {
  // Preserve OKLCH output all the way to CSS so downstream transforms do not
  // collapse back into RGB and lose perceptual intent.
  const l = clamp(color.l, 0, 1);
  const c = Math.max(color.c, 0);
  const h = Number.isFinite(color.h) ? color.h : 0;
  const a = clamp(alpha, 0, 1);

  if (a >= 0.999) {
    return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
  }
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)} / ${a.toFixed(3)})`;
}
