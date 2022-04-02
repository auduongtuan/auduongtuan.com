import { useState, useEffect } from 'react'

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
}
const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState<Breakpoint>();
    const resize = () => {
      let bp = 'lg';
      if (window.innerWidth <= 768) bp = 'md'
      if (window.innerWidth <= 640) bp = 'sm';
      setBreakpoint(bp as Breakpoint);
    }
    useEffect(() => {
        resize();
        window.addEventListener('resize', resize)

        return () => {
            window.removeEventListener('resize', resize)
        }
    }, [])

    return breakpoint
}

export default useBreakpoint;