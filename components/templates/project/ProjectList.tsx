import { useEffect, useMemo, useState } from "react";
import ProjectCard from "@molecules/project/ProjectCard";
import Fade from "@atoms/Fade";
import Select from "@atoms/Select";
import { Project } from "@lib/notion";
import {
  PiClockCounterClockwiseBold,
  PiLightbulbBold,
  PiPaletteBold,
  PiWrenchBold,
} from "react-icons/pi";
import { event } from "@lib/gtag";
import SectionTitle from "@molecules/SectionTitle";

export default function ProjectList({
  projects,
  className,
}: { projects: Project[] } & React.ComponentPropsWithoutRef<"section">) {
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

  const sortingFunction = (a: Project, b: Project) => {
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
      }, {} as Record<string, Project[]>),
    [shownProjects]
  );

  return (
    <section id="works" className={className}>
      <Fade className="main-container" delay={500} duration={200}>
        <SectionTitle
          title="Selected projects"
          action={
            <Select
              label="Sort by"
              value={sortBy}
              buttonClassName={"max-w-[240px]"}
              onChange={setSortByAndTrack}
              options={sortOptions}
            />
          }
        />

        {sortBy == "group" ? (
          Object.keys(projectGroups).map((group) => (
            <section key={group}>
              <h2 className="mb-4 text-base font-normal muted-text">{group}</h2>
              <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 md:mb-8">
                {projectGroups[group].map((project, i) => (
                  <ProjectCard
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {shownProjects.map((project, i) => (
              <ProjectCard
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
