import "../styles/globals.css";
import "../styles/prism.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import smoothscroll from "smoothscroll-polyfill";
import Navigation from "../components/molecules/Navigation";
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { Provider } from "react-redux";
import store from "../store/store";
import { Provider as BalancerProvider } from 'react-wrap-balancer'

const isProduction = process.env.NODE_ENV === "production";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en);
function MyApp({ Component, pageProps }: AppProps) {
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

  return (
    <Provider store={store}>
      <BalancerProvider>
      <Navigation hideOnScroll={true} fixed={true} />
      {isProduction && <>
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
      }
      <div id="toast-root">
        
      </div>
      <Component {...pageProps} />
      </BalancerProvider>
    </Provider>
  );
}

export default MyApp;
