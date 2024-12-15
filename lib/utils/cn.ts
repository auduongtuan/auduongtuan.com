import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  classGroups: {
    "font-family": ["sans", "mono"],
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
