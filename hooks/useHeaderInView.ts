import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import useAppStore from "@store/useAppStore";

const useHeaderInView = (disabled: boolean = false) => {
  const { setHeaderInView } = useAppStore();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: "-10px",
  });
  useEffect(() => {
    if (!disabled) {
      setHeaderInView(inView);
    } else {
      setHeaderInView(false);
    }
  }, [inView, setHeaderInView, disabled]);
  return { ref, inView, entry };
};

export default useHeaderInView;
