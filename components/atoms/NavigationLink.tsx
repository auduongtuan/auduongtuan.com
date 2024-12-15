import React from "react";
import CustomLink from "./CustomLink";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
interface NavigationAnchorProps {
  props: {
    onClick: void;
    href: string;
  };
  ref: any;
}
type AnchorProps = React.HTMLProps<HTMLAnchorElement>;

const NavigationAnchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ onClick, href, className, children }, ref) => {
    return (
      <a
        href={href}
        onClick={(e) => {
          onClick && onClick(e);
          e.preventDefault();
          // window.scrollTo(0,0);
        }}
        ref={ref}
        className={className}
      >
        {children}
      </a>
    );
  }
);
NavigationAnchor.displayName = "NavigationAnchor";

const NavigationLink = ({
  href,
  children,
  pathname = "/",
  className = "-mx-3 px-3 py-0.5 -my-0.5",
  logo = false,
  inverted = false,
  callback,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  logo?: boolean;
  inverted?: boolean | undefined | null;
  pathname?: string;
  callback?: () => void;
}) => {
  const router = useRouter();
  const currentPath = usePathname();
  // const activeClassName = "underline underline-offset-4";
  const activeClassName = inverted
    ? "bg-surface/10 shadow-navigation-inner"
    : "bg-surface-raised shadow-navigation-inner";
  const anchorClassName = twMerge(
    logo && "tracking-wide uppercase",
    "font-medium inline-block text-base  rounded-xl",
    // logo && "uppercase",
    inverted
      ? "text-white hover:bg-surface/10"
      : "text-primary hover:bg-surface-raised",
    // router.asPath == href ||
    currentPath == href.split("#")[0] && !logo
      ? activeClassName
      : "",
    className
  );

  return (
    // <Link href={href} scroll={false} passHref><NavigationAnchor className={anchorClassName}>{children}</NavigationAnchor></Link>
    <CustomLink href={href} className={anchorClassName} callback={callback}>
      {children}
    </CustomLink>
  );
};

export default NavigationLink;
