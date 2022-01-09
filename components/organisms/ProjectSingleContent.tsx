import React from 'react'
import ProjectContentMenu from "../molecules/ProjectContentMenu"
import { MDXRemote } from 'next-mdx-remote'
import ProjectComponents from '../atoms/ProjectComponents'
import {Project} from "../../lib/project"
const ProjectSingleContent = ({project}:{project: Project}) => {
  return (
    <div className="p-content pt-0 bg-zinc-100 relative" style={{background: project.meta.contentBackground && project.meta.contentBackground}}>
      <ProjectContentMenu />
      <article id="project" className="main-container">
      <div className="project-grid">
      <MDXRemote {...project.parsedContent} components={ProjectComponents(project.slug)} />
      </div>
      </article>
    </div>
  )
}
export default ProjectSingleContent;
