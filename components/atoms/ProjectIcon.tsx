import { cn } from "@lib/utils/cn";
import CustomImage from "./CustomImage";

type ProjectIconProps = {
  src: string;
  alt: string;
  size: number;
  className?: string;
};

const PROJECT_ICON_RADIUS_RATIO = 16 / 72;

export default function ProjectIcon({
  src,
  alt,
  size,
  className,
}: ProjectIconProps) {
  const radius = size * PROJECT_ICON_RADIUS_RATIO + 1;
  const borderRadius = `${radius}px`;

  return (
    <div
      className={cn("relative shrink-0 grow-0 overflow-hidden", className)}
      style={{
        width: size,
        height: size,
        borderRadius,
      }}
    >
      <CustomImage
        src={src}
        width={size}
        height={size}
        alt={alt}
        autoDarkSvg={false}
        className="h-full w-full"
        style={{ width: "100%", height: "100%", borderRadius }}
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius,
          boxShadow: "inset 0 0 0 1px var(--project-icon-inner-border)",
        }}
      />
    </div>
  );
}
