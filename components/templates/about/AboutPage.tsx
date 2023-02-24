import React from 'react'
import Navigation from '../../molecules/Navigation'
import AboutHeader from './AboutHeader'
import AboutContent from "./AboutContent"
import Footer from './../../molecules/Footer'
export default function AboutPage() {
  return (
    <div>
      <AboutHeader />
      <AboutContent />
      <Footer></Footer>
    </div>
  )
}
