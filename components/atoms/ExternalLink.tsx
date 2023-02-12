import React, { forwardRef } from 'react'
export interface ExternalLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string
}
const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(({href = '#', children, className, ...rest}, ref) => {
  return (
    <a href={href} className={className ? className : `hover:underline`} target="_blank" rel="noreferrer" {...rest} ref={ref}>{children}</a>
  )
});
ExternalLink.displayName = "ExternalLink";
export default ExternalLink
