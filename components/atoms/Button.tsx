import Link, {LinkProps} from "next/link"
import React from "react";
import { FiArrowRight, FiDownload, FiLink2 } from "react-icons/fi";
import {FaSpinner} from "react-icons/fa";
export interface ButtonProps  {
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
    type?: 'submit' | 'button' | 'reset';
    onClick?: () => void;
}
const Button = ({
    href,
    className = '',
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
}:ButtonProps) => {
    // if (colorful) className += ' bg-colorful text-dark-blue-900';
    if (colorful) className += ' bg-white/80 text-gray-900 hover:text-white hover:bg-blue-900 ';
    if (secondary) className += ' bg-slate-300 text-slate-800 hover:bg-slate-400 active:bg-slate-500';
    let defaultIcon;
    if (external) {
        defaultIcon = <FiLink2 />;
    }
    else if (arrow) {
        defaultIcon = <FiArrowRight />;
    }

    let renderIcon = icon ? icon : defaultIcon;
    if (loading) {
        renderIcon = <FaSpinner className="animate-spin" />;
    }
    if (href) {
        return external ? <a href={href} className={`btn ${disabled ? 'disabled' : ''} ${className}`} {...rest} target="_blank" rel="noreferrer">{children && children} {renderIcon}</a> : 
        <Link
            href={href}
            className={`btn ${disabled && 'disabled'} ${className}`}
            {...rest}>{children && children}{renderIcon}</Link>;
    } else {
        return (
            <button type={type} className={`btn ${disabled ? 'disabled' : ''} ${className}`} {...rest}>{children && children}{renderIcon}</button>
        )
    }
}
export default Button;