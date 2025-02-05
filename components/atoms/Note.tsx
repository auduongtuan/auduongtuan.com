import { cn } from "@lib/utils/cn";

const Note = ({
  ref,
  children,
  className,
  ...rest
}: React.ComponentPropsWithoutRef<"aside"> & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <aside
      className={cn("drop-shadow-md filter", className)}
      {...rest}
      ref={ref}
    >
      <div className="relative overflow-hidden font-mono tracking-tight after:absolute after:-top-4 after:-right-4 after:block after:h-0 after:w-0 after:rotate-90 after:border-t-[2rem] after:border-b-[2rem] after:border-l-[2rem] after:border-x-transparent after:border-y-blue-400 after:content-['']">
        <div className="clip-path-paper-fold text-primary no-first-child-mt relative rounded-sm bg-[#aad0ff] p-4 text-sm lg:p-6">
          {children}
        </div>
      </div>
    </aside>
  );
};

Note.displayName = "Note";
export default Note;
