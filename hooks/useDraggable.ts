import { useEffect, useRef } from "react";

export function useDraggable() {
  const element = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!element.current) return;

    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    element.current.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(e: MouseEvent) {
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.addEventListener("mouseup", closeDragElement);
      document.addEventListener("mousemove", elementDrag);
    }

    function elementDrag(e: MouseEvent) {
      e.preventDefault();
      if (!element.current) return;
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // console.log(pos1, pos2, pos3, pos4);
      // set the element's new position:
      element.current.style.top = element.current.offsetTop - pos2 + "px";
      element.current.style.left = element.current.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
      // stop moving when mouse button is released:
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
    }
  }, [element.current]);
  return element;
}
