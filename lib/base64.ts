const ENC = {
  "+": "-",
  "/": "_",
};
const DEC = {
  "-": "+",
  _: "/",
  ".": "=",
};

/**
 * encode base64 string url safe
 */
export const urlEncode = (base64: string) => {
  return base64.replace(/[+/]/g, (m) => ENC[m]);
};

/**
 * decode url-safe-base64 string to base64
 */
export const urlDecode = (safe: string) => {
  return safe.replace(/[-_.]/g, (m) => DEC[m]);
};
export const decode = (base64: string) => {
  return Buffer.from(urlDecode(base64), "base64").toString();
};
export const encode = (str: string) => {
  return urlEncode(Buffer.from(str).toString("base64"));
};
