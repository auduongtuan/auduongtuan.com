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
      // Avoid doubling slashes if directPath already starts with /
      return directPath.startsWith("/") ? directPath : `/${directPath}`;
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

export const axiosFetcher = (
  key: string | [string, Record<string, unknown>?],
) => {
  const [url, params] = Array.isArray(key) ? key : [key];
  return axios.get(url, { params }).then((r) => r.data);
};

export * from "./base64";
