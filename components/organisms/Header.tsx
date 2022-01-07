import React, {useEffect} from "react";
import Button from "../atoms/Button";
import { useInView } from 'react-intersection-observer';
import { useAppContext } from "../../lib/context/AppContext";
export default function Header() {
  const appContext = useAppContext();
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
    initialInView: true,
    rootMargin: '-10px'
  });
  useEffect(() => {
    appContext && appContext.setHeaderInView && appContext.setHeaderInView(inView)    
    // console.log(entry);
  }, [inView, appContext]);
  return (
    <header ref={ref} className="bg-neutral-900 text-white w-full z-10">
      <div className="main-container py-32 lg:pt-40 lg:pb-52">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 lg:col-span-8 lg:max-w-[50rem]">
            <p className="font-display text-4xl md:text-5xl lg:text-6xl leading-24 lg:leading-[4.5rem] font-bold">
              Hi! Tuan Au Duong is a{" "}
              <span className="underline decoration-[#9FC3FF] decoration-4 underline-offset-8">
                design technologist
              </span>{" "}
              based in Ho Chi Minh City
            </p>
            <Button href="/about" className="mt-7" colorful arrow>
              About me
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
