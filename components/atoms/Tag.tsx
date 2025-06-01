import { cn } from "@lib/utils/cn";

export interface TagProps extends React.ComponentPropsWithoutRef<"span"> {
  inverted?: boolean;
}

const Tag = ({
  ref,
  children,
  className,
  inverted = false,
  ...rest
}: TagProps & {
  ref?: React.RefObject<HTMLSpanElement>;
}) => {
  return (
    <span
      className={cn(
        "font-mono text-[10px] font-medium tracking-wide uppercase md:text-[11px]",
        inverted ? "bg-surface/20 text-white" : "text-tertiary bg-pill",
        "rounded-md px-2 py-1",
        className,
      )}
      ref={ref}
      {...rest}
    >
      {children}
    </span>
  );
};

Tag.displayName = "Tag";
export default Tag;
