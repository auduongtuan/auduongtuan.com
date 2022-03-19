import Head from 'next/head'
import { useRouter } from 'next/router'
import { GetStaticProps, GetStaticPaths } from 'next'
import DefaultErrorPage from 'next/error'
import allPosts, {Post, postSlugs} from '../../lib/post'
import { serialize } from 'next-mdx-remote/serialize'
import PostSinglePage from '../../components/templates/PostSinglePage'

type BlogProps = {
  post: Post
}

export default function Blog({post}: BlogProps) {
  const router = useRouter()

  if(router.isFallback) {
     return <h1>Loading...</h1>
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

    <PostSinglePage post={post} />
 
  )
}


export const getStaticProps: GetStaticProps = async ({params}) => {
  const slug = params?.slug as string;

  const post = allPosts.find(post => post.slug == slug);
  if (post) post.parsedContent = await serialize(post.content);

  return {
    props: {
      post: post,
      posts: allPosts
    }
  }
  
}
export const getStaticPaths: GetStaticPaths = async () => {

  const paths = postSlugs.map(slug => ({
    params: { slug: slug },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: false }
}
