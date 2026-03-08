import { cn } from "@lib/utils/cn";

type PillButtonProps<T extends React.ElementType> = {
  tooltip?: string;
  children: React.ReactNode;
  href?: string;
  external?: boolean;
  active?: boolean;
  size?: "small" | "medium";
  className?: string;
  inverted?: boolean;
} & React.ComponentPropsWithRef<T>;

const PillButton = <T extends "a" | "button">({
  ref,
  tooltip,
  href,
  external,
  children,
  size = "small",
  active = false,
  inverted = false,
  className,
  ...rest
}: PillButtonProps<T> & {
  ref?: React.RefObject<HTMLElement>;
}) => {
  const buttonStyles = cn(
    "group inline-flex flex-shrink-1 justify-items-center items-center hover:bg-surface/40 px-3 py-1 border-2 border-control-outline hover:border-accent rounded-full text-secondary transition-all duration-100 ease-out shrink-0",
    active && "border-accent text-accent",
    size === "small" && "text-sm px-2.5 py-1",
    className,
  );
  return href ? (
    <a
      href={href}
      className={buttonStyles}
      {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      ref={ref as React.RefObject<HTMLElementTagNameMap["a"]>}
    >
      {children}
    </a>
  ) : (
    <button
      className={buttonStyles}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      ref={ref as React.RefObject<HTMLElementTagNameMap["button"]>}
    >
      {children}
    </button>
  );
};

PillButton.displayName = "PillButton";
export default PillButton;
