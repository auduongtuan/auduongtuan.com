import React, { useEffect, useState, useRef, useCallback } from "react";
import slugify from "slugify";
import Fade from "../atoms/Fade";
interface VisibleInfo {
  start: number;
  end: number;
  length: number;
}

const ContentMenu = () => {
  const [headings, setHeadings] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState<number>(0);
  const [maxLength, setMaxLength] = useState<number>(0);
  const [visibleInfo, setVisibleInfo] = useState<VisibleInfo[]>([]);

  useEffect(() => {
    const headingsTemp = Array.from(
      document.querySelectorAll("h2")
    ) as HTMLElement[];
    setHeadings(headingsTemp);
    const setupHeading = () => {
      let visibleInfoTemp: VisibleInfo[] = [];
      headingsTemp.forEach((heading, i) => {
        const start = heading.getBoundingClientRect().top + window.scrollY;
        const parentEl = heading.parentElement as HTMLElement;
        // if (!parentEl) console.log(heading);
        const end =
          i != headingsTemp.length - 1
            ? headingsTemp[i + 1].getBoundingClientRect().top + window.scrollY
            : parentEl?.offsetTop + parentEl?.clientHeight;
        let nextSibling = heading.nextElementSibling;
        let count = 0;
        while (
          nextSibling &&
          nextSibling.tagName != "H2" &&
          nextSibling.tagName != "h2"
        ) {
          count++;
          nextSibling = nextSibling.nextElementSibling;
        }
        heading.style.gridRow = `span ${count}`;
        visibleInfoTemp.push({ start: start, end: end, length: end - start });
      });
      setVisibleInfo(visibleInfoTemp);
    };
    window.addEventListener("resize", setupHeading);
    // Delay to make sure it calculate correctly
    setTimeout(() => setupHeading(), 100);
    return () => {
      window.removeEventListener("resize", setupHeading);
    };
  }, []);

  useEffect(() => {
    headings.forEach((heading) => {
      if (heading.innerText)
        heading.id = slugify(heading.innerText, { lower: true, strict: true });
    });
    visibleInfo.length > 0 &&
      setMaxLength(
        visibleInfo.reduce((a, b) => (a.length > b.length ? a : b)).length
      );
    const calculateVisiblePercentage = (start, end) => {
      window.scrollY;
    };
    const vh = document.documentElement.clientHeight;
    const threshold = 110;
    const handleOnScroll = () => {
      const currentActive = visibleInfo.reduce((prev, current, i) => {
        const secondCondtion =
          i == 0 ||
          (i > 0 && window.scrollY - threshold > visibleInfo[i - 1].start);
        if (
          window.scrollY + vh - threshold >= visibleInfo[i].start &&
          secondCondtion
        ) {
          return i;
        } else {
          return prev;
        }
      }, 0);
      setActive(currentActive);
    };
    window.addEventListener("scroll", handleOnScroll);
    return () => {
      // trackerList.forEach((tracker) => observer.unobserve(tracker));
      window.addEventListener("scroll", handleOnScroll);
    };
  }, [headings, visibleInfo]);

  return (
    <div className="absolute top-0 bottom-0 left-0 h-full p-content">
      <Fade
        as="aside"
        className={`w-60 hidden 2xl:block sticky top-1/2`}
        delay={100}
      >
        <ul className="flex flex-col flex-gap-y-1 group">
          {headings &&
            headings.length > 2 &&
            headings.map((heading, i) => (
              <li key={i} className="flex items-center">
                <div className="w-8 ml-2 transition-all duration-350 ease-bounce group-hover:scale-x-[3] group-hover:opacity-0 origin-left">
                  <span
                    className={`block h-[2px] rounded ${
                      i == active ? "bg-gray-900" : "bg-gray-300"
                    }`}
                    style={
                      visibleInfo[i] && maxLength
                        ? {
                            width:
                              (visibleInfo[i].length / maxLength) * 32 + "px",
                          }
                        : {}
                    }
                  ></span>
                </div>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    if (i != 0) {
                      heading.scrollIntoView({ behavior: "smooth" });
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className={`pl-0 transition-all duration-400 ease-bounce opacity-0 group-hover:opacity-100 origin-left -translate-x-10 group-hover:-translate-x-4 text-sm font-semibold hover:text-gray-800 ${
                    i == active ? "text-gray-900" : "text-gray-400"
                  }`}
                  href={`#${heading.id}`}
                >
                  {heading.innerText}
                </a>
              </li>
            ))}
        </ul>
      </Fade>
    </div>
  );
};
ContentMenu.displayName = "ContentMenu";
export default ContentMenu;
