import Link from 'next/link'
import React from 'react'
import { Project } from '../../lib/project'
const ProjectSingleFooter = ({projects}:{projects:Project[]}) => {
  return (
    <div className="py-20 bg-neutral-900 text-white relative">
      <section className="main-container">
      <h2>Other projects</h2>
      <ul className='mt-8 grid grid-cols-3 gap-2'>

      {projects.filter(project => project.meta.type == "casestudy").map((project, i) =>
        <li className="col-span-1" key={i}>
        <Link href={`/project/${project.slug}`}>{project.meta.title}</Link>
        </li>
      )}

      </ul>

      </section>
    </div>
  )
}
export default ProjectSingleFooter;