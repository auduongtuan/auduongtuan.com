import React from 'react'
export interface ExternalLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href?: string
}
const ExternalLink = ({href = '#', children, className, ...rest}: ExternalLinkProps) : JSX.Element => {
  return (
    <a href={href} className={className ? className : `hover:underline`} target="_blank" rel="noreferrer" {...rest}>{children}</a>
  )
}

export default ExternalLink
