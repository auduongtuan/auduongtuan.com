import { ReactNode, useState } from "react";
import { Collapsible } from "@base-ui/react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { cn } from "@lib/utils/cn";

interface DisclosureProps {
  title: ReactNode;
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
}

const Disclosure = ({
  title,
  children,
  className = "",
  defaultOpen = false,
}: DisclosureProps) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      className={className}
      onOpenChange={setOpen}
    >
      <Collapsible.Trigger className="-mx-4 -my-2 flex w-full items-center rounded-md px-4 py-2 text-left font-semibold hover:bg-gray-100">
        <span className="mr-2">
          {open ? <FiChevronDown /> : <FiChevronRight />}
        </span>
        <div>{title}</div>
      </Collapsible.Trigger>
      <Collapsible.Panel className="overflow-hidden pl-7 transition-all duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
        {children}
      </Collapsible.Panel>
    </Collapsible.Root>
  );
};

export default Disclosure;
