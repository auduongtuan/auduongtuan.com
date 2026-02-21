import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import useAppStore from "@store/useAppStore";
import { useRouter } from "next/router";
import { FiArrowLeft } from "react-icons/fi";

type BackToPreviousPageProps = React.ComponentPropsWithoutRef<"button"> & {
  defaultLink: string;
  defaultLinkLabel: string;
};

const BackToPreviousPage = ({
  ref,
  defaultLink,
  defaultLinkLabel,
}: BackToPreviousPageProps & {
  ref?: React.RefObject<HTMLButtonElement>;
}) => {
  const router = useRouter();

  const hasHistory = useAppStore((state) => state.hasHistory);

  return (
    <Tooltip
      content={hasHistory ? "Back to the previous page" : defaultLinkLabel}
    >
      <IconButton
        as="button"
        ref={ref}
        size="large"
        className="mt-1.5"
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

BackToPreviousPage.displayName = "BackToPreviousPage";

export default BackToPreviousPage;
