import { trackEvent } from "@lib/utils";
import useAppStore from "@store/useAppStore";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";
import { Provider as BalancerProvider } from "react-wrap-balancer";
import Navigation from "../components/molecules/Navigation";
import * as gtag from "../lib/gtag";
import "../styles/globals.css";

const isProduction = process.env.NODE_ENV === "production";

TimeAgo.addLocale(en);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    trackEvent({
      event: "page_view",
      page: window.location.pathname,
    });
  }, []);
  useEffect(() => {
    if (isProduction) {
      const handleRouteChange = (url: string) => {
        gtag.pageview(url);
        trackEvent({
          event: "page_view",
          page: url,
        });
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
      <main className="relative">
        <Navigation />
        <div id="toast-root"></div>
        <Component {...pageProps} />
      </main>
    </BalancerProvider>
  );
}

export default MyApp;
