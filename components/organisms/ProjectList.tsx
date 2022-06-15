import React, {useEffect, useState} from 'react'
import ProjectItem from "../molecules/ProjectItem";
import { Project } from "../../lib/project";
import { FiArrowDown, FiArrowLeft, FiArrowUp, FiHeart } from 'react-icons/fi';
export default function ProjectList({projects}:{projects:Project[]}) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [sortBy, setSortBy] = useState('coolness');
  const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
  };

  const sortingFunction = (a, b) => {
    if (sortBy == 'coolness') {
      return b.meta?.coolness > a.meta?.coolness ? 1 : (b.meta?.coolness < a.meta?.coolness ? -1 : b.meta.date?.localeCompare(a.meta.date));
    }
    else if (sortBy == 'time-asc') {
      return a.meta.date?.localeCompare(b.meta.date);
    }
    else {
      return b.meta.date?.localeCompare(a.meta.date);
    }
  }

  useEffect(() => {
      handleScroll();
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
          window.removeEventListener('scroll', handleScroll);
      };
  }, [sortBy]);

  const activeFilterClass = 'inline-flex gap-x-1 items-center text-sm font-medium bg-blue-200 hover:bg-blue-300 text-gray-800 rounded-full px-2 py-1';
  const filterClass = 'inline-flex gap-x-1 items-center text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full px-2 py-1';
  return (
      <section id="works">
        <div className="main-container p-content opacity-0 animate-fade-in-fast animation-delay-400">
          {/* <aside className="absolute tall:fixed transition-opacity ease-linear animate-bounce hidden lg:block" style={{bottom: `${scrollPosition/1.4}px`, opacity: (scrollPosition >= 300) ? 0 : (300-scrollPosition)/300}}>
            <div className='text-2xl text-dark-blue-900 tall:-translate-y-32 tall:-translate-x-40 tall:-rotate-90' >
              <div className='flex items-center mb-4 tall:mb-0'>
              <FiArrowDown className='block tall:hidden'/>
              <FiArrowLeft className='hidden tall:block'/>
              <span className="inline-block ml-4">Selected works</span>
              </div>
            </div>
          </aside> */}
          <div className='flex flex-col md:flex-row mb-8 flex-gap-4 md:justify-between md:items-center'>
          <div className='flex items-center text-2xl font-medium text-gray-800 gap-1'>Selected works</div>
          <div className=' flex items-center gap-1'>
              <button className={sortBy == 'coolness' ? activeFilterClass : filterClass} onClick={() => setSortBy('coolness')}>Featured <FiHeart /></button>
              <button className={sortBy == 'time-desc' ? activeFilterClass : filterClass} onClick={() => setSortBy('time-desc')}>Lastest <FiArrowDown /></button>
              <button className={sortBy == 'time-asc' ? activeFilterClass : filterClass} onClick={() => setSortBy('time-asc')}>Earliest <FiArrowUp /></button>
        
          </div>
          </div>
        
          <main className="grid grid-cols-12 gap-6">
          {projects.sort(sortingFunction).map((project, i) => (
            <ProjectItem key={`${project.slug}-${i}`} index={i} project={project} />
          ))}
          </main>
        </div>
      </section>
  )
}
