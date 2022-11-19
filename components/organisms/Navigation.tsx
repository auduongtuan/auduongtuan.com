import React, { useEffect, useRef, Fragment } from "react";
import { useAppContext } from "../../lib/context/AppContext";
import { FiMenu, FiX } from "react-icons/fi";
import NavigationLink from "../atoms/NavigationLink";
import useBreakpoint from "../../hooks/useBreakpoint";
import { Transition } from "@headlessui/react";
interface NavigationProps {
  fixed?: boolean;
  hideOnScroll?: boolean;
}

const menuItems = [
  { pathname: "/", href: "/#works", name: "Works" },
  { pathname: "/about", href: "/about", name: "About" },
  { pathname: "/", href: "/blog", name: "Blog" },
];

const Navigation = React.memo(
  ({ fixed = true, hideOnScroll = false }: NavigationProps) => {
    const { menuOpened, setMenuOpened, headerInView, pauseScrollEvent } =
      useAppContext();
    const headerRef = useRef<HTMLElement>(null);
    const bp = useBreakpoint();
    // console.log('re-render navigation");
    useEffect(() => {
      let lastScrollTop = 0;
      const handleScroll = () => {
        if (pauseScrollEvent) return;
        const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        const threshold = 10;
        if (Math.abs(st - lastScrollTop) > threshold) {
          if (st > lastScrollTop) {
            // downscroll code
            console.log("Scroll Down");
            if (headerRef.current)
              headerRef.current.classList.add("-translate-y-full");
          } else {
            console.log("Scroll Up");
            if (headerRef.current)
              headerRef.current.classList.remove("-translate-y-full");
            // upscroll code
          }
        }
        lastScrollTop = st;
      };
      if (hideOnScroll) {
        window.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (hideOnScroll) window.removeEventListener("scroll", handleScroll);
      };
    }, [hideOnScroll, headerRef, pauseScrollEvent]);
    return (
      <div>
        <header
          ref={headerRef}
          className={`${
            fixed ? "fixed" : "absolute"
          } opacity-0 w-full top-0 z-[42] transition-all duration-300 animate-fade-in-fast ${
            headerInView || menuOpened ? "bg-transparent text-white" : "bg-white-fade text-dark-blue-900"
          }`}
        >
          <nav className="text-display text-base md:text-xl font-semibold main-container pt-4 pb-8 flex items-center justify-between">
            {/* logo */}
            <NavigationLink
              href="/"
              activeClassName=""
              className={`uppercase`}
              inverted={headerInView || menuOpened}
              callback={() => setMenuOpened(false)}
            >
              Au Duong Tuan
            </NavigationLink>
            {menuOpened ?
              <button
                className={`inline-block -mx-2 px-2 py-1 rounded-xl  cursor-pointer text-white hover:bg-white/10`}
                onClick={() => setMenuOpened(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
             : (
              <>
                {bp != 'lg' &&
                <button
                  className={`inline-block -mx-2 px-2 py-1 rounded-xl  cursor-pointer ${
                    headerInView
                      ? "text-white hover:bg-white/10"
                      : "text-dark-blue-900 hover:bg-black/5"
                  }`}
                  onClick={() => setMenuOpened(true)}
                >
                  <FiMenu className="w-6 h-6" />
                </button>
                }
                <ul className="md:flex gap-12 items-center hidden">
                  {menuItems.map((item, i) => (
                    <li key={i}>
                      <NavigationLink
                        pathname={item.pathname}
                        href={item.href}
                        inverted={headerInView}
                      >
                        {item.name}
                      </NavigationLink>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </nav>
        </header>
        {/* MOBILE MENU */}
        <Transition
          show={menuOpened}
          as={Fragment}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 -translate-y-12"
          enterTo="opacity-1 translate-y-0"
          leave="transition-all duration-300"
          leaveFrom="opacity-1 translate-y-0"
          leaveTo="opacity-0 -translate-y-12"
        >
          <div className={`fixed z-40 w-full h-full bg-custom-neutral-900`}>
            <div className="main-container">
              <ul className="p-header flex flex-col gap-8 text-display">
                {menuItems.map((item, i) => (
                  <li key={i}>
                    <NavigationLink
                      pathname={item.pathname}
                      href={item.href}
                      className="text-display text-2xl font-bold"
                      inverted
                      callback={() => setMenuOpened(false)}
                    >
                      {item.name}
                    </NavigationLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Transition>
      </div>
    );
  }
);
Navigation.displayName = "Navigation";
export default Navigation;
