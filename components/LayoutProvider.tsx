"use client";

import "../styles/globals.css";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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

const isProduction = process.env.NODE_ENV === "production";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  // useEffect(() => {
  //   smoothscroll.polyfill();
  //   if (isProduction) {
  //     const handleRouteChange = (url) => {
  //       gtag.pageview(url);
  //     };
  //     router.events.on("routeChangeComplete", handleRouteChange);
  //     return () => {
  //       router.events.off("routeChangeComplete", handleRouteChange);
  //     };
  //   }
  // }, [router.events]);

  // const { hasHistory, setHasHistory } = useAppStore();
  // useEffect(() => {
  //   const historyCheck = () => {
  //     setHasHistory(true);
  //   };
  //   router.events.on("routeChangeComplete", historyCheck);
  //   return () => {
  //     router.events.off("routeChangeComplete", historyCheck);
  //   };
  // }, [setHasHistory, router.events]);
  return (
    <BalancerProvider>
      {isProduction && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', '${gtag.GA_TRACKING_ID}', {
				page_path: window.location.pathname,
			});
		`,
            }}
          />
        </>
      )}
      {/* --main-font: ${ibm.style.fontFamily}; */}
      <style jsx global>{`
        :root {
          --main-font: "IBM Plex Sans", sans-serif;
        }
      `}</style>
      <main className="">
        <Navigation hideOnScroll={true} fixed={true} />
        <div id="toast-root"></div>
        {/* <div className="flex items-stretch justify-stretch content-stretch"> */}
        {/* <Sidebar /> */}
        {/* <div className="flex items-center justify-center grow"> */}
        {children}
        {/* </div> */}
        {/* </div> */}
      </main>
    </BalancerProvider>
  );
}
