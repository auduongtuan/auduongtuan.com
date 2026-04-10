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
import Footer from "../components/molecules/Footer";
import { ToastList } from "../components/atoms/Toast";
import * as gtag from "../lib/gtag";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

const isProduction = process.env.NODE_ENV === "production";

TimeAgo.addLocale(en);

type NavigatorWithUAData = Navigator & {
  userAgentData?: {
    brands?: Array<{
      brand: string;
    }>;
  };
};

function BrowserEngineFlag() {
  useEffect(() => {
    const html = document.documentElement;
    const uaData = (window.navigator as NavigatorWithUAData).userAgentData;
    const brands = uaData?.brands?.map((brand) => brand.brand) ?? [];
    const hasChromiumBrand = brands.some((brand) =>
      /Chromium|Google Chrome|Microsoft Edge|Opera/i.test(brand),
    );
    const hasNonChromiumBrand = brands.some((brand) =>
      /Firefox|Safari/i.test(brand),
    );

    if (hasChromiumBrand && !hasNonChromiumBrand) {
      html.dataset.browserEngine = "chromium";
      return;
    }

    const ua = window.navigator.userAgent;
    const fallbackChromium =
      (/Chrome\//.test(ua) ||
        /Chromium\//.test(ua) ||
        /Edg\//.test(ua) ||
        /OPR\//.test(ua) ||
        /CriOS\//.test(ua)) &&
      !/Firefox\//.test(ua) &&
      !/FxiOS\//.test(ua) &&
      !/Safari\//.test(ua);

    if (fallbackChromium) {
      html.dataset.browserEngine = "chromium";
      return;
    }

    delete html.dataset.browserEngine;
  }, []);

  return null;
}

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
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <BrowserEngineFlag />
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
        <main className="bg-surface relative">
          <Navigation />
          <ToastList />
          <Component {...pageProps} />
          <Footer />
        </main>
      </ThemeProvider>
    </BalancerProvider>
  );
}

export default MyApp;
