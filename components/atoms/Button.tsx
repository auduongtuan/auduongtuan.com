import Link, { LinkProps } from "next/link";
import React from "react";
import { FiArrowRight, FiDownload, FiArrowUpRight } from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { twMerge } from "tailwind-merge";
export interface ButtonProps {
  href?: string;
  className?: string;
  colorful?: boolean;
  children: React.ReactNode;
  arrow?: boolean;
  disabled?: boolean;
  external?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  secondary?: boolean;
  // scroll of Nextjs link
  scroll?: boolean;
  type?: "submit" | "button" | "reset";
  onClick?: () => void;
}
const Button = ({
  href,
  className = "",
  children,
  colorful = false,
  arrow = false,
  disabled = false,
  external = false,
  icon,
  loading = false,
  secondary = false,
  scroll,
  type,
  ...rest
}: ButtonProps) => {
  //   if (colorful) className += ;
  const buttonStyles = twMerge(
    "font-display py-2 px-4 rounded-lg font-semibold text-base tracking-wideinline-block transition-all",
    "focus:ring-2 ring-blue-600 outline-none",
    "inline-flex items-center",
    // "[&_svg]:ml-2 [&_svg]:translate-y-0 [&_svg]:translate-x-0 [&_svg]:duration-300 [&_svg]:transition-transform [&_svg]:block [&:hover_svg]:translate-y-0 [&:hover_svg]:translate-x-1",
    colorful
      ? "bg-surface/80 text-primary hover:text-white hover:bg-button-primary-hover active:bg-button-primary-pressed focus:shadow-blue-400"
      : "text-white bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-pressed",
    secondary &&
      "bg-slate-300 text-slate-800 hover:bg-slate-400 active:bg-slate-500",
    disabled && "disabled",
    className
  );
  let defaultIcon: React.ReactNode;
  if (external) {
    defaultIcon = <FiArrowUpRight />;
  } else if (arrow) {
    defaultIcon = <FiArrowRight />;
  }

  let renderIcon: React.ReactNode = icon ? icon : defaultIcon;
  if (loading) {
    renderIcon = <FaSpinner className="animate-spin" />;
  }
  if (href) {
    return external ? (
      <a
        href={href}
        className={buttonStyles}
        {...rest}
        target="_blank"
        rel="noreferrer"
      >
        {children && children}
        {renderIcon ? <span className="ml-2">{renderIcon}</span> : null}
      </a>
    ) : (
      <Link href={href} className={buttonStyles} {...rest}>
        {children && children}
        {renderIcon ? <span className="ml-2">{renderIcon}</span> : null}
      </Link>
    );
  } else {
    return (
      <button type={type} className={buttonStyles} {...rest}>
        {children && children}
        {renderIcon ? <span className="ml-2">{renderIcon}</span> : null}
      </button>
    );
  }
};
export default Button;
