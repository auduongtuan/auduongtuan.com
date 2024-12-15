import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import smoothscroll from "smoothscroll-polyfill";
import Navigation from "../components/molecules/Navigation";
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { Provider as BalancerProvider } from "react-wrap-balancer";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import useAppStore from "@store/useAppStore";
import Sidebar from "@molecules/Sidebar";
import { Metadata } from "next";
import LayoutProvider from "components/LayoutProvider";
const isProduction = process.env.NODE_ENV === "production";
TimeAgo.addLocale(en);

export const metadata: Metadata = {
  title: "My Page Title",
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LayoutProvider>{children}</LayoutProvider>
      </body>
    </html>
  );
}
