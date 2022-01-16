import React from "react";
import CustomLink from "../atoms/CustomLink";
import { useRouter } from "next/router";

interface NavigationAnchorProps {
  props: {
    onClick: void,
    href: string
  }
  ref: any
}
type AnchorProps = React.HTMLProps<HTMLAnchorElement>

const NavigationAnchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(({ onClick, href, className, children }, ref) => {
  return (
    <a href={href} onClick={(e) => {
      onClick && onClick(e);
      e.preventDefault();
      // window.scrollTo(0,0);
    }} ref={ref} className={className}>
      {children}
    </a>
  )
});
NavigationAnchor.displayName = 'NavigationAnchor'

const NavigationLink = ({href, children, pathname = '/', className='', activeClassName = 'underline underline-offset-4', inverted = false, callback}:{
  href: string,
  children: React.ReactNode,
  className?: string,
  activeClassName?: string,
  inverted?: boolean | undefined | null,
  pathname?: string,
  callback?: () => void
}) => {
  const router = useRouter();
  const anchorClassName = `inline-block -mx-2 text-xl px-2 py-1 rounded-xl ${(inverted ? 'text-white hover:bg-white/10' : 'text-dark-blue-900 hover:bg-black/5')} ${router.asPath == href || router.pathname == href.split("#")[0] ? ''+activeClassName : ''} ${className}`;
  return (
    // <Link href={href} scroll={false} passHref><NavigationAnchor className={anchorClassName}>{children}</NavigationAnchor></Link>
    <CustomLink href={href} className={anchorClassName} callback={callback}>{children}</CustomLink>
  );
}

export default NavigationLink;