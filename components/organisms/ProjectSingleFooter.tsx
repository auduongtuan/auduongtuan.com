import Link from 'next/link'
import React from 'react'
import { Project } from '../../lib/project'
import CustomImage from '../atoms/CustomImage'
interface ProjectSingleFooterProps {
  projects: Project[];
}
const ProjectSingleFooter = ({projects}:ProjectSingleFooterProps) => {
  return (
    <div className="p-content bg-custom-neutral-900 text-white relative">
      <section className="main-container">
      <h2>Other projects</h2>
      <div className='mt-8 grid grid-cols-6 gap-6 group'>

      {projects.filter(project => project.meta.type == "casestudy").map((project, i) =>
      <Link href={`/project/${project.slug}`} key={i}>
        <a className="col-span-6 md:col-span-3 lg:col-span-2 text-gray-900 p-3 transition-all rounded-xl flex flex-row items-center gap-4 group-hover:opacity-80 hover:!opacity-100 hover:scale-[1.02] active:scale-[1.01] hover:outline-blue-800 hover:outline-2" style={{backgroundColor: project.meta.background}}>
          {project.meta.logo && <div className='w-12 h-12 grow-0 shrink-0'>
            <CustomImage src={project.meta.logo} slug={project.slug} width={48} height={48} alt={project.meta.title} />
            </div>}
          <div>
            <h3 className="text-xl">{project.meta.title}</h3>
            <p>{project.meta.tagline}</p>

          </div>
        </a>
        </Link>
      )}

      </div>

      </section>
    </div>
  )
}
export default ProjectSingleFooter;