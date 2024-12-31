import { useEffect, useMemo, useState } from "react";
import ProjectItem from "./ProjectItem";
import Fade from "@atoms/Fade";
import Select from "@atoms/Select";
import { NotionProject } from "@lib/notion";
import {
  PiClockCounterClockwiseBold,
  PiLightbulbBold,
  PiPaletteBold,
  PiWrenchBold,
} from "react-icons/pi";
import { event } from "@lib/gtag";

export default function ProjectList({
  projects,
}: {
  projects: NotionProject[];
}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sortBy, setSortBy] = useState("group");
  const sortOptions = [
    {
      value: "group",
      name: "Group & Chronology",
      icon: <PiClockCounterClockwiseBold />,
    },
    {
      value: "visual",
      name: "Visual aesthetics",
      icon: <PiPaletteBold />,
    },
    {
      value: "product",
      name: "Product ideation",
      icon: <PiLightbulbBold />,
    },
    {
      value: "engineering",
      name: "Engineering intensity",
      icon: <PiWrenchBold />,
    },
  ];
  const setSortByAndTrack = (value: string) => {
    setSortBy(value);
    event({
      action: "sort_projects",
      category: "engagement",
      label: sortOptions.find((option) => option.value == value)?.name!,
    });
  };

  const handleScroll = () => {
    const position = window.pageYOffset;
    setScrollPosition(position);
  };

  const sortingFunction = (a: NotionProject, b: NotionProject) => {
    if (sortBy == "group") {
      return b.date?.localeCompare(a.date);
    }
    const aPoint = a?.points[sortBy] ?? 0;
    const bPoint = b?.points[sortBy] ?? 0;
    return bPoint > aPoint
      ? 1
      : bPoint < aPoint
      ? -1
      : b.date?.localeCompare(a.date);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sortBy]);

  const shownProjects = projects.sort(sortingFunction);

  const projectGroups = useMemo(
    () =>
      shownProjects.reduce((acc, project) => {
        if (!project.group) return acc;
        if (!acc[project.group]) {
          acc[project.group] = [];
        }
        acc[project.group].push(project);
        return acc;
      }, {} as Record<string, NotionProject[]>),
    [shownProjects]
  );

  return (
    <section id="works">
      <Fade
        className="main-container py-section-vertical"
        delay={500}
        duration={200}
      >
        <div className="flex flex-col mb-8 md:flex-row flex-gap-4 md:justify-between md:items-center">
          <div className="flex items-center sub-heading">Selected works</div>
          <div>
            <div className="flex flex-wrap items-center flex-gap-x-4 flex-gap-y-2 ">
              <Select
                label="Sort by"
                value={sortBy}
                buttonClassName={"max-w-[240px]"}
                onChange={setSortByAndTrack}
                options={sortOptions}
              />
            </div>
          </div>
        </div>

        {sortBy == "group" ? (
          Object.keys(projectGroups).map((group) => (
            <section key={group}>
              <h2 className="mb-4 text-base font-normal muted-text">{group}</h2>
              <div className="grid grid-cols-12 gap-6 mb-6 md:mb-8">
                {projectGroups[group].map((project, i) => (
                  <ProjectItem
                    key={`${project.slug}-${i}`}
                    index={i}
                    project={project}
                    projects={shownProjects}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {shownProjects.map((project, i) => (
              <ProjectItem
                key={`{project.slug}-${i}`}
                index={i}
                project={project}
                projects={shownProjects}
              />
            ))}
          </div>
        )}
      </Fade>
    </section>
  );
}
