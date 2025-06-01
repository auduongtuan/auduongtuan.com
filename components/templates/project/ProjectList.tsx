import { useEffect, useMemo, useState } from "react";
import ProjectCard from "@molecules/project/ProjectCard";
import Fade from "@atoms/Fade";
import Select from "@atoms/Select";
import { Project, ProjectGroup } from "@lib/notion";
import {
  PiClockCounterClockwiseBold,
  PiLightbulbBold,
  PiPaletteBold,
  PiWrenchBold,
} from "react-icons/pi";
import { event } from "@lib/gtag";
import SectionTitle from "@molecules/SectionTitle";
import { FiInfo } from "react-icons/fi";
import Tooltip from "@atoms/Tooltip";
import { trackEvent } from "@lib/utils";
import IconButton from "@atoms/IconButton";

export default function ProjectList({
  projects,
  projectGroups,
  className,
}: {
  projects: Project[];
  projectGroups: ProjectGroup[];
} & React.ComponentPropsWithoutRef<"section">) {
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
    trackEvent({
      event: "sort_projects",
      content: sortOptions.find((option) => option.value == value)?.name!,
      page: "/work",
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
  const projectInGroups = useMemo(
    () =>
      shownProjects.reduce(
        (acc, project) => {
          if (!project.group) return acc;
          if (!acc[project.group.id]) {
            acc[project.group.id] = [];
          }
          acc[project.group.id].push(project);
          return acc;
        },
        {} as Record<string, Project[]>,
      ),
    [shownProjects],
  );
  const [sent, setSent] = useState<string[]>([]);

  useEffect(() => {
    if (sent.length > 0) {
      trackEvent({
        event: "view_project_group_description",
        content: sent[sent.length - 1],
        page: "/work",
      });
    }
  }, [sent, sent.length]);

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
              align="end"
            />
          }
        />

        {sortBy == "group" ? (
          Object.keys(projectInGroups).map((groupId) => {
            const group = projectGroups.find((g) => g.id == groupId);
            if (!group) return null;
            return (
              <section key={groupId}>
                <h2 className="muted-text mb-4 flex items-center gap-2 text-base font-normal">
                  <span>{group.name}</span>
                  {group.description && (
                    <Tooltip
                      content={group.description}
                      onOpenChange={(open) => {
                        if (open === true && !sent.includes(group.name)) {
                          setSent([...sent, group.name]);
                        }
                      }}
                    >
                      <IconButton variant="ghost" size={"small"}>
                        <FiInfo />
                      </IconButton>
                      {/* <FiInfo className="inline-block w-4 h-4 ml-2 hover:text-accent" /> */}
                    </Tooltip>
                  )}
                </h2>
                <div className="mb-6 grid grid-cols-1 gap-6 md:mb-8 md:grid-cols-2">
                  {projectInGroups[groupId].map((project, i) => (
                    <ProjectCard
                      key={`${project.slug}-${i}`}
                      index={i}
                      project={project}
                      projects={shownProjects}
                    />
                  ))}
                </div>
              </section>
            );
          })
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
