import Link from "next/link";
import ExternalLink from "./ExternalLink";
import { forwardRef } from "react";
import { cn } from "@lib/utils/cn";
import { trackEvent } from "@lib/utils";

interface InlineLinkProps
  extends Omit<React.ComponentPropsWithoutRef<"a">, "wrap"> {
  href: string;
  className?: string;
  children: React.ReactNode;
  underline?: boolean;
  dark?: boolean;
  wrap?: boolean;
}

const InlineLink = forwardRef<HTMLAnchorElement, InlineLinkProps>(
  (
    {
      href,
      className = "",
      children,
      dark = false,
      underline = true,
      wrap = false,
      onClick,
      ...rest
    },
    ref
  ) => {
    // get the internal link (without /)
    let checkInternal =
      href != "#" &&
      href.match(
        /^(?:https?:\/\/)?(?:www\.)?auduongtuan\.com(\/[^"\s]*)?$|(^\/[^"\s]*)$/i
      );
    const Component = checkInternal ? Link : ExternalLink;
    const linkStyles = cn(
      "inline-flex gap-2 items-center",
      underline && "underline underline-offset-4",
      !wrap && "whitespace-nowrap break-words hover:decoration-transparent",
      wrap && "hover:decoration-blue-500",
      "transition-all duration-100",
      "-mx-2 px-2 -my-1 py-1 rounded-xl",
      dark ? "decoration-slate-600" : "decoration-underline",
      dark && !wrap && "hover:bg-surface/10",
      !dark && !wrap && "hover:bg-surface-raised",
      className
    );
    const link = checkInternal ? checkInternal[1] || checkInternal[2] : href;
    return (
      <Component
        ref={ref}
        href={link as string}
        className={linkStyles}
        onClick={(e) => {
          if (link != "#") {
            trackEvent({
              event: "link_click",
              content: link,
              page: window.location.pathname,
            });
          }
          if (onClick) onClick(e);
        }}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

InlineLink.displayName = "InlineLink";
export default InlineLink;
