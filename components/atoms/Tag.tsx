import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface TagProps extends React.ComponentPropsWithoutRef<"span"> {
  inverted?: boolean;
}

const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ children, className, inverted = false, ...rest }, ref) => {
    return (
      <span
        className={twMerge(
          "font-mono uppercase tracking-wide text-[10px] md:text-[11px] font-medium",
          inverted ? "bg-surface/20 text-white" : "text-tertiary bg-pill",
          "px-2 py-1 rounded-md",
          className
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </span>
    );
  }
);

Tag.displayName = "Tag";
export default Tag;
