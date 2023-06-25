import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
export const config = {
  runtime: "edge",
};
const fontUrl = new URL(
  "../../assets/IBM_Plex_Sans/IBMPlexSans-Bold.ttf",
  import.meta.url
);
const font = fetch(fontUrl.toString()).then((res) => res.arrayBuffer());
const OGImage = async function (req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fontData = await font;
  const title = searchParams.get("title") || "Hello World";
  const backgroundColor = searchParams.get("background");
  const background =
    backgroundColor && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(backgroundColor)
      ? backgroundColor
      : "#FFFFFF";
  const logoUrl = searchParams.get("logo");
  const fullLogoUrl = req.nextUrl.origin + logoUrl;
  return new ImageResponse(
    (
      <div
        style={{
          background: background,
          width: "100%",
          height: "100%",
          padding: 48,
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
                paddingBottom: 32,
                display: "flex",
              }}
            >
              <img src={fullLogoUrl} style={{ width: 100, height: 100 }} />
            </div>
          )}
          <div
            style={{
              fontSize: 90,
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            fontSize: 32,
            textAlign: "left",
            color: "rgba(0,0,0,0.4)",
            display: "flex",
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
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
};
export default OGImage;
