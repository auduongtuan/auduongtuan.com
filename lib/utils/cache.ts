import NodeCache from "node-cache";
export const cache = new NodeCache();

export const shouldRevalidateCache = () => {
  return process.env.CACHE_REVALIDATE === 'true' ||
         process.argv.includes('--revalidate-cache') || 
         process.argv.includes('--revalidate') || 
         process.argv.includes('-r');
};
