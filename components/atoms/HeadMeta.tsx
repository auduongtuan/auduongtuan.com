import { NextSeo } from "next-seo";
import Head from "next/head";
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
  const finalTitle = title
    ? `${title}${titles.titleSeparator}${titles.webName}`
    : titles.webName;
  const imageUrl =
    `/api/og?title=${encodeURIComponent(title)}` +
    (background ? `&background=${encodeURIComponent(background)}` : "") +
    (logo ? `&logo=${encodeURIComponent(logo)}` : "") +
    (tagline ? `&tagline=${encodeURIComponent(tagline)}` : "") +
    (emoji ? `&emoji=${encodeURIComponent(emoji)}` : "");

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
        url: "https://auduongtuan.com",
        title: finalTitle,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: finalTitle,
            type: "image/png",
          },
        ],
        siteName: "SiteName",
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
