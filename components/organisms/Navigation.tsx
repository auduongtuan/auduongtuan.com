import React, {FC, useEffect, useState, useCallback} from "react";
import Link from "next/link";
import { useAppContext } from "../../lib/context/AppContext";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";
interface NavigationProps {
  fixed?: boolean;
  hideOnScroll?: boolean;
}
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
interface CustomLinkProps {
  href: string,
  className?: string
}
const CustomLink: FC<CustomLinkProps> = ({className = '', href, children}) => {
  const router = useRouter();
  const scrollIntoEl = useCallback((hash: string, pathname: string) => {
    if (hash) {
      const el = document.getElementById(hash) as HTMLElement|null;
      if (el) {
        el.scrollIntoView({behavior: 'smooth'});
        history.replaceState(null, '', '#'+hash);
      }
    } else {
      window.scrollTo({top: 0, behavior: 'smooth'});
      history.replaceState(null, '', pathname+(hash ? '#'+hash : ''));
    }
  
    
  }, []);
  const handleOnClick = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const scrollX = window.pageXOffset;
    const scrollY = window.pageYOffset;

    const location = window.location;
    const urlParts = href.split('#');
    if (location.pathname === urlParts[0]) {
      // console.log(urlParts[1]);
      scrollIntoEl(urlParts[1], urlParts[0]);
    }
    else {
      // neu chung page thi dep me
      router.push(urlParts[0]).then(() => urlParts[1] && scrollIntoEl(urlParts[1], urlParts[0]));
    }
    
  }, []);
  return <a onClick={handleOnClick} href={href} className={className}>{children}</a>

}
const NavigationLink = ({href, children, pathname = '/', className='', activeClassName = 'underline underline-offset-4', inverted = false}:{
  href: string,
  children: React.ReactNode,
  className?: string,
  activeClassName?: string,
  inverted: boolean | undefined | null,
  pathname?: string
}) => {
  const router = useRouter();
  const anchorClassName = `inline-block -mx-2 text-xl px-2 py-1 rounded-xl ${(inverted ? 'text-white hover:bg-white/10' : 'text-blue-900 hover:bg-black/5')} ${router.asPath == href ? ''+activeClassName : ''} ${className}`;
  return (
    // <Link href={href} scroll={false} passHref><NavigationAnchor className={anchorClassName}>{children}</NavigationAnchor></Link>
    <CustomLink href={href} className={anchorClassName}>{children}</CustomLink>
  );
}
export default function Navigation({fixed = true, hideOnScroll = false}: NavigationProps) {
  const appContext = useAppContext();
  const router = useRouter();
  const [scrollUp, setScrollUp] = useState<Boolean>(true);
  const items = [
    {pathname: "/", href: "/#works", name: "Works"},
    {pathname: "/about", href: "/about", name: "About"},
    {pathname: "/", href: "/#contact", name: "Contact"},
  ]
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      const threshold = 10;
      if (Math.abs(st - lastScrollTop) > threshold) {
        if (st > lastScrollTop) {
            // downscroll code
            console.log('Scroll Down');
            setScrollUp(false);
        } else {
            console.log('Scroll Up');
            setScrollUp(true);

            // upscroll code
        }
      }
      lastScrollTop = st;
    };
    if (hideOnScroll) {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (hideOnScroll) window.removeEventListener('scroll', handleScroll);
    }
  }, [hideOnScroll]);
  return (
    <header className={`${fixed ? 'fixed' : 'absolute'} w-full top-0 z-20 transition-all duration-300 ${(hideOnScroll && !scrollUp) && '-translate-y-full'} ${(appContext.headerInView ? 'text-white' : 'bg-white-fade text-blue-900')}`}>
      <nav className="text-display text-xl font-semibold main-container pt-4 pb-8 flex items-center justify-between">
     
        <NavigationLink href="/" className={`flex items-center ${router.pathname != '/' && '-ml-7'}`} inverted={appContext.headerInView}>{router.pathname != '/' && <FiArrowLeft className="w-5 h-5 mr-2"/>}Tuan&apos;s Homepage</NavigationLink>
  
        <ul className="flex gap-20 self-end items-center">
         {items.map((item, i) => <li key={i}><NavigationLink pathname={item.pathname} href={item.href} inverted={appContext.headerInView}>{item.name}</NavigationLink></li>)}
        </ul>
      </nav>
    </header>
  );
}
