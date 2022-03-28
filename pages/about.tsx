import Head from 'next/head'
import HeadMeta from '../components/atoms/HeadMeta';
import AboutPage from "../components/templates/AboutPage";

export default function About() {
  return (
    <>
    <HeadMeta title="About" />
    <AboutPage />
    </>
  )
}