import Tippy from '@tippyjs/react';
interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  content?: string;
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
}
const IconButton = ({content, tooltip, href, external, children, className, ...rest}: IconButtonProps) => {
  const Tag = href ? "a" : "button";
  const attributes = external ? {target: '_blank', rel: 'noreferrer'} : {}
  return (
    <Tippy
      content={content}
      delay={0}
      interactiveBorder={0}
      className="bg-blue-800 text-white font-medium px-2 py-1 text-sm rounded-lg shadow-md transition-all ease duration-300"
      animation='fade'
      // className='bg-black'
      // render={attrs => (
      //   <div className="box" tabIndex={-1} {...attrs}>
      //   {console.log(attrs)}
      //     My tippy box
      //   </div>
      // )}
    >
      <Tag href={href} aria-label={content} {...attributes} className={`flex items-center transition-all ease justify-center w-10 h-10 text-xl rounded-full bg-black/10 hover:bg-blue-800 hover:text-white active:bg-blue-800 active:text-white cursor-pointer ${className}`} {...rest}>{children}</Tag>
    </Tippy>
  )
}
export default IconButton;