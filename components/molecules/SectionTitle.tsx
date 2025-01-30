import Button from "@atoms/Button";
import { cn } from "@lib/utils/cn";
import { forwardRef } from "react";

type SectionTitleProps = {
  action?: React.ReactNode;
  title: React.ReactNode;
} & React.ComponentPropsWithoutRef<"header">;

const SectionTitle = forwardRef<HTMLElement, SectionTitleProps>(
  ({ action, title, className, ...rest }, ref) => {
    return (
      <header
        className={cn(
          "flex pb-3 mb-8 border-b  gap-x-4 gap-y-2 flex-wrap  md:items-center border-divider",
          className
        )}
      >
        <div className="flex items-center subheading grow shrink-0">
          {title}
        </div>
        <div className="flex items-center justify-end gap-x-4 gap-y-2 grow-0 shrink-0 ">
          {action && action}
        </div>
      </header>
    );
  }
);

SectionTitle.displayName = "SectionTitle";

export default SectionTitle;
