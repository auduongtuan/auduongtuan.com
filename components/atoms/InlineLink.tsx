import Link from "next/link";
import ExternalLink from "./ExternalLink";
import { cn } from "@lib/utils/cn";
import { playNavigationSound } from "@lib/audio/uiSounds";
import { parseInternalLink, trackEvent } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

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
}

const InlineLink = ({
  ref,
  as = "a",
  href = "#",
  className = "",
  children,
  underline = true,
  wrap = false,
  onClick,
  ...rest
}: InlineLinkProps & {
  ref?: React.RefObject<HTMLAnchorElement | HTMLButtonElement>;
}) => {
  // get the internal link (without /)
  let checkInternal = parseInternalLink(href);
  const Component = checkInternal ? Link : ExternalLink;
  const linkStyles = cn(inlineLinkVariants({ underline, wrap }), className);
  const link = checkInternal ? checkInternal : href;

  if (as == "button") {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={linkStyles}
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          if (onClick) {
            onClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
          }
        }}
        {...(rest as React.ComponentPropsWithoutRef<"button">)}
      >
        {children}
      </button>
    );
  }

  if (href == "#") {
    return (
      <span
        ref={ref as React.Ref<HTMLSpanElement>}
        className={linkStyles}
        onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
          if (onClick) {
            onClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
          }
        }}
        {...(rest as React.ComponentPropsWithoutRef<"span">)}
      >
        {children}
      </span>
    );
  }

  return (
    <Component
      href={link as string}
      className={linkStyles}
      onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
        if (link != "#") {
          trackEvent({
            event: "link_click",
            content: link,
            page: window.location.pathname,
          });
        }
        if (onClick) onClick(e);
        if (link != "#" && !e.defaultPrevented) {
          playNavigationSound();
        }
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

InlineLink.displayName = "InlineLink";
export default InlineLink;
