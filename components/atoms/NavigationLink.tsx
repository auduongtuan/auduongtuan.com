import React from "react";
import CustomLink, { CustomLinkProps } from "./CustomLink";
import { useRouter } from "next/router";
import { cn } from "@lib/utils/cn";

type AnchorProps = React.ComponentProps<"a">;

const NavigationAnchor = ({
  onClick,
  href,
  className,
  children,
  ...rest
}: AnchorProps) => {
  return (
    <a
      href={href}
      onClick={(e) => {
        onClick && onClick(e);
        e.preventDefault();
        // window.scrollTo(0,0);
      }}
      className={className}
      {...rest}
    >
      {children}
    </a>
  );
};
NavigationAnchor.displayName = "NavigationAnchor";

interface NavigationLinkProps extends CustomLinkProps {
  logo?: boolean;
  inverted?: boolean | undefined | null;
  callback?: () => void;
  isActive?: boolean;
}

const NavigationLink = ({
  href,
  children,
  className = "-mx-3 px-3 py-0.5 -my-0.5",
  logo = false,
  inverted = false,
  isActive = false,
  callback,
  ...rest
}: NavigationLinkProps) => {
  const router = useRouter();
  const activeStyle =
    "relative before:bg-secondary before:absolute before:bottom-0 md:before:inset-x-0 before:w-1 before:h-full before:left-0 md:before:left-3 md:before:right-3 md:before:-bottom-3.5 md:before:h-1 md:before:w-auto before:transition-all before:duration-300 before:ease-in-out";
  // const activeClassName = inverted
  //   ? "bg-surface/10 shadow-navigation-inner"
  //   : "bg-surface-raised shadow-navigation-inner";

  const anchorClassName = cn(
    logo && "tracking-wide uppercase",
    "font-normal font-mono inline-block text-base rounded-xl",
    // logo && "uppercase",
    inverted
      ? "text-white hover:bg-surface/10"
      : "text-primary hover:bg-surface-raised",
    isActive && !logo ? {} : "",
    className,
  );

  return (
    // <Link href={href} scroll={false} passHref><NavigationAnchor className={anchorClassName}>{children}</NavigationAnchor></Link>
    <CustomLink
      href={href}
      className={anchorClassName}
      callback={callback}
      {...rest}
    >
      {children}
    </CustomLink>
  );
};

export default NavigationLink;
