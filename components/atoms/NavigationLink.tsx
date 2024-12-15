import React from "react";
import CustomLink from "./CustomLink";
import { useRouter } from "next/router";
import { cn } from "@lib/utils/cn";
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
  const activeStyle =
    "relative before:bg-secondary before:absolute before:bottom-0 md:before:inset-x-0 before:w-1 before:h-full before:left-0 md:before:left-3 md:before:right-3 md:before:-bottom-3.5 md:before:h-1 md:before:w-auto before:transition-all before:duration-300 before:ease-in-out";
  // const activeClassName = inverted
  //   ? "bg-surface/10 shadow-navigation-inner"
  //   : "bg-surface-raised shadow-navigation-inner";
  const isActive = (router) =>
    router.asPath == href ||
    router.pathname == href.split("#")[0] ||
    router.pathname.includes(href + "/") ||
    (href.includes("#works") && router.pathname.includes("/project/"));
  const anchorClassName = cn(
    logo && "tracking-wide uppercase",
    "font-normal font-mono inline-block text-base rounded-xl",
    // logo && "uppercase",
    inverted
      ? "text-white hover:bg-surface/10"
      : "text-primary hover:bg-surface-raised",
    isActive(router) && !logo ? activeStyle : "",
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
