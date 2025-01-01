import Fade from "@atoms/Fade";
import BackToPreviousPage from "./BackToPreviousPage";
import { forwardRef } from "react";
import { cn } from "@lib/utils/cn";

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
          className="min-w-0 grow basis-0"
          data-back-to-previous-spacer
        >
          <BackToPreviousPage
            defaultLink={backLink}
            defaultLinkLabel={backLinkLabel}
          />
        </Fade>
        <div className="pb-0 mx-0 w-content px-section-horizontal grow-0 shrink-0 basis-auto">
          {children}
        </div>
        <div
          className="min-w-0 md:block grow basis-0"
          data-back-to-previous-spacer
        ></div>
      </div>
    );
  }
);

HeaderWithBackButton.displayName = "HeaderWithBackButton";
export default HeaderWithBackButton;
