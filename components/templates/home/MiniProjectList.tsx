import Fade from "@atoms/Fade";
import ProjectCard from "@molecules/project/ProjectCard";
import { Project } from "@lib/notion";
import Button from "@atoms/Button";
import SectionTitle from "@molecules/SectionTitle";
import IconButton from "@atoms/IconButton";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@hooks/useResizeObserver";
import { trackEvent } from "@lib/utils";

export default function ProjectList({ projects }: { projects: Project[] }) {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement> | HTMLDivElement) => {
      const target = e instanceof HTMLDivElement ? e : e.currentTarget;
      setShowLeft(target.scrollLeft > 0);
      setShowRight(target.scrollLeft < target.scrollWidth - target.clientWidth);
    },
    [],
  );
  useEffect(() => {
    if (containerRef.current) handleScroll(containerRef.current);
  }, [containerRef]);

  const size = useResizeObserver(containerRef);
  const next = useCallback(() => {
    if (containerRef.current) {
      const firstCard = firstCardRef.current;
      if (!firstCard) return;
      trackEvent({
        event: "scroll_project_list",
        content: "next_button",
        page: window.location.pathname,
      });
      const cardWidth = firstCard?.getBoundingClientRect().width || 0 + 24;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft + cardWidth,
        behavior: "smooth",
      });
    }
  }, [containerRef, size]);

  const prev = useCallback(() => {
    if (containerRef.current) {
      const firstCard = firstCardRef.current;
      if (!firstCard) return;
      trackEvent({
        event: "scroll_project_list",
        content: "prev_button",
        page: window.location.pathname,
      });
      const cardWidth = firstCard?.getBoundingClientRect().width || 0 + 24;
      containerRef.current.scrollTo({
        left: containerRef.current.scrollLeft - cardWidth,
        behavior: "smooth",
      });
    }
  }, [containerRef, size]);

  return (
    <section
      id="works"
      className="relative"
      style={
        {
          "--half-margin":
            "calc(var(--section-horizontal-padding) + (var(--vw) * 100 - var(--main-width)) / 2)",
        } as React.CSSProperties
      }
    >
      <Fade
        // className="main-container ml-0"
        delay={500}
        duration={200}
      >
        <div className="main-container">
          <SectionTitle
            title="Featured works"
            action={
              <Button href="/work" secondary>
                View all
              </Button>
            }
          />
        </div>
        <div
          className="scrollbar-hidden max-w-full snap-x overflow-x-scroll"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <div className="flex">
            <div className="flex shrink-0 gap-6">
              {projects
                .sort((a, b) => b.point - a.point)
                .slice(0, 6)
                .map((project, i) => (
                  <div
                    key={`{project.slug}-${i}`}
                    className="flex snap-start last:pr-[calc(var(--half-margin)*2)]"
                    data-card-index={i}
                    ref={i === 0 ? firstCardRef : null}
                  >
                    <ProjectCard
                      key={`{project.slug}-${i}`}
                      index={i}
                      project={project}
                      projects={projects}
                      className="w-[calc(min(440px,var(--vw)*100-var(--section-horizontal-padding)*2-60px))] shrink-0 translate-x-(--half-margin)"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div
          className="absolute top-1/2 left-(--half-margin) hidden -translate-y-1/2 transition-opacity duration-100 ease-in-out xl:block"
          style={{ opacity: showLeft ? 1 : 0 }}
        >
          <IconButton
            size={"large"}
            onClick={prev}
            className="-ml-15"
            variant="overlay"
          >
            <FiArrowLeft />
          </IconButton>
        </div>
        <div
          className="absolute top-1/2 right-(--half-margin) hidden -translate-y-1/2 transition-opacity duration-100 ease-in-out xl:block"
          style={{ opacity: showRight ? 1 : 0 }}
        >
          <IconButton
            size={"large"}
            onClick={next}
            className="-mr-15"
            variant={"overlay"}
          >
            <FiArrowRight />
          </IconButton>
        </div>
        <div className="main-container">
          <Button href="/work" className="mt-6 w-full justify-center" secondary>
            View all projects
          </Button>
        </div>
      </Fade>
    </section>
  );
}
