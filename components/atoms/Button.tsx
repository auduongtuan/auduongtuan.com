import { parseInternalLink } from "@lib/utils";
import { cn } from "@lib/utils/cn";
import Link from "next/link";
import React from "react";
import { FaSpinner } from "react-icons/fa";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";

export interface ButtonProps {
  href?: string;
  className?: string;
  colorful?: boolean;
  children: React.ReactNode;
  arrow?: boolean;
  disabled?: boolean;
  showPopoutIcon?: boolean;
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
  showPopoutIcon = false,
  icon,
  loading = false,
  secondary = false,
  scroll,
  type,
  ...rest
}: ButtonProps) => {
  //   if (colorful) className += ;
  const buttonStyles = cn(
    "font-mono py-2 px-4 rounded-lg font-semibold text-sm uppercase inline-block transition-all duration-200 ease-out",
    "focus-visible:ring-2 ring-accent outline-hidden ",
    "inline-flex items-center",
    // "[&_svg]:ml-2 [&_svg]:translate-y-0 [&_svg]:translate-x-0 [&_svg]:duration-300 [&_svg]:transition-transform [&_svg]:block [&:hover_svg]:translate-y-0 [&:hover_svg]:translate-x-1",
    colorful
      ? "bg-surface/80 text-primary hover:text-white hover:bg-button-primary-hover active:bg-button-primary-pressed active:outline-hidden focus:shadow-blue-400"
      : "text-white bg-button-primary hover:bg-button-primary-hover active:bg-button-primary-pressed",
    secondary &&
      "bg-surface py-[0.4375rem] border border-control text-secondary hover:bg-button-secondary-hover active:bg-button-secondary-pressed",
    disabled && "disabled",
    className,
  );
  let defaultIcon: React.ReactNode;
  if (showPopoutIcon) {
    defaultIcon = <FiArrowUpRight />;
  } else if (arrow) {
    defaultIcon = <FiArrowRight />;
  }
  const checkInternalLink = href && parseInternalLink(href);

  let renderIcon: React.ReactNode = icon ? icon : defaultIcon;
  if (loading) {
    renderIcon = <FaSpinner className="animate-spin" />;
  }
  if (href) {
    return !checkInternalLink ? (
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
      <Link href={checkInternalLink} className={buttonStyles} {...rest}>
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
