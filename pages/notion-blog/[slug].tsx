import Head from "next/head";
import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths, GetStaticPropsContext } from "next";
import DefaultErrorPage from "next/error";
// import allPosts, {Post, postSlugs} from '../../lib/post'
import { getPosts, getPostContent } from "../../lib/blog";
import { serialize } from "next-mdx-remote/serialize";
import NotionPostPage from '../../components/templates/NotionPostPage';
import { compact } from "lodash";

// type BlogProps = {
//   slug: Post
// }

export default function Blog({ post, postContent }) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }
  if(!post) {
    return <>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <DefaultErrorPage statusCode={404} />
    </>
  }
  return (
    <NotionPostPage post={post} postContent={postContent} />
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPosts();
  const postSlugs = posts.map((post) => {
    return {
      params: {
        slug: `/blog/${post.slug}`,
      },
    };
  });
  return {
    paths: postSlugs,
    fallback: "blocking",
  };
};

export async function getStaticProps(context: GetStaticPropsContext) {
  // Grab the slug from the post URL
  const slug = context.params && context.params.slug;
  // Get all posts from the Notion database
  const posts = await getPosts();
  // Find the post with a matching slug property
  const matchedPost = posts.filter((post) => post.slug === slug)[0];
  // Get the Notion page data and all child block data
  // const [postData, postContent] = await Promise.all([
  //   // getPost(matchedPost.id),
  //   getPostContent(matchedPost.id),
  // ]);
  const postContent = await getPostContent(matchedPost.id);
  // Next.js passes the data to my React template for rendering
  return {
    props: {
      post: matchedPost,
      postContent,
    },
    revalidate: 60,
  };
}
