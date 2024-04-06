import { useEffect, useMemo, useState } from "react";
import NotionProjectItem from "./NotionProjectItem";
import Fade from "@atoms/Fade";
import Select from "@atoms/Select";
import { NotionProject } from "@lib/notion";

export default function NotionProjectList({
  projects,
}: {
  projects: NotionProject[];
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sortBy, setSortBy] = useState("coolness");
  const [roleFilter, setRoleFilter] = useState<string[]>([]);

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  const filteringFunction = (project: NotionProject) => {
    if (roleFilter.length == 0) return true;
    if (project.roles == null) return false;
    return project.roles.some((role) => roleFilter.includes(role));
  };

  const sortingFunction = (a: NotionProject, b: NotionProject) => {
    if (sortBy == "coolness") {
      const aCoolness = a?.point ?? 0;
      const bCoolness = b?.point ?? 0;
      return bCoolness > aCoolness
        ? 1
        : bCoolness < aCoolness
        ? -1
        : b.date?.localeCompare(a.date);
    } else if (sortBy == "time-asc") {
      return a.date?.localeCompare(b.date);
    } else {
      return b.date?.localeCompare(a.date);
    }
  };

  const roles = useMemo(
    () =>
      projects.reduce<string[]>((acc, project) => {
        if (project.roles == null) return acc;
        project.roles.forEach((role) => {
          if (!acc.includes(role)) {
            acc.push(role);
          }
        });
        return acc;
      }, []),
    [projects]
  );

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sortBy]);

  const shownProjects = projects
    .filter(filteringFunction)
    .sort(sortingFunction);

  return (
    <section id="works">
      <Fade className="main-container p-content" delay={500} duration={200}>
        <div className="flex flex-col mb-8 md:flex-row flex-gap-4 md:justify-between md:items-center">
          <div className="flex items-center sub-heading">Selected works</div>
          <div>
            <div className="flex flex-wrap items-center flex-gap-x-4 flex-gap-y-2 ">
              <Select
                label="Sort by"
                value={sortBy}
                buttonClassName={"w-[120px]"}
                onChange={setSortBy}
                options={[
                  {
                    value: "coolness",
                    name: "Featured",
                  },
                  {
                    value: "time-desc",
                    name: "Latest",
                  },
                  {
                    value: "time-asc",
                    name: "Earliest",
                  },
                ]}
              />
              <Select
                label="Filter by"
                value={roleFilter}
                buttonClassName={"w-[120px]"}
                renderValue={(selected) => {
                  if (
                    !selected ||
                    selected?.length == 0 ||
                    selected.length == roles.length
                  )
                    return "All roles";
                  if (selected.length == 1) return selected[0];
                  return selected.length + " roles";
                }}
                multiple
                onChange={setRoleFilter}
                options={roles.sort().map((tool) => ({
                  value: tool,
                  name: tool,
                }))}
              />
              {/* <button
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
            </button> */}
            </div>
          </div>
        </div>

        <main className="grid grid-cols-12 gap-6">
          {shownProjects.map((project, i) => (
            <NotionProjectItem
              key={`${project.slug}-${i}`}
              index={i}
              project={project}
              projects={shownProjects}
            />
          ))}
        </main>
      </Fade>
    </section>
  );
}
