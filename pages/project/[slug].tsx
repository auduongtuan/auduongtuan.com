import { Project, getProjectContent, getProjectsWithCache } from "@lib/notion";
import { getPassword } from "@lib/notion/password";
import ProjectSinglePage, {
  ProjectSinglePageProps,
} from "@templates/project/ProjectSinglePage";
import CryptoJS from "crypto-js";
import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

export default function ProjectView({
  project,
  projects,
  notionContent,
  passwordInfo,
}: ProjectSinglePageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  // if (!project || !project.caseStudy) {
  //   console.log(project);
  //   return (
  //     <>
  //       <Head>
  //         <meta name="robots" content="noindex" />
  //       </Head>
  //       <DefaultErrorPage statusCode={404} />
  //     </>
  //   );
  // }
  return (
    <ProjectSinglePage
      project={project}
      projects={projects}
      notionContent={notionContent}
      passwordInfo={passwordInfo}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  // Get all posts from the Notion database
  const projects = await getProjectsWithCache();
  // Find the post with a matching slug property
  let project: Project | undefined = projects.find(
    (proj) => proj.slug === slug
  );
  if (!project) {
    return {
      notFound: true,
    };
  }
  let notionContent;
  let passwordInfo = {
    hint: "",
    length: 0,
  };
  // Get the Notion page data and all child block data
  const rawNotionContent = await getProjectContent(project.id);
  // TBD: Encrypt the content if the post is protected
  if (project.protected) {
    const json = JSON.stringify(rawNotionContent);
    const password = project.passwordId
      ? await getPassword(project.passwordId)
      : undefined;
    if (password) {
      const encrypted = CryptoJS.AES.encrypt(json, password.value).toString();
      notionContent = encrypted;
      passwordInfo.hint = password.hint;
      passwordInfo.length = password.value.length;
    }
  } else {
    notionContent = rawNotionContent;
  }

  return {
    props: {
      project: project,
      projects: projects,
      notionContent,
      passwordInfo,
    },
    revalidate: 120,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getProjectsWithCache();
  // old mdx paths
  // const paths = projectSlugs.map((slug) => ({
  //   params: { slug: slug },
  // }));
  const paths = projects
    .filter((project) => project.caseStudy)
    .map((project) => ({
      params: { slug: project.slug },
    }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false };
};
