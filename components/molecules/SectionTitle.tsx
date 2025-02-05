import Button from "@atoms/Button";
import { cn } from "@lib/utils/cn";

type SectionTitleProps = {
  action?: React.ReactNode;
  title: React.ReactNode;
} & React.ComponentPropsWithoutRef<"header">;

const SectionTitle = ({
  ref,
  action,
  title,
  className,
  ...rest
}: SectionTitleProps & {
  ref?: React.RefObject<HTMLElement>;
}) => {
  return (
    <header
      className={cn(
        "border-divider mb-8 flex flex-wrap gap-x-4 gap-y-2 border-b pb-3 md:items-center",
        className,
      )}
    >
      <div className="subheading flex shrink-0 grow items-center">{title}</div>
      <div className="flex shrink-0 grow-0 items-center justify-end gap-x-4 gap-y-2">
        {action && action}
      </div>
    </header>
  );
};

SectionTitle.displayName = "SectionTitle";

export default SectionTitle;
