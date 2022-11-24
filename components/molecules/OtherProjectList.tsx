import { Project } from "../../lib/project";
import Link from "next/link";
import CustomImage from "../atoms/CustomImage";
const OtherProjectList = ({ projects }: { projects: Project[] }) => {
  return (
    <div className="mt-6 grid grid-cols-6 gap-4 md:gap-6 group">
      {projects
        .filter((project) => project.meta.type == "casestudy")
        .map((project, i) => (
          (<Link
            href={`/project/${project.slug}`}
            key={i}
            className="col-span-6 md:col-span-3 lg:col-span-2 text-gray-900 p-3 transition-all rounded-xl flex flex-row items-center space-x-4 group-hover:opacity-80 hover:!opacity-100 hover:scale-[1.02] active:scale-[1.01] hover:outline-blue-800 hover:outline-2"
            style={{ backgroundColor: project.meta.background }}>

            {project.meta.logo && (
              <div className="w-12 h-12 grow-0 shrink-0">
                <CustomImage
                  src={project.meta.logo}
                  slug={project.slug}
                  width={48}
                  height={48}
                  alt={project.meta.title}
                />
              </div>
            )}
            <div>
              <h3 className="text-xl">{project.meta.title}</h3>
              <p className="text-sm text-gray-700">{project.meta.tagline}</p>
            </div>

          </Link>)
        ))}
    </div>
  );
};
export default OtherProjectList;
