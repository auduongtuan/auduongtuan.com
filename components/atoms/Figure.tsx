import { cn } from "@lib/utils/cn";
import Caption from "./Caption";

const Figure = ({
  children,
  className = "",
  caption,
  borderRadius = true,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  caption?: React.ReactNode;
  borderRadius?: boolean;
}) => (
  <figure className={className} {...rest}>
    <div
      className={cn(
        borderRadius && "rounded-xl",
        "translate-z-0 overflow-hidden leading-0",
      )}
    >
      {children}
    </div>
    {caption && <Caption as="figcaption">{caption}</Caption>}
  </figure>
);

export default Figure;
