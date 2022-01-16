import React, {useEffect} from 'react'
import { Project } from '../../lib/project'
import { useInView } from 'react-intersection-observer';
import { useAppContext } from "../../lib/context/AppContext";
import Badge from "../atoms/Badge";
interface ProjectSingleHeaderProps {
  project: Project
}

export const ProjectSingleHeader = ({project}:ProjectSingleHeaderProps) => {
  const appContext = useAppContext();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: '-10px'
  });
  useEffect(() => {
    appContext && appContext.setHeaderInView && appContext.setHeaderInView(inView)    
    // console.log(entry);
  }, [inView, appContext]);

  return (
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-y-8 gap-4">
            <div className='col-span-12 md:col-span-6 md:row-span-1'>
              <h1 className='text-4xl md:text-5xl lg:text-6xl font-display tracking-tight opacity-0 animate-slide-in-fast'>{project.meta.title}</h1>
            </div>
            {project.meta.achievements && <div className='col-span-12 md:col-span-6 md:row-span-1 md:justify-self-end relative'>
              <div className='flex gap-4 lg:absolute right-0'>
              {project.meta.achievements.map((achievement, i) => 
                <Badge key={i} index={i} content={achievement} />
              )}
              </div>
            </div>}
            <div className='col-span-12 grid grid-cols-2 gap-x-4 gap-y-8 md:col-start-1 md:col-span-4 md:row-span-3 md:self-end'>
              <div className="col-span-1 md:col-span-2 opacity-0 animation-delay-200 animate-slide-in-fast">
                <h5 className='text-sm leading-6 tracking-tighter font-display text-gray-500 uppercase font-semibold'>Tools used</h5>
                <ul>
                {project.meta.tools && project.meta.tools.map((tool, i) => <li className='mt-3' key={i}>{tool}</li>)}
                </ul>
              </div>
              <div className='col-span-1 md:col-span-2 opacity-0 animation-delay-300 animate-slide-in-fast'>
                <h5 className='text-sm leading-6 tracking-tighter font-display text-gray-500 uppercase font-semibold'>What I did</h5>
                <ul>
                {project.meta.roles && project.meta.roles.map((role, i) => <li className='mt-3' key={i}>{role}</li>)}
                </ul>
              </div>
            </div>
            <p className={`opacity-0 animation-delay-200 animate-slide-in-fast col-span-12 ${project.meta.achievements ? 'md:mt-28' : 'md:mt-10'} md:col-start-5 md:col-span-8 md:row-span-3 md:self-end big-text`}>{project.meta.description}</p>
        </div>
      </div>
    </header>
  )
}
