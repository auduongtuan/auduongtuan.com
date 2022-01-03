import React from 'react'
export interface ExternalLinkProps {
  href?: string,
  children: React.ReactNode
}
const ExternalLink = ({href = '#', children}: ExternalLinkProps) : JSX.Element => {
  return (
    <a href={href} className='hover:underline' target="_blank" rel="noreferrer">{children}</a>
  )
}

export default ExternalLink
