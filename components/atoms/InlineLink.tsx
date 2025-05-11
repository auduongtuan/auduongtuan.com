import Link from "next/link";
import ExternalLink from "./ExternalLink";
import { cn } from "@lib/utils/cn";
import { trackEvent } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inlineLinkVariants = cva(
  "inline-flex gap-2 items-center transition-all duration-100 -mx-2 px-2 -my-1 py-1 rounded-xl decoration-adaptive-underline hover:bg-adaptive-surface",
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
  extends Omit<React.ComponentPropsWithoutRef<"a">, "wrap">,
    VariantProps<typeof inlineLinkVariants> {
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const InlineLink = ({
  ref,
  href = "#",
  className = "",
  children,
  underline = true,
  wrap = false,
  onClick,
  ...rest
}: InlineLinkProps & {
  ref?: React.RefObject<HTMLAnchorElement>;
}) => {
  // get the internal link (without /)
  let checkInternal =
    href != "#" &&
    href.match(
      /^(?:https?:\/\/)?(?:www\.)?auduongtuan\.com(\/[^"\s]*)?$|(^\/[^"\s]*)$/i,
    );
  const Component = checkInternal ? Link : ExternalLink;
  const linkStyles = cn(inlineLinkVariants({ underline, wrap }), className);
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
};

InlineLink.displayName = "InlineLink";
export default InlineLink;
