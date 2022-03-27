import Tooltip from "./Tooltip";
interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  content?: string;
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}
const IconButton = ({content, tooltip, href, external, children, className, ...rest}: IconButtonProps) => {
 
  
  const Tag = href ? "a" : "button";
  const externalAttrs = external ? {target: '_blank', rel: 'noreferrer'} : {};
  return (
    <Tooltip content={content}>
     <Tag href={href} aria-label={content} {...externalAttrs} className={`flex items-center transition-all ease justify-center w-10 h-10 text-xl rounded-full bg-black/10 hover:bg-blue-800 hover:text-white active:bg-blue-900 active:text-white cursor-pointer ${className}`} {...rest}>{children}</Tag>
    </Tooltip>
  );
}
export default IconButton;