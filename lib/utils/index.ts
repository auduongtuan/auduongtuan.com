import axios from "axios";

export function parseInternalLink(url: string): string | null {
  const match = url.match(
    /^(?:(?:https?:\/\/)?(?:www\.)?auduongtuan\.com\/?(.*)$|\/?([\w\/-]+(?:[\w-]*\w)?(?:\/[\w-]+)*)$)/i,
  );

  if (match) {
    const domainPath = match[1];
    const directPath = match[2];

    if (domainPath !== undefined) {
      return domainPath ? `/${domainPath}` : "/";
    }
    if (directPath && !directPath.includes(".")) {
      return `/${directPath}`;
    }
  }

  return null;
}

export function trackEvent(obj: {
  event: string;
  content?: string;
  page?: string;
}) {
  if (!isDevEnvironment) axios.post("/api/curiosity", obj);
}

export const isDevEnvironment =
  process && process.env.NODE_ENV === "development";

export * from "./base64";
