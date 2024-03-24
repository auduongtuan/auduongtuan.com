import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type PillButtonProps<T extends React.ElementType> = {
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  active?: boolean;
  size?: "small" | "medium";
} & React.ComponentPropsWithRef<T>;

const PillButton = forwardRef(
  <T extends "a" | "button">(
    {
      tooltip,
      href,
      external,
      children,
      size = "small",
      active = false,
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
      "shrink-0 text-secondary inline-flex items-center transition-all duration-100 ease-out border-2 border-gray-300 rounded-full flex-shrink-1 px-3 py-1 hover:border-blue-600 justify-items-center hover:bg-surface/40 group",
      active && "border-blue-600 text-blue-600",
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

PillButton.displayName = "PillButton";
export default PillButton;
