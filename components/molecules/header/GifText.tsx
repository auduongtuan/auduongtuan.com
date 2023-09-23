import ExternalLink from "@atoms/ExternalLink";
import Link from "next/link";
import { forwardRef } from "react";
export interface GifTextProps extends React.HTMLProps<HTMLAnchorElement> {
  external?: boolean;
}
const GifText = forwardRef<HTMLAnchorElement, GifTextProps>(
  ({ children, href, external = false, ...rest }, ref) => {
    const className =
      "underline decoration-2 underline-offset-4 transition-all duration-200 decoration-gray-600 hover:decoration-transparent inline-block -mx-2 -my-1 px-2 py-1 rounded-xl hover:bg-white/5";
    const Component = href ? ExternalLink : "span";
    if (external || !href) {
      return (
        <Component href={href} className={className} {...rest} ref={ref}>
          {children}
        </Component>
      );
    } else {
      return (
        <Link href={href} legacyBehavior>
          <a className={className} {...rest} ref={ref}>
            {children}
          </a>
        </Link>
      );
    }
  }
);
GifText.displayName = "GifText";
export default GifText;
