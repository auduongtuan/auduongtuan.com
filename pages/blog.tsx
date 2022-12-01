import Head from 'next/head'
import NotionBlogPage from '../components/templates/NotionBlogPage'
import { getPosts, Post } from '../lib/blog';
import HeadMeta from '../components/atoms/HeadMeta';

export default function Blog({posts}:{posts: Post[]}) {
  return (
    <>
    <HeadMeta title='Blog' description='This is a personal website of AU DUONG TUAN - a hybrid software designer/developer' />
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