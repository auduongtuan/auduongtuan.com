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
import { useViewportAndScrollbarWidths } from "@hooks/useViewportAndScrollbarWidths";
// import { IBM_Plex_Sans } from "@next/font/google";
// const ibm = IBM_Plex_Sans({
//   subsets: ["latin", "latin-ext", "vietnamese"],
//   weight: ["400", "500", "600", "700"],
// });
const isProduction = process.env.NODE_ENV === "production";
// import Head from "next/head";

TimeAgo.addLocale(en);
function MyApp({ Component, pageProps }: AppProps) {
  useViewportAndScrollbarWidths();
  const router = useRouter();
  useEffect(() => {
    smoothscroll.polyfill();
    if (isProduction) {
      const handleRouteChange = (url) => {
        gtag.pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router.events]);

  const { hasHistory, setHasHistory } = useAppStore();
  useEffect(() => {
    const historyCheck = () => {
      setHasHistory(true);
    };
    router.events.on("routeChangeComplete", historyCheck);
    return () => {
      router.events.off("routeChangeComplete", historyCheck);
    };
  }, [setHasHistory, router.events]);

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
        <Component {...pageProps} />
        {/* </div> */}
        {/* </div> */}
      </main>
    </BalancerProvider>
  );
}

export default MyApp;
