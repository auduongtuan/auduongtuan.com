import {
  NotionProject,
  getNotionProjectContent,
  getNotionProjects,
  getNotionProjectsWithCache,
} from "@lib/notion";
import { isDevEnvironment } from "@lib/utils";
import ProjectSinglePage, {
  ProjectSinglePageProps,
} from "@templates/project/ProjectSinglePage";
import CryptoJS from "crypto-js";
import { GetStaticPaths, GetStaticProps } from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";

const PASSWORD = process.env.PROJECT_PASSWORD as string;

export default function ProjectView({
  project,
  projects,
  notionContent,
}: ProjectSinglePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!project || !project.caseStudy) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    );
  }
  return (
    <ProjectSinglePage
      project={project}
      projects={projects}
      notionContent={notionContent}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  // Get all posts from the Notion database
  const projects = await getNotionProjectsWithCache();
  // Find the post with a matching slug property
  let project: NotionProject | undefined = projects.find(
    (proj) => proj.slug === slug
  );
  if (!project) {
    return {
      notFound: true,
    };
  }
  let notionContent;
  // Get the Notion page data and all child block data
  const rawNotionContent = await getNotionProjectContent(project.id);
  // TBD: Encrypt the content if the post is protected
  if (project.protected) {
    const json = JSON.stringify(rawNotionContent);
    const encrypted = CryptoJS.AES.encrypt(json, PASSWORD).toString();
    notionContent = encrypted;
  } else {
    notionContent = rawNotionContent;
  }

  return {
    props: {
      project: project,
      projects: projects,
      notionContent,
    },
    revalidate: 120,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getNotionProjectsWithCache();
  // old mdx paths
  // const paths = projectSlugs.map((slug) => ({
  //   params: { slug: slug },
  // }));
  const paths = projects.map((project) => ({
    params: { slug: project.slug },
  }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false };
};
