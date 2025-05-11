import Fade from "@atoms/Fade";
import BackToPreviousPage from "./BackToPreviousPage";
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@lib/utils/cn";
import { getInnerDimensions } from "@lib/utils/getElementContentWidth";

const HeaderWithBackButton = ({
  ref,
  children,
  className,
  backLink,
  backLinkLabel,
  smallBottomPadding = false,
}: {
  ref?: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
  className?: string;
  backLink: string;
  backLinkLabel: string;
  smallBottomPadding?: boolean;
}) => {
  const [showBackButton, setShowBackButton] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function checkParentWidth() {
      if (buttonRef.current) {
        const parentEl = buttonRef.current.parentElement;
        if (!parentEl) return;
        const parentWidth = getInnerDimensions(parentEl).width;
        setShowBackButton(parentWidth > buttonRef.current.clientWidth + 16);
      }
    }
    checkParentWidth();
    window.addEventListener("resize", checkParentWidth);
    return () => window.removeEventListener("resize", checkParentWidth);
  }, [buttonRef]);
  return (
    <div
      ref={ref}
      className={cn(
        "main-container py-section-vertical flex justify-center",
        smallBottomPadding && "pb-subsection-vertical",
        className,
      )}
    >
      <Fade
        duration={100}
        className={cn("min-w-0 grow basis-0", !showBackButton && "invisible")}
      >
        <BackToPreviousPage
          defaultLink={backLink}
          defaultLinkLabel={backLinkLabel}
          ref={buttonRef as NonNullable<React.RefObject<HTMLButtonElement>>}
        />
      </Fade>
      <div className="w-content px-section-horizontal mx-0 shrink-0 grow-0 basis-auto pb-0">
        {children}
      </div>
      <div
        className={cn("min-w-0 grow basis-0", !showBackButton && "invisible")}
      ></div>
    </div>
  );
};

HeaderWithBackButton.displayName = "HeaderWithBackButton";
export default HeaderWithBackButton;
