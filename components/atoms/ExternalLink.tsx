import React from "react";
export interface ExternalLinkProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string;
  // icon?: boolean | React.ReactNode;
}
/*
 * Component to display external link (no style)
 */
const ExternalLink = ({
  ref,
  href = "#",
  children,
  className = "",

  // icon,
  ...rest
}: ExternalLinkProps & {
  ref?: React.RefObject<HTMLAnchorElement>;
}) => {
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
};

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
