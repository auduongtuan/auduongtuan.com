import { useInView } from 'react-intersection-observer';
import { setHeaderInView } from "../store/store";
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
const useHeaderInView = () => {
  const dispatch = useDispatch();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: '-10px'
  });
  useEffect(() => {
    dispatch(setHeaderInView(inView));
  }, [inView, dispatch]);
  return {ref, inView, entry};
}
export default useHeaderInView