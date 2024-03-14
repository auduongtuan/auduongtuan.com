import React, { useEffect, useState, Fragment } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import NavigationLink from "@atoms/NavigationLink";
import useBreakpoint from "@hooks/useBreakpoint";
import { Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import useAppStore from "@store/useAppStore";

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
    const { menuOpened, pauseScrollEvent, headerInView, setMenuOpened } =
      useAppStore();
    const [hidden, setHidden] = useState(false);
    const bp = useBreakpoint();
    useEffect(() => {
      let lastScrollTop = 0;
      const handleScroll = () => {
        if (pauseScrollEvent) return;
        const st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
        const threshold = 10;
        if (Math.abs(st - lastScrollTop) > threshold) {
          setHidden(st > lastScrollTop);
        }
        lastScrollTop = st;
      };
      if (hideOnScroll) {
        window.addEventListener("scroll", handleScroll);
      }
      return () => {
        if (hideOnScroll) window.removeEventListener("scroll", handleScroll);
      };
    }, [hideOnScroll, pauseScrollEvent]);
    // const darkMenu = headerInView || menuOpened;
    const darkMenu = false;
    // may need to
    // https://paco.me/writing/disable-theme-transitions

    const NavigationStyles = twMerge(
      "w-full top-0 z-[42] transition-transform duration-150",
      fixed ? "fixed" : "absolute",
      darkMenu
        ? "bg-custom-neutral-900/60 backdrop-blur-md text-white"
        : "bg-white/60	backdrop-blur-md text-dark-blue-900",
      darkMenu && fixed && "border-b border-white/10",
      !darkMenu && fixed && "border-b border-gray-900/10",
      hidden && "-translate-y-full"
    );
    return (
      <div>
        <header className={NavigationStyles}>
          <nav className="flex items-center justify-between py-2 text-base font-semibold font-display text-display md:text-xl main-container md:py-4">
            {/* logo */}
            <NavigationLink
              href="/"
              logo
              inverted={darkMenu}
              callback={() => setMenuOpened(false)}
            >
              Au Duong Tuan
            </NavigationLink>
            {menuOpened ? (
              <button
                className={`inline-block -mx-2 px-2 py-1 rounded-xl  cursor-pointer text-white hover:bg-white/10`}
                onClick={() => setMenuOpened(false)}
              >
                <FiX className="w-6 h-6" />
              </button>
            ) : (
              <>
                {(bp == "md" || bp == "sm") && (
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
                )}
                <ul className="items-center hidden md:flex flex-gap-8">
                  {menuItems.map((item, i) => (
                    <li key={i}>
                      <NavigationLink
                        pathname={item.pathname}
                        href={item.href}
                        inverted={darkMenu}
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
              <ul className="flex flex-col w-full pt-16 flex-gap-y-2">
                {menuItems.map((item, i) => (
                  <li key={i} className="w-full">
                    <NavigationLink
                      pathname={item.pathname}
                      href={item.href}
                      className="block w-full px-4 py-4 text-left "
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
