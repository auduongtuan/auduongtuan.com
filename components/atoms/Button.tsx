import Link, {LinkProps} from "next/link"
import React from "react";
import { FiArrowRight, FiLink2 } from "react-icons/fi";
export interface ButtonProps extends LinkProps {
    href: string;
    className?: string;
    colorful?: boolean;
    children: React.ReactNode;
    arrow?: boolean;
    disabled?: boolean;
    external?: boolean;
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
    ...rest
}:ButtonProps) => {
    if (colorful) className += ' bg-colorful text-blue-900';
    return (
        external ? <a className={`btn ${disabled && 'disabled'} ${className}`} {...rest} target="_blank" rel="noreferrer">{children && children} <FiLink2 /></a> : 
        <Link href={href}><a className={`btn ${disabled && 'disabled'} ${className}`} {...rest}>{children && children}{arrow && <FiArrowRight />}</a></Link>
    );
}
export default Button;