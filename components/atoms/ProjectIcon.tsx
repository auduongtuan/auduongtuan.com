import { cn } from "@lib/utils/cn";
import CustomImage from "./CustomImage";

type ProjectIconProps = {
  src: string;
  alt: string;
  size: number;
  mobileSize?: number;
  className?: string;
};

const PROJECT_ICON_RADIUS_RATIO = 16 / 72;

export default function ProjectIcon({
  src,
  alt,
  size,
  mobileSize,
  className,
}: ProjectIconProps) {
  const radius = Math.round(size * PROJECT_ICON_RADIUS_RATIO + 1);
  const mobileRadius = mobileSize
    ? Math.round(mobileSize * PROJECT_ICON_RADIUS_RATIO + 1)
    : radius;

  const cssVars = {
    "--pi-size": `${mobileSize ?? size}px`,
    "--pi-radius": `${mobileRadius}px`,
    "--pi-size-md": `${size}px`,
    "--pi-radius-md": `${radius}px`,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        "relative shrink-0 grow-0 self-start overflow-hidden",
        "h-(--pi-size) w-(--pi-size) rounded-(--pi-radius)",
        mobileSize &&
          "md:h-(--pi-size-md) md:w-(--pi-size-md) md:rounded-(--pi-radius-md)",
        className,
      )}
      style={cssVars}
    >
      <CustomImage
        src={src}
        width={size}
        height={size}
        alt={alt}
        autoDarkSvg={false}
        className="h-full w-full"
      />
      <span
        className="pointer-events-none absolute inset-0 z-20 rounded-(--pi-radius) md:rounded-(--pi-radius-md)"
        style={{
          boxShadow: "inset 0 0 0 1px var(--project-icon-inner-border)",
        }}
      />
    </div>
  );
}
