import Link from "next/link";
import ExternalLink from "./ExternalLink";
interface InlineLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}
const InlineLink = ({
  href,
  className = "",
  children,
  ...rest
}: InlineLinkProps) => {
  let checkInternal = href.match(/auduongtuan\.com\/(.*?)$/i);
  const Component = checkInternal ? Link : ExternalLink;
  return (
    <Component
      href={(checkInternal ? `/${checkInternal[1]}/` : href) as string}
      className={`text-slate-600 underline underline-offset-4 decoration-gray-400 decoration-1 hover:text-blue-800 hover:decoration-blue-800 ${className}
        }`}
      {...rest}
    >
      {children}
    </Component>
  );
};
export default InlineLink;
