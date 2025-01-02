import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import { getElementContentWidth } from "@lib/utils/getElementContentWidth";
import useAppStore from "@store/useAppStore";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useRef } from "react";
import { FiArrowLeft } from "react-icons/fi";

type BackToPreviousPageProps = React.ComponentPropsWithoutRef<"button"> & {
  defaultLink: string;
  defaultLinkLabel: string;
};

const BackToPreviousPage = forwardRef<
  HTMLButtonElement,
  BackToPreviousPageProps
>(({ defaultLink, defaultLinkLabel }, ref) => {
  const router = useRouter();

  const hasHistory = useAppStore((state) => state.hasHistory);

  return (
    <Tooltip
      content={hasHistory ? "Back to the previous page" : defaultLinkLabel}
    >
      <IconButton
        as="button"
        ref={ref}
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
});

BackToPreviousPage.displayName = "BackToPreviousPage";

export default BackToPreviousPage;
