import Head from 'next/head'
import NotionBlogPage from '../components/templates/NotionBlogPage'
import { useAppContext } from '../lib/context/AppContext'
import { getPosts, Post } from '../lib/blog';

export default function Blog({posts}:{posts: Post[]}) {
  const appContext = useAppContext();
  return (
    <>
    <Head>
      <title>Blog {appContext.titleSeparator} {appContext.webName}</title>
      <meta name="description" content="This is a personal website of AU DUONG TUAN - a hybrid software designer/developer" />
    </Head>
    <NotionBlogPage posts={posts} />
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      posts: await getPosts(),
    },
    revalidate: 120,
  }
}