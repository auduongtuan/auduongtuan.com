import { parseInternalLink } from "@lib/utils";
import { cn } from "@lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import React from "react";
import { FaSpinner } from "react-icons/fa";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

const buttonVariants = cva(
  "inline-flex justify-center items-center gap-2 px-4 py-2 rounded-lg outline-hidden ring-accent focus-visible:ring-2 font-mono font-semibold text-sm uppercase transition-all duration-200 ease-out",
  {
    variants: {
      variant: {
        primary:
          "text-white bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-pressed",
        secondary:
          "bg-surface py-1.5 h-8.5 border border-control text-secondary hover:bg-button-secondary-hover active:bg-button-secondary-pressed",
        ghost:
          "py-1 px-2 -my-2 -mx-2 bg-transparent text-tertiatiry hover:bg-adaptive-surface",
      },
      colorful: {
        true: "",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed opacity-60 pointer-events-none",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      colorful: false,
    },
    compoundVariants: [
      {
        variant: "primary",
        colorful: true,
        className:
          "bg-surface/80 text-primary hover:text-white hover:bg-button-primary-hover active:bg-button-primary-pressed active:outline-hidden focus:shadow-blue-400",
      },
    ],
  },
);

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  href?: string;
  className?: string;
  children: React.ReactNode;
  arrow?: boolean;
  disabled?: boolean;
  showPopoutIcon?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  scroll?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      href,
      className = "",
      children,
      colorful = false,
      arrow = false,
      disabled = false,
      showPopoutIcon = false,
      icon,
      loading = false,
      variant = "primary",
      scroll = true,
      type,
      onClick,
      ...rest
    },
    forwardedRef,
  ) => {
    const isInteractionDisabled = disabled || loading;

    const buttonStyles = cn(
      buttonVariants({ variant, colorful, disabled: isInteractionDisabled }),
      className,
    );

    const handleClick = (
      event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>,
    ) => {
      if (isInteractionDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };

    const defaultIcon = showPopoutIcon ? (
      <FiArrowUpRight aria-hidden="true" />
    ) : arrow ? (
      <FiArrowRight aria-hidden="true" />
    ) : undefined;

    let renderIcon: React.ReactNode = icon ?? defaultIcon;
    if (loading) {
      renderIcon = <FaSpinner className="animate-spin" aria-hidden="true" />;
    }

    const internalHref = href ? parseInternalLink(href) : null;

    const content = (
      <>
        {children}
        {renderIcon ? <span className="shrink-0">{renderIcon}</span> : null}
      </>
    );

    if (href) {
      if (internalHref) {
        return (
          <Link
            ref={forwardedRef as React.Ref<HTMLAnchorElement>}
            href={internalHref}
            scroll={scroll}
            className={buttonStyles}
            aria-disabled={isInteractionDisabled}
            aria-busy={loading}
            tabIndex={isInteractionDisabled ? -1 : undefined}
            onClick={handleClick}
            {...rest}
          >
            {content}
          </Link>
        );
      }

      return (
        <a
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          href={href}
          className={buttonStyles}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={isInteractionDisabled}
          aria-busy={loading}
          tabIndex={isInteractionDisabled ? -1 : undefined}
          onClick={handleClick}
          {...rest}
        >
          {content}
        </a>
      );
    }

    const buttonType = type ?? "button";

    return (
      <button
        ref={forwardedRef as React.Ref<HTMLButtonElement>}
        type={buttonType}
        className={buttonStyles}
        disabled={isInteractionDisabled}
        aria-busy={loading}
        aria-disabled={isInteractionDisabled}
        onClick={handleClick}
        {...rest}
      >
        {content}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
