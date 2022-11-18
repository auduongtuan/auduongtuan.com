import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import allProjects from '../lib/project'
import HomePage, {HomePageProps} from "../components/templates/HomePage";
import { useAppContext } from '../lib/context/AppContext';

export default function Index({posts, projects} : HomePageProps) {
  const appContext = useAppContext();
  return (
    <>
    <Head>
      <title>{appContext.webName}</title>
      <meta name="description" content="This is a personal website of AU DUONG TUAN - a hybrid software designer/developer" />
    </Head>
    <HomePage projects={projects} posts={posts} />
    </>
  )
}
export async function getStaticProps() {
  return {
    props: {
      projects: allProjects
    }
  }
}