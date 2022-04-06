import React, {useEffect, useState, useRef, useCallback} from 'react'
import slugify from 'slugify';
import { useAppContext } from '../../lib/context/AppContext';
interface VisibleInfo {
  start: number;
  end: number;
  length: number;
}

const ProjectContentMenu = React.memo(() => {
  const appContext = useAppContext();
  const [headings, setHeadings] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState<number>(0);
  const [maxLength, setMaxLength] = useState<number>(0);
  const [visibleInfo, setVisibleInfo] = useState<VisibleInfo[]>([]);
  const trackers = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
      const headingsTemp = Array.from(document.querySelectorAll('#project h2')) as HTMLElement[];
      setHeadings(headingsTemp);
      const setupHeading = () => {
        let visibleInfoTemp: VisibleInfo[] = [];
        headingsTemp.forEach((heading, i) => {
          const start = heading.getBoundingClientRect().top + window.scrollY;
          const parentEl = heading.parentElement as HTMLElement;
          const end = i != headingsTemp.length - 1 ? headingsTemp[i+1].getBoundingClientRect().top + window.scrollY : parentEl.offsetTop + parentEl.clientHeight;
          let nextSibling = heading.nextElementSibling;
          let count = 0;
          while(nextSibling && (nextSibling.tagName != 'H2' && nextSibling.tagName != 'h2')) {
              count++;
              nextSibling = nextSibling.nextElementSibling;
          }
          heading.style.gridRow = `span ${count}`;
          visibleInfoTemp.push({start: start, end: end, length: end-start});
        });
        setVisibleInfo(visibleInfoTemp);
        console.log(visibleInfoTemp);
      }
      window.addEventListener('resize', setupHeading);
      // Delay to make sure it calculate correctly
      setTimeout(() => setupHeading(), 100);
      return () => {
        window.removeEventListener('resize', setupHeading);
      }
  }, []);

  useEffect(() => {
    headings.forEach((heading) => {
      if(heading.textContent) heading.id = slugify(heading.textContent, {lower: true, strict: true});
    });
    visibleInfo.length > 0 && setMaxLength(visibleInfo.reduce((a,b) => a.length > b.length ? a : b ).length);
    const calculateVisiblePercentage = (start, end) => {
      window.scrollY
    }
    const vh = document.documentElement.clientHeight;
    const threshold = 110;
    const handleOnScroll = () => {
      const currentActive = visibleInfo.reduce((prev, current, i) => {
        const secondCondtion = (i == 0) || (i > 0 && window.scrollY-threshold > visibleInfo[i-1].start);
        if (window.scrollY+vh-threshold >= visibleInfo[i].start && secondCondtion) {
          return i;
        } else {
          return prev;
        }
      }, 0);
      setActive(currentActive);
    };
    window.addEventListener('scroll', handleOnScroll);
    return () => {
      // trackerList.forEach((tracker) => observer.unobserve(tracker));
      window.addEventListener('scroll', handleOnScroll);
    }
}, [headings, visibleInfo]);

  return (
    <div className='absolute left-0 h-full py-28'>
      <aside className={`w-60 hidden 2xl:block sticky top-1/2`}>
          <ul className='flex flex-col gap-y-1  group'>
          {headings && headings.length > 2 && headings.map((heading, i) => 
          <li key={i} className='flex items-center'>
            <div className='w-8 ml-2 transition-all duration-350 ease-bounce group-hover:scale-x-[3] group-hover:opacity-0 origin-left'>
              <span className={`block h-[2px] rounded ${i == active ? 'bg-gray-900' : 'bg-gray-300'}`} style={visibleInfo[i] && maxLength ? {width: visibleInfo[i].length/maxLength*32+'px'} : {}}></span>
              </div>
            <a onClick={(e) => {
              e.preventDefault();
              if (i!= 0) {
                heading.scrollIntoView({behavior: 'smooth'});
              }
              else {
                window.scrollTo({top: 0, behavior: 'smooth'});
              }
            }} className={`pl-0 transition-all duration-400 ease-bounce opacity-0 group-hover:opacity-100 origin-left -translate-x-10 group-hover:-translate-x-4 text-sm font-semibold hover:text-gray-800 ${i == active ? 'text-gray-900' : 'text-gray-400'}`} href={`#${heading.id}`}>{heading.textContent}</a>
          </li>)}
          </ul>
      </aside>
    </div>
  );
});
ProjectContentMenu.displayName = 'ProjectContentMenu';
export default ProjectContentMenu;