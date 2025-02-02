import { cn } from "@lib/utils/cn";
import { forwardRef } from "react";

type PillButtonProps<T extends React.ElementType> = {
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  active?: boolean;
  size?: "small" | "medium";
  className?: string;
  inverted?: boolean;
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
    }: PillButtonProps<T>,
    ref: React.ForwardedRef<HTMLElement>,
  ) => {
    const externalAttrs = external
      ? { target: "_blank", rel: "noreferrer" }
      : {};
    const buttonStyles = cn(
      "shrink-0 text-secondary inline-flex items-center transition-all duration-100 ease-out border-2 border-gray-300 rounded-full flex-shrink-1 px-3 py-1 hover:border-accent justify-items-center hover:bg-surface/40 group",
      active && "border-accent text-accent",
      size === "small" && "text-sm px-2.5 py-1",
      className,
    );
    return href ? (
      <a
        href={href}
        className={buttonStyles}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        ref={ref as React.RefObject<HTMLElementTagNameMap["a"]>}
      >
        {children}
      </a>
    ) : (
      <button
        className={buttonStyles}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={ref as React.RefObject<HTMLElementTagNameMap["button"]>}
      >
        {children}
      </button>
    );
  },
);

PillButton.displayName = "PillButton";
export default PillButton;
