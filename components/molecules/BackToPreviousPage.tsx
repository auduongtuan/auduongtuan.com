import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import { getElementContentWidth } from "@lib/utils/getElementContentWidth";
import useAppStore from "@store/useAppStore";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";

const BackToPreviousPage = ({
  defaultLink,
  defaultLinkLabel,
}: {
  defaultLink: string;
  defaultLinkLabel: string;
}) => {
  const router = useRouter();

  const hasHistory = useAppStore((state) => state.hasHistory);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function checkParentWidth() {
      if (buttonRef.current) {
        const parentEl = buttonRef.current.parentElement;
        if (!parentEl) return;
        const parentWidth = getElementContentWidth(parentEl);

        if (parentWidth < buttonRef.current.clientWidth) {
          document
            .querySelectorAll("*[data-back-to-previous-spacer]")
            .forEach((el) => {
              (el as HTMLElement).style.display = "none";
            });
        } else {
          document
            .querySelectorAll("*[data-back-to-previous-spacer]")
            .forEach((el) => {
              (el as HTMLElement).style.display = "";
            });
        }
      }
    }
    checkParentWidth();
    window.addEventListener("resize", checkParentWidth);
    return () => window.removeEventListener("resize", checkParentWidth);
  }, [buttonRef.current]);

  return (
    <Tooltip
      content={hasHistory ? "Back to the previous page" : defaultLinkLabel}
    >
      <IconButton
        as="button"
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          if (hasHistory) {
            router.back();
          } else {
            router.push(defaultLink, undefined, { scroll: false });
          }
        }}
      >
        <FiArrowLeft />
      </IconButton>
    </Tooltip>
  );
};

export default BackToPreviousPage;
