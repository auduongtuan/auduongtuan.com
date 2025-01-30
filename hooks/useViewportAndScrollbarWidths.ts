import { useEffect } from "react";

export const useViewportAndScrollbarWidths = () => {
  useEffect(() => {
    const updateCssVariables = () => {
      // Calculate Scrollbar Width
      const scrollDiv = document.createElement("div");
      scrollDiv.style.width = "100px";
      scrollDiv.style.height = "100px";
      scrollDiv.style.overflow = "scroll";
      scrollDiv.style.position = "absolute";
      scrollDiv.style.top = "-9999px";

      document.body.appendChild(scrollDiv);
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);

      // Get Viewport Width
      const viewportWidth = document.body.clientWidth;

      // Set CSS variables
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`
      );
      document.documentElement.style.setProperty(
        "--viewport-width",
        `${viewportWidth}px`
      );
    };

    updateCssVariables();
    window.addEventListener("resize", updateCssVariables);

    return () => window.removeEventListener("resize", updateCssVariables);
  }, []);
};
