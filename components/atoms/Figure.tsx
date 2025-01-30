import { twMerge } from "tailwind-merge";
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
      className={twMerge(
        borderRadius && "rounded-xl",
        "overflow-hidden translate-z-0 leading-0"
      )}
    >
      {children}
    </div>
    {caption && <Caption as="figcaption">{caption}</Caption>}
  </figure>
);

export default Figure;
