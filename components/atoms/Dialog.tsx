import { useEffect, type ReactNode } from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import useAppStore from "@store/useAppStore";
import { cn } from "@lib/utils/cn";

interface DialogProps {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  className?: string;
}

function Dialog({ children, open, onClose, title, className }: DialogProps) {
  const { setPauseScrollEvent } = useAppStore();

  useEffect(() => {
    if (open) setPauseScrollEvent(true);
    return () => {
      setPauseScrollEvent(false);
    };
  }, [open, setPauseScrollEvent]);

  return (
    <BaseDialog.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className="fixed inset-0 z-(--stack-modal) bg-black/60 opacity-100 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <BaseDialog.Popup
          className={cn(
            "fixed inset-0 z-(--stack-modal) flex scale-100 items-center justify-center p-4 opacity-100 transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
            className,
          )}
        >
          <div className="flex w-full max-w-md translate-z-0 flex-col overflow-hidden rounded-xl border border-solid border-black/20 shadow-lg">
            <header className="bg-card relative z-1 flex items-center justify-between rounded-t-[11px] px-3 py-1.5 shadow-[0_0_0_1px_rgba(0,0,0,0.06)]">
              <div className="absolute flex grow basis-0 items-center gap-2">
                <BaseDialog.Close
                  aria-label="Close dialog"
                  className="bg-primary/40 block h-2 w-2 cursor-pointer rounded-sm hover:bg-red-500 active:bg-red-700"
                />
              </div>
              <BaseDialog.Title className="w-full px-8 py-0.5 text-center text-sm font-semibold text-slate-700">
                {title}
              </BaseDialog.Title>
            </header>
            <main className="bg-surface grow-0">{children}</main>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

export default Dialog;
