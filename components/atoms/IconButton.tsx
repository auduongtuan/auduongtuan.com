import Tooltip from "./Tooltip";
interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  content?: string;
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  size?: 'small' | 'medium';
  inverted?: boolean;
}
const IconButton = ({content, tooltip, href, external, children, size = 'small', inverted = false, className, ...rest}: IconButtonProps) => {
 
  
  const Tag = href ? "a" : "button";
  const externalAttrs = external ? {target: '_blank', rel: 'noreferrer'} : {};
  return (
    <Tooltip content={content}>
     <Tag href={href} aria-label={content} {...externalAttrs} className={`
      flex items-center transition-all ease justify-center ${size == 'small' && 'w-10 h-10 text-xl'} ${size == 'medium' && 'w-16 h-16 text-2xl'} rounded-full
      ${inverted ? 'bg-white text-black' : 'bg-black/10'} hover:bg-blue-800 hover:text-white active:bg-blue-900 active:text-white cursor-pointer ${className}`} {...rest}
      >{children}</Tag>
    </Tooltip>
  );
}
export default IconButton;