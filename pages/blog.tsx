import Head from 'next/head'
import BlogPage from '../components/templates/BlogPage'
import { useAppContext } from '../lib/context/AppContext'
import allPosts, {Post} from '../lib/post'

export default function Blog({posts}:{posts: Post[]}) {
  const appContext = useAppContext();
  return (
    <>
    <Head>
      <title>Blog {appContext.titleSeparator} {appContext.webName}</title>
      <meta name="description" content="This is a personal website of AU DUONG TUAN - a hybrid software designer/developer" />
    </Head>
    <BlogPage posts={posts} />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      posts: allPosts
    }
  }
}