export function parseInternalLink(url: string): string | null {
  let check = url.match(
    /^(?!http|https)\/?([\/\w-]+)$|auduongtuan\.com\/?(.*)$/i
  );
  if (check) return check[1];
  return null;
}
