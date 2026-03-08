import { cn } from "@lib/utils/cn";
import React from "react";

interface MenuMorphIconProps extends React.ComponentPropsWithoutRef<"svg"> {
  open?: boolean;
}

const MenuMorphIcon = ({
  open = false,
  className,
  ...rest
}: MenuMorphIconProps) => {
  return (
    <svg
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(className)}
      aria-hidden="true"
      {...rest}
    >
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        className={cn(
          "origin-center transition-transform duration-200 ease-out",
          open && "translate-y-1.5 rotate-45",
        )}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <line
        x1="3"
        y1="12"
        x2="21"
        y2="12"
        className={cn(
          "origin-center transition-all duration-200 ease-out",
          open ? "scale-x-0 opacity-0" : "opacity-100",
        )}
      />
      <line
        x1="3"
        y1="18"
        x2="21"
        y2="18"
        className={cn(
          "origin-center transition-transform duration-200 ease-out",
          open && "-translate-y-1.5 -rotate-45",
        )}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
};

export default MenuMorphIcon;
