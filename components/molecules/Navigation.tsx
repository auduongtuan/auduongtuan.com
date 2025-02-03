import React, { useEffect, useState, Fragment } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import NavigationLink from "@atoms/NavigationLink";
import useBreakpoint from "@hooks/useBreakpoint";
import { Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import useAppStore from "@store/useAppStore";

const menuItems = [
  { pathname: "/", href: "/", name: "Home" },
  { pathname: "/about", href: "/about", name: "About" },
  { pathname: "/work", href: "/work", name: "Work" },
  { pathname: "/blog", href: "/blog", name: "Blog" },
];

const Navigation = React.memo(() => {
  const { menuOpened, pauseScrollEvent, setMenuOpened } = useAppStore();
  const [hidden, setHidden] = useState(false);
  const bp = useBreakpoint();
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      if (pauseScrollEvent) return;
      const st = window.scrollY || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
      const threshold = 40;
      if (st <= threshold) {
        setHidden(false);
      } else if (Math.abs(st - lastScrollTop) > threshold) {
        setHidden(st > lastScrollTop);
      }
      lastScrollTop = st;
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pauseScrollEvent]);
  // close mobile menu when bp changes
  useEffect(() => {
    setMenuOpened(false);
  }, [bp, setMenuOpened]);

  // may need to
  // https://paco.me/writing/disable-theme-transitions

  const NavigationStyles = twMerge(
    "w-full top-0 left-0 z-42 transition-transform duration-150 sticky",
    "bg-navigation backdrop-blur-md text-primary",
    "border-b border-divider",
    hidden && "-translate-y-full",
  );
  return (
    <>
      <header className={NavigationStyles}>
        <nav className="text-display main-container flex items-center justify-between py-2 font-sans text-base font-semibold md:py-3.5 md:text-xl">
          {/* logo */}
          <NavigationLink href="/" logo callback={() => setMenuOpened(false)}>
            Au Duong Tuan
          </NavigationLink>
          {menuOpened ? (
            <button
              className={`text-primary hover:bg-surface-raised -mx-2 inline-block cursor-pointer rounded-xl px-2 py-1`}
              onClick={() => setMenuOpened(false)}
            >
              <FiX className="h-6 w-6" />
            </button>
          ) : (
            <>
              {(bp == "md" || bp == "sm") && (
                <button
                  className={`-mx-2 inline-block cursor-pointer rounded-xl px-2 py-1 ${"text-primary hover:bg-surface-raised"}`}
                  onClick={() => setMenuOpened(true)}
                >
                  <FiMenu className="h-6 w-6" />
                </button>
              )}
              <ul className="hidden items-center gap-8 md:flex">
                {menuItems.map((item, i) => (
                  <li key={i}>
                    <NavigationLink pathname={item.pathname} href={item.href}>
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
        <div className={`bg-surface fixed z-40 h-full w-full`}>
          <div className="main-container font-sans">
            <ul className="py-section-vertical flex w-full flex-col gap-y-2">
              {menuItems.map((item, i) => (
                <li key={i} className="w-full">
                  <NavigationLink
                    pathname={item.pathname}
                    href={item.href}
                    className="block w-full px-4 py-4 text-left"
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
    </>
  );
});

Navigation.displayName = "Navigation";
export default Navigation;
