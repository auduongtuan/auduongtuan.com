import Fade from "@atoms/Fade";
import BackToPreviousPage from "./BackToPreviousPage";
import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@lib/utils/cn";
import { getElementContentWidth } from "@lib/utils/getElementContentWidth";

const HeaderWithBackButton = forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & {
    backLink: string;
    backLinkLabel: string;
    smallBottomPadding?: boolean;
  }
>(
  (
    {
      children,
      className,
      backLink,
      backLinkLabel,
      smallBottomPadding = false,
    },
    ref
  ) => {
    const [showBackButton, setShowBackButton] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
      function checkParentWidth() {
        if (buttonRef.current) {
          const parentEl = buttonRef.current.parentElement;
          if (!parentEl) return;
          const parentWidth = getElementContentWidth(parentEl);
          setShowBackButton(parentWidth > buttonRef.current.clientWidth + 16);
        }
      }
      checkParentWidth();
      window.addEventListener("resize", checkParentWidth);
      return () => window.removeEventListener("resize", checkParentWidth);
    }, []);
    return (
      <div
        ref={ref}
        className={cn(
          "flex justify-center main-container p-header",
          smallBottomPadding && "pb-subsection-vertical",
          className
        )}
      >
        <Fade
          duration={100}
          className={cn("min-w-0 grow basis-0", !showBackButton && "invisible")}
        >
          <BackToPreviousPage
            defaultLink={backLink}
            defaultLinkLabel={backLinkLabel}
            ref={buttonRef}
          />
        </Fade>
        <div className="pb-0 mx-0 w-content px-section-horizontal grow-0 shrink-0 basis-auto">
          {children}
        </div>
        <div
          className={cn(
            "min-w-0  grow basis-0",
            !showBackButton && "invisible"
          )}
        ></div>
      </div>
    );
  }
);

HeaderWithBackButton.displayName = "HeaderWithBackButton";
export default HeaderWithBackButton;
