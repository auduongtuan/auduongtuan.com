import React, {FC, useEffect, useState, useRef, useCallback} from "react";
import Link from "next/link";
import { useAppContext } from "../../lib/context/AppContext";
import { useRouter } from "next/router";
import { FiArrowLeft, FiMenu, FiX } from "react-icons/fi";
import CustomLink from "../atoms/CustomLink";
import NavigationLink from "../atoms/NavigationLink";
interface NavigationProps {
  fixed?: boolean;
  hideOnScroll?: boolean;
}

const menuItems = [
  {pathname: "/", href: "/#works", name: "Works"},
  {pathname: "/about", href: "/about", name: "About"},
  {pathname: "/", href: "/blog", name: "Blog"},
  // {pathname: "/", href: "/#contact", name: "Contact"},
]
const MobileMenu = ({className = '', opened = false}:{className?: string, opened?: boolean}) => {
  const {menuOpened, setMenuOpened, headerInView} = useAppContext();
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (menuOpened && container.current) container.current.classList.add('animate-fade-in-fast');
  }, [menuOpened]);
  return (
    <div className={`${!menuOpened && 'hidden'} md:hidden opacity-0 fixed z-50 w-full h-full bg-custom-neutral-900`} ref={container}>
      <div className="main-container">
        <div className="mt-4 relative">
        <button className={`absolute top-0 right-0 inline-block -mx-2 px-2 py-1 rounded-xl  cursor-pointer text-white hover:bg-white/10`} onClick={() => setMenuOpened && setMenuOpened(false)}><FiX className="w-6 h-6" /></button>
        </div>
       <ul className="p-header flex flex-col gap-8 text-display">
         {menuItems.map((item, i) => <li key={i}><NavigationLink pathname={item.pathname} href={item.href} className="text-display text-2xl font-bold" inverted callback={() => setMenuOpened && setMenuOpened(false)}>{item.name}</NavigationLink></li>)}
        </ul>
      </div>
    </div>
  );
}
export default function Navigation({fixed = true, hideOnScroll = false}: NavigationProps) {
  const appContext = useAppContext();
  const [scrollUp, setScrollUp] = useState<Boolean>(true);
  
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
  <div>
    <header className={`${fixed ? 'fixed' : 'absolute'} opacity-0 w-full top-0 z-40 transition-all duration-300 animate-fade-in-fast ${(hideOnScroll && !scrollUp) && '-translate-y-full'} ${(appContext.headerInView ? 'text-white' : 'bg-white-fade text-dark-blue-900')}`}>
      <nav className="text-display text-base md:text-xl font-semibold main-container pt-4 pb-8 flex items-center justify-between">
     
        <NavigationLink href="/" activeClassName="" className={`uppercase`} inverted={appContext.headerInView}>Au Duong Tuan
        </NavigationLink>
  
        <div className="md:hidden">
        <button className={`inline-block -mx-2 px-2 py-1 rounded-xl  cursor-pointer ${(appContext.headerInView ? 'text-white hover:bg-white/10' : 'text-dark-blue-900 hover:bg-black/5')}`} onClick={() => appContext.setMenuOpened && appContext.setMenuOpened(true)}><FiMenu className="w-6 h-6" /></button>
        </div>
        <ul className="md:flex gap-12 items-center hidden">
         {menuItems.map((item, i) => <li key={i}><NavigationLink pathname={item.pathname} href={item.href} inverted={appContext.headerInView}>{item.name}</NavigationLink></li>)}
        </ul>
      </nav>
    </header>
    <MobileMenu  />
    </div>
  );
}
