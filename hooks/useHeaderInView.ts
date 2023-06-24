import { useInView } from "react-intersection-observer";
import { setHeaderInView } from "../store/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
const useHeaderInView = (disabled: boolean = false) => {
  const dispatch = useDispatch();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: "-10px",
  });
  useEffect(() => {
    if (!disabled) {
      dispatch(setHeaderInView(inView));
    } else {
      dispatch(setHeaderInView(false));
    }
  }, [inView, dispatch, disabled]);
  return { ref, inView, entry };
};
export default useHeaderInView;
