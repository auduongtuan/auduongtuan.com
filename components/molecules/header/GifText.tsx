import ExternalLink from "@atoms/ExternalLink";
import Link from "next/link";

export interface GifTextProps extends React.ComponentPropsWithRef<"a"> {
  external?: boolean;
}

const GifText = ({
  ref,
  children,
  href,
  external = false,
  ...rest
}: GifTextProps) => {
  const className =
    "inline-block px-2 py-1 -mx-2 -my-1 underline transition-all duration-200 decoration-2 underline-offset-4 decoration-divider hover:decoration-transparent rounded-xl hover:bg-surface-raised";
  const Component = href ? ExternalLink : "span";
  if (external || !href) {
    return (
      <Component
        href={href}
        className={className}
        {...rest}
        ref={ref as NonNullable<React.RefObject<HTMLAnchorElement>>}
      >
        {children}
      </Component>
    );
  } else {
    return (
      <Link href={href} className={className} {...rest} ref={ref}>
        {children}
      </Link>
    );
  }
};

GifText.displayName = "GifText";
export default GifText;
