import Link from "next/link";
import ExternalLink from "./ExternalLink";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
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
      ...rest
    },
    ref
  ) => {
    // get the internal link (without /)
    let checkInternal = href.match(
      /^(?!http|https)\/?([\/\w-]+)$|auduongtuan\.com\/?(.*)$/i
    );
    // console.log(checkInternal);
    const Component = checkInternal ? Link : ExternalLink;
    const linkStyles = twMerge(
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
    return (
      <Component
        ref={ref}
        href={(checkInternal ? `/${checkInternal[1]}` : href) as string}
        className={linkStyles}
        {...rest}
      >
        {children}
      </Component>
    );
  }
);

InlineLink.displayName = "InlineLink";
export default InlineLink;
