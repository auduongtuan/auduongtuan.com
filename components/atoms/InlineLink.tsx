import Link from "next/link";
import { cn } from "@lib/utils/cn";
import { playNavigationSound } from "@lib/audio/uiSounds";
import { parseInternalLink, trackEvent } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const inlineLinkVariants = cva(
  "inline-flex gap-2 items-center transition-all duration-100 -mx-2 px-2 -my-1 py-1 rounded-xl decoration-adaptive-underline hover:bg-adaptive-surface cursor-pointer",
  {
    variants: {
      underline: {
        true: "underline underline-offset-4",
        false: "",
      },
      wrap: {
        true: "hover:decoration-accent",
        false: "whitespace-nowrap break-words hover:decoration-transparent",
      },
    },
    defaultVariants: {
      underline: true,
      wrap: false,
    },
  },
);

interface InlineLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "wrap" | "as">,
    VariantProps<typeof inlineLinkVariants> {
  href?: string;
  className?: string;
  children: React.ReactNode;
  as?: "a" | "button";
  sound?: boolean;
}

const InlineLink = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement | HTMLSpanElement,
  InlineLinkProps
>(
  (
    {
      as = "a",
      href,
      className = "",
      children,
      underline = true,
      wrap = false,
      sound = true,
      onClick,
      ...rest
    },
    forwardedRef,
  ) => {
    const internalHref = href ? parseInternalLink(href) : null;
    const linkStyles = cn(inlineLinkVariants({ underline, wrap }), className);
    const link = internalHref ?? href;

    if (as == "button") {
      return (
        <button
          ref={forwardedRef as React.Ref<HTMLButtonElement>}
          type="button"
          className={linkStyles}
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            if (sound) {
              playNavigationSound();
            }
            onClick?.(e as unknown as React.MouseEvent<HTMLAnchorElement>);
          }}
          {...(rest as React.ComponentPropsWithoutRef<"button">)}
        >
          {children}
        </button>
      );
    }

    if (!href) {
      return (
        <span
          ref={forwardedRef as React.Ref<HTMLSpanElement>}
          className={linkStyles}
          onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
            onClick?.(e as unknown as React.MouseEvent<HTMLAnchorElement>);
          }}
          {...(rest as React.ComponentPropsWithoutRef<"span">)}
        >
          {children}
        </span>
      );
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      trackEvent({
        event: "link_click",
        content: link,
        page: window.location.pathname,
      });

      onClick?.(e);

      if (sound && !e.defaultPrevented) {
        playNavigationSound();
      }
    };

    if (internalHref) {
      return (
        <Link
          ref={forwardedRef as React.Ref<HTMLAnchorElement>}
          href={internalHref}
          className={linkStyles}
          onClick={handleClick}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={forwardedRef as React.Ref<HTMLAnchorElement>}
        href={href}
        className={linkStyles}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
        {...rest}
      >
        {children}
      </a>
    );
  },
);

InlineLink.displayName = "InlineLink";
export default InlineLink;
