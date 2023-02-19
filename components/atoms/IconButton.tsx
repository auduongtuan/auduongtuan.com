import classNames from "classnames";
import Tooltip from "./Tooltip";
interface IconButtonProps extends React.HTMLAttributes<HTMLElement> {
  content?: string;
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  size?: "small" | "medium";
  inverted?: boolean;
}
const IconButton = ({
  content,
  tooltip,
  href,
  external,
  children,
  size = "small",
  inverted = false,
  className,
  ...rest
}: IconButtonProps) => {
  const Tag = href ? "a" : "button";
  const externalAttrs = external ? { target: "_blank", rel: "noreferrer" } : {};
  const buttonStyles = classNames({
    "focus:ring-2 ring-blue-600 outline-none flex items-center transition-all ease justify-center rounded-full": true,
    "hover:bg-blue-800 hover:text-white active:bg-blue-900 active:text-white cursor-pointer": true,
    "w-10 h-10 text-xl": size == "small",
    "w-16 h-16 text-2xl": size == "medium",
    "bg-white text-black": inverted,
    "bg-black/10": !inverted,
    className

  })
  return (
    <Tooltip content={content}>
      <Tag
        href={href}
        aria-label={content}
        {...externalAttrs}
        className={buttonStyles}
        {...rest}
      >
        {children}
      </Tag>
    </Tooltip>
  );
};
export default IconButton;
