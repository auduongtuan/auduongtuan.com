import Link, {LinkProps} from "next/link"
import React from "react";
import { FiArrowRight, FiDownload, FiLink2 } from "react-icons/fi";
export interface ButtonProps extends LinkProps {
    href: string;
    className?: string;
    colorful?: boolean;
    children: React.ReactNode;
    arrow?: boolean;
    disabled?: boolean;
    external?: boolean;
    icon?: React.ReactNode;
}
const Button = ({
    href,
    className = '',
    children,
    colorful = false,
    arrow = false,
    scroll = false,
    disabled = false,
    external = false,
    icon,
    ...rest
}:ButtonProps) => {
    // if (colorful) className += ' bg-colorful text-dark-blue-900';
    if (colorful) className += ' bg-white/80 text-gray-900 hover:text-white hover:bg-blue-900 ';
    let defaultIcon;
    if (external) {
        defaultIcon = <FiLink2 />;
    }
    else if (arrow) {
        defaultIcon = <FiArrowRight />;
    }
    const renderIcon = icon ? icon : defaultIcon;
    return (
        external ? <a href={href} className={`btn ${disabled ? 'disabled' : ''} ${className}`} {...rest} target="_blank" rel="noreferrer">{children && children} {renderIcon}</a> : 
        <Link href={href}><a className={`btn ${disabled && 'disabled'} ${className}`} {...rest}>{children && children}{renderIcon}</a></Link>
    );
}
export default Button;