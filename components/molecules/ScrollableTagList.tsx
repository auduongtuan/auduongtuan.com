import Tag from "@atoms/Tag";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ScrollableTagListProps extends React.ComponentPropsWithoutRef<"div"> {
  tags: string[];
  background: string;
}

const ScrollableTagList = ({
  tags,
  background,
  className,
}: ScrollableTagListProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(true);
  const onScroll = () => {
    if (!ref.current) return;
    const container = ref.current;
    const scrollable = container.scrollWidth - container.offsetWidth;
    if (container.scrollLeft == 0) {
      setShowStart(false);
      setShowEnd(true);
    } else if (container.scrollLeft >= scrollable - 1) {
      setShowStart(true);
      setShowEnd(false);
    } else {
      setShowStart(true);
      setShowEnd(true);
    }
  };

  return (
    <div className={twMerge("relative w-full", className)}>
      {showStart && (
        <span
          className="absolute top-0 left-0 block w-4 h-full bg-gradient-to-r from-inherit to-transparent"
          style={
            {
              "--tw-gradient-from": background,
            } as React.CSSProperties
          }
        ></span>
      )}
      {showEnd && (
        <span
          className="absolute top-0 right-0 block w-4 h-full bg-gradient-to-r from-transparent to-inherit"
          style={
            {
              "--tw-gradient-to": background,
            } as React.CSSProperties
          }
        ></span>
      )}
      <div
        className="overflow-y-scroll scrollbar-hidden"
        ref={ref}
        onScroll={onScroll}
      >
        <div className="flex items-start flex-gap-2">
          {tags.map((tag, i) => (
            <Tag key={`tag-${i}`} className="shrink-0">
              {tag}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrollableTagList;
