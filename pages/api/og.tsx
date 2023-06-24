import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

const OGImage = function (request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Hello World";
  return new ImageResponse(
    (
      <div
        tw="text-6xl"
        style={{
          // fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          textAlign: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 600,
    }
  );
};
export default OGImage;
