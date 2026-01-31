import React, { ReactElement } from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react";
import { cn } from "@lib/utils/cn";
export interface TooltipProps extends Omit<BaseTooltip.Popup.Props, "content"> {
  content?: React.ReactNode;
  children?: ReactElement<Record<string, unknown>>;
  open?: boolean;
  onOpenChange?: BaseTooltip.Root.Props["onOpenChange"];
}

const Tooltip = ({
  content,
  children,
  open,
  onOpenChange,
  className,
  ...props
}: TooltipProps) => {
  return (
    <BaseTooltip.Root open={open} onOpenChange={onOpenChange}>
      <BaseTooltip.Trigger render={children} delay={100}></BaseTooltip.Trigger>
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner sideOffset={10} className="z-2000">
          <BaseTooltip.Popup
            className={cn(
              "origin-[var(--transform-origin)]",
              "ease max-w-[48ch] rounded-lg bg-blue-800 px-2 py-1 font-mono text-sm font-medium text-white shadow-md duration-300",
              "transition-[transform,scale,opacity] data-ending-style:scale-90",
              "data-ending-style:opacity-0 data-instant:duration-0",
              "data-starting-style:scale-90 data-starting-style:opacity-0",
              className,
            )}
            {...props}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
