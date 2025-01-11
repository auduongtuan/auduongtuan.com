import axios from "axios";

export function checkInternal(href: string) {
  const check =
    href != "#" &&
    href.match(
      /^(?:https?:\/\/)?(?:www\.)?auduongtuan\.com(\/[^"\s]*)?$|(^\/[^"\s]*)$/i
    );
  return Boolean(check);
}

export function parseInternalLink(url: string): string | null {
  let check = url.match(
    /^(?!http|https)\/?([\/\w-]+)$|auduongtuan\.com\/?(.*)$/i
  );
  if (check) return check[1];
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
