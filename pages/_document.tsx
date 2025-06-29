import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link
          rel="preload"
          href="/fonts/ABCOracle/ABCOracleVariable-Trial.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* https://www.smashingmagazine.com/2023/12/new-css-viewport-units-not-solve-classic-scrollbar-problem/ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              new ResizeObserver(() => {
                let vw = document.documentElement.clientWidth / 100;
                document.documentElement.style.setProperty('--vw', vw+'px');
              }).observe(document.documentElement);
            `,
          }}
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta name="theme-color" content="#FFFFFF" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="text-primary font-sans antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
