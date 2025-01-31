import { forwardRef, JSX } from "react";
import { twMerge } from "tailwind-merge";

type IconButtonProps<T extends React.ElementType> = {
  tooltip?: string;
  children?: React.ReactNode;
  href?: string;
  external?: boolean;
  size?: "small" | "medium" | "large";
  inverted?: boolean;
  as?: T;
} & React.ComponentPropsWithoutRef<T>;

const IconButton = forwardRef(
  <T extends React.ElementType = "button">(
    {
      tooltip,
      href,
      external,
      children,
      size = "medium",
      inverted = false,
      className,
      as,
      ...rest
    }: IconButtonProps<T>,
    ref: React.Ref<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const externalAttrs = external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    const buttonStyles = twMerge(
      "focus-visible:ring-2 ring-accent outline-hidden flex items-center transition-all ease justify-center rounded-full",
      "bg-button-secondary text-secondary hover:bg-button-primary-hover hover:text-oncolor active:bg-button-primary-pressed active:text-oncolor cursor-pointer",
      size == "small" && "w-6 h-6 text-sm",
      size == "medium" && "w-10 h-10 text-xl",
      size == "large" && "w-16 h-16 text-2xl",
      inverted && "bg-surface text-black",
      className
    );
    return href ? (
      <a
        href={href}
        {...externalAttrs}
        className={buttonStyles}
        {...rest}
        ref={ref as React.Ref<HTMLAnchorElement>}
      >
        {children}
      </a>
    ) : (
      <button
        {...externalAttrs}
        className={buttonStyles}
        {...rest}
        ref={ref as React.Ref<HTMLButtonElement>}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "IconButton";
export default IconButton;
