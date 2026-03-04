import { cn } from "@lib/utils/cn";
import { transformSvgMarkupForDarkMode } from "@lib/utils/svgDarkMode";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";

export interface SmartDarkSvgProps {
  src: string;
  svgCode?: string;
  autoDark?: boolean;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
}

function SmartDarkSvg({
  src,
  svgCode,
  autoDark = true,
  alt,
  className,
  width,
  height,
  onLoad,
}: SmartDarkSvgProps) {
  const { resolvedTheme } = useTheme();
  const [rawSvg, setRawSvg] = useState<string>("");
  const [error, setError] = useState(false);

  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    if (svgCode) {
      setError(false);
      setRawSvg(svgCode);
      return;
    }

    let cancelled = false;

    const loadSvg = async () => {
      try {
        setError(false);
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Cannot fetch SVG: ${response.status}`);
        }
        const text = await response.text();
        if (!cancelled) {
          setRawSvg(text);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setRawSvg("");
        }
      }
    };

    loadSvg();

    return () => {
      cancelled = true;
    };
  }, [src, svgCode]);

  const transformedSvg = useMemo(() => {
    if (!rawSvg) return "";
    return transformSvgMarkupForDarkMode(rawSvg, autoDark && isDarkMode, true);
  }, [rawSvg, autoDark, isDarkMode]);

  useEffect(() => {
    if (transformedSvg && onLoad) {
      onLoad();
    }
  }, [transformedSvg, onLoad]);

  const hasNumericWidth = typeof width === "number";
  const hasNumericHeight = typeof height === "number";

  const wrapperStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: hasNumericWidth ? `${width}px` : width,
    aspectRatio:
      hasNumericWidth && hasNumericHeight ? `${width} / ${height}` : undefined,
    height: hasNumericHeight ? "auto" : height,
  };

  if (error) return null;

  return (
    <span
      className={cn(
        "block max-w-full [&>svg]:block [&>svg]:max-w-full",
        "[&>svg]:h-auto [&>svg]:w-full",
        className,
      )}
      style={wrapperStyle}
      role="img"
      aria-label={alt || "SVG image"}
      dangerouslySetInnerHTML={{ __html: transformedSvg }}
    />
  );
}

export default SmartDarkSvg;
