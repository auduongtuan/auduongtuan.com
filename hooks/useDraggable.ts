import { useEffect, useRef } from "react";

export function useDraggable(enabled: boolean = true) {
  const element = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!element.current || !enabled) return;

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      if (!element.current) return;
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.current.style.top = element.current.offsetTop - pos2 + "px";
      element.current.style.left = element.current.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }

    const current = element.current;
    current.addEventListener("mousedown", dragMouseDown);

    return () => {
      current.removeEventListener("mousedown", dragMouseDown);
      closeDragElement();
    };
  }, [enabled]);

  return element;
}
