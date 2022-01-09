import React, {useEffect, useState} from 'react'
import ProjectItem from "../molecules/ProjectItem";
import { Project } from "../../lib/project";
export default function ProjectList({projects}:{projects:Project[]}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, []);
 
  return (
      <section id="works">
        <div className="main-container p-content opacity-0 animate-fade-in-fast animation-delay-400">
          <aside className="fixed transition-opacity ease-linear animate-bounce hidden lg:block" style={{bottom: `${scrollPosition/1.4}px`, opacity: (scrollPosition >= 300) ? 0 : (300-scrollPosition)/300}}>
            <div className='text-2xl text-dark-blue-900 -translate-y-32 -translate-x-40 -rotate-90' ><div className=''>← Selected works</div></div>
          </aside>
          <main className="grid grid-cols-12 gap-6">
          {projects.sort((a, b) => b.meta.date.localeCompare(a.meta.date)).map((project, i) => (
            <ProjectItem key={i} index={i} project={project} />
          ))}
          </main>
        </div>
      </section>
  )
}
