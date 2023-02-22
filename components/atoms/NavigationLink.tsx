import React from "react";
import CustomLink from "./CustomLink";
import { useRouter } from "next/router";
import clsx from "clsx";
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
  className = "-mx-2 px-2 py-0.5 -my-0.5",
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
  // const activeClassName = "underline underline-offset-4";
  const activeClassName = inverted ? "bg-white/10" : "bg-black/5";
  const anchorClassName = clsx(
    "font-medium inline-block text-lg rounded-xl",
    logo ? "uppercase" : "",
    inverted
      ? "text-white hover:bg-white/10"
      : "text-dark-blue-900 hover:bg-black/5",
    (router.asPath == href || router.pathname == href.split("#")[0]) && !logo
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
