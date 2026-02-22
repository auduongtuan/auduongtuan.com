import { axiosFetcher } from "@lib/utils";
import useSWR, { type SWRConfiguration } from "swr";

export function useAxiosSWR<T>(
  key: string | [string, Record<string, unknown>?] | null,
  options?: SWRConfiguration<T>,
) {
  return useSWR<T>(key, axiosFetcher, options);
}
