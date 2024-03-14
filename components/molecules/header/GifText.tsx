import ExternalLink from "@atoms/ExternalLink";
import Link from "next/link";
import { forwardRef } from "react";
export interface GifTextProps extends React.HTMLProps<HTMLAnchorElement> {
  external?: boolean;
}
const GifText = forwardRef<HTMLAnchorElement, GifTextProps>(
  ({ children, href, external = false, ...rest }, ref) => {
    const className =
      "inline-block px-2 py-1 -mx-2 -my-1 underline transition-all duration-200 decoration-2 underline-offset-4 decoration-divider hover:decoration-transparent rounded-xl hover:bg-surface-raised";
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
