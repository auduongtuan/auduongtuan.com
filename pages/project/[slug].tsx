import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import DefaultErrorPage from "next/error";
import ProjectSinglePage, {
  ProjectSinglePageProps,
} from "@templates/project/ProjectSinglePage";
import {
  NotionProject,
  getNotionProjectContent,
  getNotionProjects,
  getNotionProjectsWithCache,
} from "@lib/notion";
import { isDevEnvironment } from "@lib/utils";

export default function ProjectView({
  project,
  projects,
  mdxContent,
  notionContent,
}: ProjectSinglePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  if (!project || !project.caseStudy || project.protected) {
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
      mdxContent={mdxContent}
      notionContent={notionContent}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  // Get all posts from the Notion database
  const projects = await getNotionProjects(isDevEnvironment);
  // Find the post with a matching slug property
  let project: NotionProject | undefined = projects.find(
    (proj) => proj.slug === slug
  );
  if (!project) {
    return {
      notFound: true,
    };
  }
  // Get the Notion page data and all child block data
  const notionContent = await getNotionProjectContent(project.id);
  // TBD: Encrypt the content if the post is protected
  // if (post.meta.protected) {
  //   const json = JSON.stringify(rawPostContent);
  //   const encrypted = CryptoJS.AES.encrypt(json, PASSWORD).toString();
  //   postContent = encrypted;
  // } else {
  //   postContent = rawPostContent;
  // }

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
