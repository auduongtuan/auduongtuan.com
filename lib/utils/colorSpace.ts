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

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function srgbToLinear(v: number): number {
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function rgbToOklch({ r, g, b }: ParsedColor): OklchColor {
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

export function toCssOklch(color: OklchColor, alpha = 1): string {
  const l = clamp(color.l, 0, 1);
  const c = Math.max(color.c, 0);
  const h = Number.isFinite(color.h) ? color.h : 0;
  const a = clamp(alpha, 0, 1);

  if (a >= 0.999) {
    return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`;
  }
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)} / ${a.toFixed(3)})`;
}

