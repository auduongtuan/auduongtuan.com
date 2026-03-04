import {
  clamp,
  ParsedColor,
  OklchColor,
  rgbToOklch,
  toCssOklch,
} from "@lib/utils/colorSpace";

type ResolveThemedTextColorOptions = {
  preserveInDark?: boolean;
  minDarkLightness?: number;
  chromaScale?: number;
};

type ResolveThemedSurfaceColorOptions = {
  preserveInDark?: boolean;
  brightThreshold?: number;
  targetDarkLightness?: number;
  chromaScale?: number;
};

function parseHexColor(value: string): ParsedColor | null {
  const normalized = value.trim();
  if (!normalized.startsWith("#")) return null;

  const hex = normalized.slice(1);
  if (hex.length === 3 || hex.length === 4) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    const a = hex.length === 4 ? parseInt(hex[3] + hex[3], 16) / 255 : 1;
    return { r, g, b, a };
  }

  if (hex.length === 6 || hex.length === 8) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  return null;
}

function parseRgbColor(value: string): ParsedColor | null {
  const match = value
    .trim()
    .match(
      /rgba?\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*[,/]\s*(\d+(?:\.\d+)?))?\)/i,
    );
  if (!match) return null;

  return {
    r: clamp(Number(match[1]), 0, 255),
    g: clamp(Number(match[2]), 0, 255),
    b: clamp(Number(match[3]), 0, 255),
    a: match[4] === undefined ? 1 : clamp(Number(match[4]), 0, 1),
  };
}

function parseColor(value: string): ParsedColor | null {
  return parseHexColor(value) ?? parseRgbColor(value);
}

export function resolveThemedTextColor(
  color: string,
  theme: string | undefined,
  options: ResolveThemedTextColorOptions = {},
): string {
  const {
    preserveInDark = false,
    minDarkLightness = 0.72,
    chromaScale = 0.93,
  } = options;

  if (theme !== "dark" || preserveInDark) return color;

  const parsed = parseColor(color);
  if (!parsed) return color;

  const oklch = rgbToOklch(parsed);
  if (oklch.l >= minDarkLightness) return color;

  const transformed: OklchColor = {
    l: clamp(Math.max(oklch.l + 0.22, minDarkLightness), 0, 0.92),
    c: oklch.c > 0.04 ? clamp(oklch.c * chromaScale, 0, 0.34) : oklch.c,
    h: oklch.h,
  };

  return toCssOklch(transformed, parsed.a);
}

export function resolveThemedSurfaceColor(
  color: string,
  theme: string | undefined,
  options: ResolveThemedSurfaceColorOptions = {},
): string {
  const {
    preserveInDark = false,
    brightThreshold = 0.68,
    targetDarkLightness = 0.3,
    chromaScale = 0.82,
  } = options;

  if (theme !== "dark" || preserveInDark) return color;

  const parsed = parseColor(color);
  if (!parsed) return color;

  const oklch = rgbToOklch(parsed);
  if (oklch.l <= brightThreshold) return color;

  const transformed: OklchColor = {
    l: clamp(targetDarkLightness, 0.16, 0.5),
    c: oklch.c > 0.04 ? clamp(oklch.c * chromaScale, 0, 0.28) : oklch.c,
    h: oklch.h,
  };

  return toCssOklch(transformed, parsed.a);
}
