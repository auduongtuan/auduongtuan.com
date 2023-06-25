import clsx from "clsx";
import { forwardRef } from "react";
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
    const buttonStyles = clsx({
      "focus:ring-2 ring-blue-600 outline-none flex items-center transition-all ease justify-center rounded-full":
        true,
      "hover:bg-blue-800 hover:text-white active:bg-blue-900 active:text-white cursor-pointer":
        true,
      "w-10 h-10 text-xl": size == "small",
      "w-16 h-16 text-2xl": size == "medium",
      "bg-white text-black": inverted,
      "bg-black/10": !inverted,
      className,
    });
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
