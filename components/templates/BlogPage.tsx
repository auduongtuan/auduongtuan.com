import React, {useEffect, useState, useCallback} from "react";
import { useAppContext } from "../../lib/context/AppContext";
import { useInView } from 'react-intersection-observer';
import ExternalLink from "../atoms/ExternalLink";
export default function BlogPage() {
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
    <>
    <header ref={ref} className="bg-custom-neutral-900 text-white w-full z-10">
      <div className="main-container p-header">
        <div className="grid grid-cols-12 gap-8">
           <h1 className="col-span-12 md:col-span-8 opacity-0 animate-slide-in-fast">Blog</h1>
          <div className="col-span-12 md:col-span-8 self-end">
           
            <p className="font-display big-text opacity-0 animation-delay-200 animate-slide-in-fast">
             A collection of my unorganized musings
            </p>
          </div>
        
        </div>
      </div>
    </header>
    <div>
      <div className="main-container p-content">
      <p className="text-xl">Coming soon...</p>
      </div>
    </div>
    </>
  );
}
