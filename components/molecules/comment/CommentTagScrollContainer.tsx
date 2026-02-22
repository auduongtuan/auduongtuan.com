import FadeScrollableContainer from "@atoms/FadeScrollableContainer";
import { useResizeObserver } from "@hooks/useResizeObserver";
import { useEffect, useRef } from "react";

const CommentTagScrollContainer = ({
  children,
  ...rest
}: React.ComponentPropsWithoutRef<"div">) => {
  const { width, ref } = useResizeObserver<HTMLDivElement>();
  const tagContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    if (!tagContainerRef.current) return;
    const tagContainer = tagContainerRef.current as HTMLDivElement;
    tagContainer.style.maxWidth = "200%";
    let largestRowWidth = 0;
    let currentRowWidth = 0;
    let currentRowTop = 0;
    let isFirstChild = true;
    const tagContainerStyles = window.getComputedStyle(tagContainer);
    const gap = parseFloat(tagContainerStyles.gap) || 0;
    Array.from(tagContainer.childNodes).forEach((child, index) => {
      const element = child as HTMLElement;
      const rect = element.getBoundingClientRect();
      if (isFirstChild) {
        currentRowTop = rect.top;
        currentRowWidth = rect.width;
        isFirstChild = false;
      } else {
        // If element is on a new row (different top position)
        if (Math.abs(rect.top - currentRowTop) > 1) {
          largestRowWidth = Math.max(largestRowWidth, currentRowWidth);
          currentRowWidth = rect.width;
          currentRowTop = rect.top;
        } else {
          // Same row, add to current row width including gap
          currentRowWidth += rect.width + gap;
        }
      }
    });

    // Don't forget the last row
    largestRowWidth = Math.max(largestRowWidth, currentRowWidth);
    if (largestRowWidth) tagContainer.style.maxWidth = `${largestRowWidth}px`;
  }, [width, tagContainerRef, children]);
  return (
    <FadeScrollableContainer ref={ref} {...rest}>
      <div
        ref={tagContainerRef}
        className="inline-flex w-max max-w-[200%] shrink-0 grow flex-wrap gap-1"
      >
        {children}
      </div>
    </FadeScrollableContainer>
  );
};

export default CommentTagScrollContainer;
