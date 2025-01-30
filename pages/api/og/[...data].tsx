import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { decode } from "@lib/utils/base64";
export const config = {
  runtime: "edge",
};
const boldfontUrl = new URL(
  "../../../assets/IBM_Plex_Sans/IBMPlexSans-Bold.ttf",
  import.meta.url
);
const regularFontUrl = new URL(
  "../../../assets/IBM_Plex_Sans/IBMPlexSans-Regular.ttf",
  import.meta.url
);
const boldFont = fetch(boldfontUrl.toString()).then((res) => res.arrayBuffer());
const regularFont = fetch(regularFontUrl.toString()).then((res) =>
  res.arrayBuffer()
);

const OGImage = async function (req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const boldFontData = await boldFont;
  const regularFontData = await regularFont;
  const dataParams = searchParams.get("data");
  const decoded = decode(dataParams ? dataParams.slice(0, -4) : "");
  const data = JSON.parse(decoded) || {};
  const { title = "Hello World", tagline, background, logo, emoji } = data;
  // const {title, tagline, logo, emoji, background};
  // const backgroundColor = searchParams.get("background");
  const backgroundColor =
    background && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(background)
      ? background
      : "#ededed";
  const logoUrl = logo ? req.nextUrl.origin + logo : undefined;
  return new ImageResponse(
    (
      <div
        style={{
          background: backgroundColor,
          width: "100%",
          height: "100%",
          paddingTop: 48,
          paddingBottom: 48,
          paddingLeft: 64,
          paddingRight: 64,
          display: "flex",
          flexDirection: "column",
          gap: 32,
          textAlign: "left",
          alignItems: "flex-start",
          // justifyContent: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          {logoUrl && (
            <div
              style={{
                paddingTop: 24,
                paddingBottom: 28,
                display: "flex",
              }}
            >
              <img
                src={logoUrl}
                alt="Logo"
                style={{ width: 100, height: 100 }}
              />
            </div>
          )}
          {!logoUrl && emoji && (
            <div
              style={{
                paddingTop: 24,
                paddingBottom: 28,
                display: "flex",
                fontSize: 86,
                lineHeight: 1,
              }}
            >
              {emoji}
            </div>
          )}
          <div
            style={{
              fontSize: title.length > 24 ? 76 : 100,
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            {title}
          </div>
          {tagline && (
            <div
              style={{
                fontSize: 36,
                lineHeight: 1.1,
                fontWeight: 400,
                marginTop: 28,
                color: "rgba(0,0,0,0.5)",
              }}
            >
              {tagline}
            </div>
          )}
        </div>
        <div
          style={{
            fontSize: 24,
            textAlign: "left",
            color: "rgba(0,0,0,0.5)",
            display: "flex",
            letterSpacing: 0.2,
          }}
        >
          AUDUONGTUAN.COM
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "IBM Plex Sans",
          data: boldFontData,
          weight: 700,
          style: "normal",
        },
        {
          name: "IBM Plex Sans",
          data: regularFontData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
};

export default OGImage;
