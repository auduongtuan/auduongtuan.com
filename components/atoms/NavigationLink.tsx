import React from "react";
import CustomLink from "./CustomLink";
import { Router, useRouter, NextRouter } from "next/router";
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
  className = "-mx-3 px-3 py-0.5 -my-0.5 font-mono",
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
  const activeClassName =
    "relative before:bg-primary before:absolute before:inset-x-0 before:left-3 before:right-3 before:-bottom-3.5 before:h-1 before:transition-all before:duration-300 before:ease-in-out";
  // const activeClassName = inverted
  //   ? "bg-surface/10 shadow-navigation-inner"
  //   : "bg-surface-raised shadow-navigation-inner";
  const isActive = (router) =>
    router.asPath == href ||
    router.pathname == href.split("#")[0] ||
    router.pathname.includes(href + "/") ||
    (href.includes("#works") && router.pathname.includes("/project/"));
  const anchorClassName = twMerge(
    logo && "tracking-wide uppercase",
    "font-medium inline-block text-base  rounded-xl",
    // logo && "uppercase",
    inverted
      ? "text-white hover:bg-surface/10"
      : "text-primary hover:bg-surface-raised",
    isActive(router) && !logo ? activeClassName : "",
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
