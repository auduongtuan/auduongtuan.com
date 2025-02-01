import {
  Disclosure as HeadlessDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const Disclosure = ({
  title,
  children,
  className = "",
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <HeadlessDisclosure>
      {({ open }) => (
        <div className={`${className}`}>
          <DisclosureButton
            className={`py-2 px-4 -my-2 -mx-4 w-full body-text flex rounded-md items-center hover:bg-gray-100 font-semibold text-left`}
          >
            <span className="mr-2">
              {open ? <FiChevronDown /> : <FiChevronRight />}
            </span>
            <div>{title}</div>
          </DisclosureButton>
          <DisclosurePanel className="pl-7">{children}</DisclosurePanel>
        </div>
      )}
    </HeadlessDisclosure>
  );
};

export default Disclosure;
