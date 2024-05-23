import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";
type IconButtonProps<T extends React.ElementType> = {
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  size?: "small" | "medium";
  inverted?: boolean;
} & React.ComponentPropsWithRef<T>;
const IconButton = forwardRef(
  <T extends "a" | "button">(
    {
      tooltip,
      href,
      external,
      children,
      size = "small",
      inverted = false,
      className,
      ...rest
    },
    ref: React.ForwardedRef<React.ElementType<T>>
  ) => {
    const externalAttrs = external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    const buttonStyles = twMerge(
      "focus-visible:ring-2 ring-accent outline-none flex items-center transition-all ease justify-center rounded-full",
      "bg-button-secondary text-secondary hover:bg-button-primary-hover hover:text-oncolor active:bg-button-secondary-pressed active:text-oncolor cursor-pointer",
      size == "small" && "w-10 h-10 text-xl",
      size == "medium" && "w-16 h-16 text-2xl",
      inverted && "bg-surface text-black",
      className
    );
    return href ? (
      <a
        href={href}
        {...externalAttrs}
        className={buttonStyles}
        {...rest}
        ref={ref as React.RefObject<HTMLElementTagNameMap["a"]>}
      >
        {children}
      </a>
    ) : (
      <button
        {...externalAttrs}
        className={buttonStyles}
        {...rest}
        ref={ref as React.RefObject<HTMLElementTagNameMap["button"]>}
      >
        {children}
      </button>
    );
  }
);
IconButton.displayName = "IconButton";
export default IconButton;
