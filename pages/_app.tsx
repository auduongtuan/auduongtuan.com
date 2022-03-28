import "../styles/globals.css";
import "../styles/prism.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { AppWrapper } from "../lib/context/AppContext";
import smoothscroll from "smoothscroll-polyfill";
import Navigation from "../components/organisms/Navigation";
import Script from "next/script";
import * as gtag from "../lib/gtag";

const isProduction = process.env.NODE_ENV === "production";
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

    //   const handleRouteChange = (url, { shallow }) => {
    //     console.log(
    //       `App is changing to ${url} ${
    //         shallow ? 'with' : 'without'
    //       } shallow routing`
    //     )
    //   }

    //   router.events.on('routeChangeStart', handleRouteChange)
    //   // const handleHashChangeStart
    //   const handleHashChangeStart = () => {
    //     window.scrollTo(0, 0);

    //   }
    //   const handleHashChangeComplete = (url) => {
    //     console.log('hash changed');
    //     const hash = url.split('#')[1];
    //     const el = document.getElementById(hash) as HTMLElement|null;
    //     if (el) {
    //       console.log(el);
    //       setTimeout(function() {

    //         window.scrollTo(0, 0);
    //       }, 1);
    //       // el.scrollIntoView({
    //       //   behavior: 'smooth'
    //       // });
    //       // window.scrollTo({ top: el.scrollTop, behavior: 'smooth' });
    //     }
    //   }
    //   router.events.on('hashChangeStart', handleHashChangeStart);
    //   router.events.on('hashChangeComplete', handleHashChangeComplete);
    //   // If the component is unmounted, unsubscribe
    //   // from the event with the `off` method:
    //   return () => {
    //     router.events.off('routeChangeStart', handleRouteChange);
    //     router.events.off('hashChangeStart', handleHashChangeStart);
    //     router.events.off('hashChangeComplete', handleHashChangeComplete);
    //   }
  }, [router.events]);

  return (
    <AppWrapper>
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
      <Component {...pageProps} />
    </AppWrapper>
  );
}

export default MyApp;
