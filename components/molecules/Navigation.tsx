import NavigationLink from "@atoms/NavigationLink";
import { Transition } from "@atoms/Transition";
import useBreakpoint from "@hooks/useBreakpoint";
import useAppStore from "@store/useAppStore";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

const menuItems = [
  { href: "/", name: "Home" },
  { href: "/about", name: "About" },
  { href: "/work", name: "Work" },
  { href: "/blog", name: "Blog" },
];

const Navigation = React.memo(() => {
  const { menuOpened, pauseScrollEvent, setMenuOpened } = useAppStore();
  const [hidden, setHidden] = useState(false);
  const bp = useBreakpoint();

  const router = useRouter();
  const isActive = (href: string) =>
    router.asPath == href ||
    router.pathname == href.split("#")[0] ||
    router.pathname.includes(href + "/") ||
    (href.includes("/work") && router.pathname.includes("/project/"));
  const [currentActive, setCurrentActive] = useState(
    menuItems.find((item) => isActive(item.href))?.href,
  );
  useEffect(() => {
    setCurrentActive(menuItems.find((item) => isActive(item.href))?.href);
  }, [router, isActive]);
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

  const menuRefs = useRef<Record<string, HTMLAnchorElement>>({});
  // Add state for indicator style
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Update indicator style when currentActive changes or after mount
  useEffect(() => {
    if (currentActive && menuRefs.current[currentActive]) {
      setIndicatorStyle({
        left: menuRefs.current[currentActive].offsetLeft + 6,
        width: menuRefs.current[currentActive].offsetWidth - 12,
        opacity: 1,
      });
    } else {
      setIndicatorStyle({
        left: 0,
        width: 0,
        opacity: 0,
      });
    }
  }, [currentActive, bp]);

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
              <div className="relative hidden items-center md:flex">
                <ul className="flex items-center gap-8">
                  {menuItems.map((item, i) => (
                    <li key={i}>
                      <NavigationLink
                        href={item.href}
                        isActive={currentActive == item.href}
                        ref={(el) => {
                          if (el) {
                            menuRefs.current = {
                              ...menuRefs.current,
                              [item.href]: el,
                            };
                          }
                        }}
                      >
                        {item.name}
                      </NavigationLink>
                    </li>
                  ))}
                </ul>
                {currentActive && menuRefs.current[currentActive] && (
                  <span
                    className="bg-secondary absolute -bottom-3.75 h-1 w-0 origin-center rounded-t-full opacity-0 transition-all ease-in-out"
                    style={indicatorStyle}
                  ></span>
                )}
              </div>
            </>
          )}
        </nav>
      </header>
      {/* MOBILE MENU */}
      <Transition
        show={menuOpened}
        starting="opacity-0 -translate-y-12"
        ending="opacity-0 -translate-y-12"
        className="transition-all duration-300 ease-out"
      >
        <div className={`bg-surface fixed z-40 h-full w-full`}>
          <div className="main-container font-sans">
            <ul className="py-section-vertical flex w-full flex-col gap-y-2">
              {menuItems.map((item, i) => (
                <li key={i} className="w-full">
                  <NavigationLink
                    href={item.href}
                    className="block w-full px-4 py-4 text-left"
                    callback={() => setMenuOpened(false)}
                    isActive={currentActive == item.href}
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
