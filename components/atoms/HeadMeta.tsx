import { NextSeo } from "next-seo";
import Head from "next/head";
import { encode } from "../../lib/base64";
import { useRouter } from "next/router";

export const titles = {
  webName: `AU DUONG TUAN`,
  titleSeparator: ` | `,
};
const HeadMeta = ({
  title = "",
  tagline,
  description = "",
  background,
  logo,
  emoji,
}: {
  title?: string;
  tagline?: string;
  description?: string;
  background?: string;
  logo?: string;
  emoji?: string;
}) => {
  const router = useRouter();
  const finalTitle = title
    ? `${title}${titles.titleSeparator}${titles.webName}`
    : titles.webName;

  const imageData = encode(
    JSON.stringify({
      title: title || titles.webName,
      background,
      logo,
      tagline,
      emoji,
    })
  );
  const imageUrl =
    (process.env.NEXT_PUBLIC_WEB_URL || "") + `/api/og/${imageData}.png`;

  return (
    // <Head>
    //     <title>{finalTitle}</title>
    //     <meta name="description" content={description} />
    // </Head>
    <NextSeo
      title={finalTitle}
      description={description}
      // canonical="https://www.canonical.ie/"
      openGraph={{
        url:
          process.env.NEXT_PUBLIC_WEB_URL + router.asPath !== "/"
            ? router.asPath
            : "",
        title: finalTitle,
        description: description,
        type: "website",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: finalTitle,
            type: "image/png",
          },
        ],
        siteName: titles.webName,
      }}
      twitter={{
        handle: "@auduongtuan",
        site: "@auduongtuan",
        cardType: "summary_large_image",
      }}
    />
  );
};
export default HeadMeta;
