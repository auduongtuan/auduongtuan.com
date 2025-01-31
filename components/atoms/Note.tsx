import { cn } from "@lib/utils/cn";
import { forwardRef } from "react";

const Note = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"aside">
>(({ children, className, ...rest }, ref) => {
  return (
    <aside
      className={cn("filter drop-shadow-md", className)}
      {...rest}
      ref={ref}
    >
      <div
        className="overflow-hidden relative font-mono tracking-tight
    after:absolute after:content-['']
    after:border-t-[2rem] after:border-b-[2rem] after:border-y-blue-400 after:border-x-transparent after:border-l-[2rem] 
    after:rotate-90 after:block after:-top-4 after:-right-4 after:w-0 after:h-0"
      >
        <div
          className="clip-path-paper-fold bg-[#aad0ff] text-primary rounded-sm no-first-child-mt p-4 lg:p-6 text-sm relative
    "
        >
          {children}
        </div>
      </div>
    </aside>
  );
});

Note.displayName = "Note";
export default Note;
