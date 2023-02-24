import React, { forwardRef } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
export interface ExternalLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  // icon?: boolean | React.ReactNode;
}
const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(
  (
    {
      href = "#",
      children,
      className = "",
      // icon,
      ...rest
    },
    ref
  ) => {
    // if (icon && typeof icon == 'boolean') {
    //   icon = <FiArrowUpRight />
    // }
    return (
      <a
        href={href}
        className={twMerge(`hover:underline`, className)}
        target="_blank"
        rel="noreferrer"
        {...rest}
        ref={ref}
      >
        {children}
        {/* {icon} */}
      </a>
    );
  }
);
ExternalLink.displayName = "ExternalLink";
export default ExternalLink;
