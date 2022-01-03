import Link, {LinkProps} from "next/link"
import React from "react";
import { FiArrowRight } from "react-icons/fi";
export interface ButtonProps extends LinkProps {
    href: string;
    className?: string;
    colorful?: boolean;
    children: React.ReactNode;
    arrow?: boolean;
    disabled?: boolean;
}
const Button = ({
    href,
    className = '',
    children,
    colorful = false,
    arrow = false,
    scroll = false,
    disabled = false,
    ...rest
}:ButtonProps) => {
    if (colorful) className += ' bg-colorful text-blue-900';
    return <Link href={href}><a className={`btn ${disabled && 'disabled'} ${className}`} {...rest}>{children && children}{arrow && <FiArrowRight />}</a></Link>;
}
export default Button;