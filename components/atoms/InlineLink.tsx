import Link from "next/link";
import ExternalLink from "./ExternalLink";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react";
interface InlineLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  underline?: boolean;
  dark?: boolean;
}
const InlineLink = forwardRef<HTMLAnchorElement, InlineLinkProps>(
  (
    {
      href,
      className = "",
      children,
      dark = false,
      underline = true,
      ...rest
    },
    ref
  ) => {
    // get the internal link (without /)
    let checkInternal = href.match(/^(?!http|https)\/?([\/\w-]+)$|auduongtuan\.com\/?(.*)$/i);
    console.log(checkInternal);
    const Component = checkInternal ? Link : ExternalLink;
    const linkStyles = twMerge(
      underline && "underline underline-offset-4",
      dark
        ? "whitespace-nowrap break-words transition-all duration-100  decoration-slate-600 hover:decoration-transparent hover:text-white hover:bg-white/10 -mx-2 px-2 -my-1 py-1 rounded-xl"
        : "whitespace-nowrap break-words transition-all duration-100 -mx-2 px-2 -my-1 py-1 rounded-xl decoration-slate-400/40 hover:decoration-transparent hover:bg-black/5",
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
