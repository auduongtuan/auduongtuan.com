import React, {useEffect, useState, useCallback} from 'react'
import slugify from 'slugify';
import { useAppContext } from '../../lib/context/AppContext';
const ProjectContentMenu = () => {
  const appContext = useAppContext();
  const [headings, setHeadings] = useState<HTMLElement[]>([]);
  const [active, setActive] = useState<number>(0);
  const [maxLength, setMaxLength] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0)
  const getVisible = useCallback((el: HTMLElement): {start: number, end: number, length: number} => {
    if (el) {
      const start = el.getAttribute('startVisible');
      const end = el.getAttribute('endVisible');
      const length = el.getAttribute('lengthVisible');
      return {start: start ? parseInt(start):-1, end: end?parseInt(end): -1, length: length ? parseInt(length) : -1};
    } else {
      return {start: -1, end: -1, length: -1};
    }

  }, []);
  useEffect(() => {
      headings.forEach((heading) => {
        if(heading.textContent) heading.id = slugify(heading.textContent, {lower: true, strict: true});
      });
      const handleOnScroll = () => {
        const vh = document.documentElement.clientHeight;
        headings.some((heading, i) => {
          const visible = getVisible(heading);
          let threshold = 1;
          if (i == 1) {
            threshold = 100;
          } else if (i == headings.length - 1) {
            threshold = 100;
          }
          setScrollY(window.scrollY);
          if (window.scrollY+threshold >= visible.start && window.scrollY+threshold < visible.end) {
            console.log(heading.textContent + ' is visible');
            setActive(i);
            return true;
          }
        })
      };
      const setupHeadingVisible = () => {
        headings.forEach((heading, i) => {
          const start = heading.offsetTop;
          const parentEl = heading.parentElement as HTMLElement;
          const end = i != headings.length - 1 ? headings[i+1].offsetTop : parentEl.offsetTop + parentEl.clientHeight;
          heading.setAttribute('startVisible', start.toString());
          heading.setAttribute('endVisible', end.toString());
          heading.setAttribute('lengthVisible', (end-start).toString());
        });
        setMaxLength(getVisible(headings.reduce((a,b) =>
          (getVisible(a).length > getVisible(b).length) ? a : b
        , headings[0])).length);
      }
      setupHeadingVisible();
      window.addEventListener('resize', setupHeadingVisible);
      window.addEventListener('scroll', handleOnScroll);
      return () => {
        window.removeEventListener('resize', setupHeadingVisible);
        window.addEventListener('scroll', handleOnScroll);
      }
  }, [headings, getVisible])

  useEffect(() => {
      setHeadings(Array.from(document.querySelectorAll('#project h2')));
  }, []);

  return (
    <div className='absolute left-0 h-full py-28'>
      <aside className={`w-60 hidden 2xl:block sticky top-1/2`}>
          <ul className='flex flex-col gap-y-1  group'>
          {headings && headings.map((heading, i) => 
          <li key={i} className='flex items-center'>
            <div className='w-8 ml-2 transition-all duration-350 ease-bounce group-hover:scale-x-[3] group-hover:opacity-0 origin-left'>
              <span className={`block h-[2px] rounded ${i == active ? 'bg-gray-900' : 'bg-gray-300'}`} style={{width: getVisible(heading).length/maxLength*32+'px'}}></span>
              </div>
            <a onClick={(e) => {
              e.preventDefault();
              heading.scrollIntoView({behavior: 'smooth'})
            }} className={`pl-0 transition-all duration-400 ease-bounce opacity-0 group-hover:opacity-100 origin-left -translate-x-10 group-hover:-translate-x-4 text-sm font-semibold hover:text-gray-800 ${i == active ? 'text-gray-900' : 'text-gray-400'}`} href={`#${heading.id}`}>{heading.textContent}</a>
          </li>)}
          </ul>
      </aside>
    </div>
  );
};
export default ProjectContentMenu;