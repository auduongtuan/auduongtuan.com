import React, { useEffect, useState } from "react";
import ProjectItem from "./ProjectItem";
import { Project } from "@lib/project";
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiHeart } from "react-icons/fi";
import Fade from "@atoms/Fade";
export default function ProjectList({ projects }: { projects: Project[] }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sortBy, setSortBy] = useState("coolness");
  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  const sortingFunction = (a, b) => {
    if (sortBy == "coolness") {
      return b.meta?.coolness > a.meta?.coolness
        ? 1
        : b.meta?.coolness < a.meta?.coolness
        ? -1
        : b.meta.date?.localeCompare(a.meta.date);
    } else if (sortBy == "time-asc") {
      return a.meta.date?.localeCompare(b.meta.date);
    } else {
      return b.meta.date?.localeCompare(a.meta.date);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sortBy]);

  const activeFilterClass =
    "inline-flex flex-gap-x-1 items-center text-sm font-medium bg-blue-200 hover:bg-blue-300 text-gray-800 rounded-full px-2 py-1";
  const filterClass =
    "inline-flex flex-gap-x-1 items-center text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-2 py-1";
  return (
    <section id="works">
      <Fade className="main-container p-content" delay={500} duration={200}>
        <div className="flex flex-col md:flex-row mb-8 flex-gap-4 md:justify-between md:items-center">
          <div className="flex items-center sub-heading">Selected works</div>
          <div className=" flex items-center space-x-2">
            <button
              className={sortBy == "coolness" ? activeFilterClass : filterClass}
              onClick={() => setSortBy("coolness")}
            >
              Featured <FiHeart />
            </button>
            <button
              className={
                sortBy == "time-desc" ? activeFilterClass : filterClass
              }
              onClick={() => setSortBy("time-desc")}
            >
              Lastest <FiArrowDown />
            </button>
            <button
              className={sortBy == "time-asc" ? activeFilterClass : filterClass}
              onClick={() => setSortBy("time-asc")}
            >
              Earliest <FiArrowUp />
            </button>
          </div>
        </div>

        <main className="grid grid-cols-12 gap-6">
          {projects.sort(sortingFunction).map((project, i) => (
            <ProjectItem
              key={`${project.slug}-${i}`}
              index={i}
              project={project}
            />
          ))}
        </main>
      </Fade>
    </section>
  );
}
