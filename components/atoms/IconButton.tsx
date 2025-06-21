import { cn } from "@lib/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const iconButtonVariants = cva(
  "focus-visible:ring-2 ring-accent outline-hidden flex items-center transition-all ease justify-center rounded-full text-secondary cursor-pointer",
  {
    variants: {
      size: {
        small: "",
        medium: "",
        large: "",
      },

      variant: {
        default:
          "bg-button-secondary hover:bg-button-primary-hover hover:text-oncolor active:bg-button-primary-pressed active:text-oncolor",
        overlay:
          "bg-surface/65 hover:bg-button-primary-hover hover:text-oncolor active:bg-button-primary-pressed active:text-oncolor backdrop-blur-xs shadow-xl ring-1 ring-primary/10",
        ghost: "text-tertiary hover:text-accent active:bg-transparent p-0",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        size: "small",
        class: "w-6 h-6 text-sm",
      },
      {
        variant: "default",
        size: "medium",
        class: "w-10 h-10 text-xl",
      },
      {
        variant: "default",
        size: "large",
        class: "w-14 h-14 text-2xl",
      },
      {
        variant: "ghost",
        size: "small",
        class: "text-base",
      },
      {
        variant: "ghost",
        size: "medium",
        class: "text-xl",
      },
      {
        variant: "ghost",
        size: "large",
        class: "text-2xl",
      },
      {
        variant: "overlay",
        size: "small",
        class: "w-6 h-6 text-sm",
      },
      {
        variant: "overlay",
        size: "medium",
        class: "w-10 h-10 text-xl",
      },
      {
        variant: "overlay",
        size: "large",
        class: "w-14 h-14 text-2xl",
      },
    ],
    defaultVariants: {
      size: "medium",
      variant: "default",
    },
  },
);

type IconButtonProps<T extends React.ElementType> = {
  tooltip?: string;
  children?: React.ReactNode;
  href?: string;
  external?: boolean;
  as?: T;
} & VariantProps<typeof iconButtonVariants> &
  React.ComponentPropsWithoutRef<T>;

const IconButton = <T extends React.ElementType = "button">({
  ref,
  tooltip,
  href,
  external,
  children,
  size,
  inverted,
  className,
  as,
  variant,
  ...rest
}: IconButtonProps<T> & {
  ref?: React.RefObject<unknown>;
}) => {
  const externalAttrs = external ? { target: "_blank", rel: "noreferrer" } : {};
  const buttonStyles = cn(iconButtonVariants({ size, className, variant }));

  return href ? (
    <a
      href={href}
      {...externalAttrs}
      className={buttonStyles}
      {...rest}
      ref={ref as React.Ref<HTMLAnchorElement>}
    >
      {children}
    </a>
  ) : (
    <button
      {...externalAttrs}
      className={buttonStyles}
      {...rest}
      ref={ref as React.Ref<HTMLButtonElement>}
    >
      {children}
    </button>
  );
};

IconButton.displayName = "IconButton";
export default IconButton;
