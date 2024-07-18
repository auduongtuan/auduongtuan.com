import { FiArrowLeft } from "react-icons/fi";
import IconButton from "@atoms/IconButton";
import Tooltip from "@atoms/Tooltip";
import { useRouter } from "next/router";
import useAppStore from "@store/useAppStore";

const BackToPreviousPage = ({
  defaultLink,
  defaultLinkLabel,
}: {
  defaultLink: string;
  defaultLinkLabel: string;
}) => {
  const router = useRouter();

  const hasHistory = useAppStore((state) => state.hasHistory);

  return (
    <Tooltip
      content={hasHistory ? "Back to the previous page" : defaultLinkLabel}
    >
      <IconButton
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
