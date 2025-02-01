import React, { forwardRef } from "react";
export interface ExternalLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  // icon?: boolean | React.ReactNode;
}
/*
 * Component to display external link (no style)
 */
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
        className={className}
        target="_blank"
        rel="noreferrer"
        {...rest}
        ref={ref}
      >
        {children}
      </a>
    );
  }
);

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
