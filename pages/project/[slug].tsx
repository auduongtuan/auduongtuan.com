import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import DefaultErrorPage from "next/error";
import {
  Project,
  allProjects,
  projectSlugs,
  getProject,
} from "../../lib/project";
import { serialize } from "next-mdx-remote/serialize";
import ProjectSinglePage, {
  ProjectSinglePageProps,
} from "../../components/templates/project/ProjectSinglePage";

export default function ProjectView({
  project,
  projects,
}: ProjectSinglePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (
    !project ||
    project.meta.type == "link" ||
    project.meta.type == "private"
  ) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }
  return <ProjectSinglePage project={project} projects={projects} />;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const project = getProject(slug);
  if (project)
    project.parsedContent = await serialize(project.content, {
      mdxOptions: {
        remarkPlugins: [require("remark-prism")],
        development: process.env.NODE_ENV === "development",
      },
    });

  return {
    props: {
      project: project,
      projects: allProjects,
    },
  };
};
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = projectSlugs.map((slug) => ({
    params: { slug: slug },
  }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false };
};
