import React from "react";
import Navigation from "@molecules/Navigation";
import AboutHeader from "./AboutHeader";
import AboutContent from "./AboutContent";
import Footer from "@molecules/Footer";
import Tooltip from "@atoms/Tooltip";
import Link from "next/link";
import IconButton from "@atoms/IconButton";
import { FiArrowLeft } from "react-icons/fi";
export default function AboutPage() {
  return (
    <div>
      <AboutHeader />
      <AboutContent />
      <Footer></Footer>
    </div>
  );
}
