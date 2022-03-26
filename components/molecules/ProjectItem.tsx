import React, {useEffect, useState, useRef, useCallback, memo} from 'react'
import { Project } from '../../lib/project'
import Button from '../atoms/Button'
import { FiEye } from 'react-icons/fi'
import IconButton from '../atoms/IconButton'
import Image from 'next/image'
import Link from 'next/link'
import BrowserFrame from '../atoms/Frame'
import CustomImage from '../atoms/CustomImage'
import CustomVideo from '../atoms/CustomVideo'
export type ProjectItemProps = {
    project: Project,
    index: number
}

const ProjectItem = memo(({project, index, ...rest}:ProjectItemProps) => {

    const ref = useRef(null);
    // const [scrollPosition, setScrollPosition] = useState(0);
    // const [visibleRatio, setVisibleRatio] = useState(0);
    useEffect(() => {
        if (!ref.current) return;
        const el = ref.current as HTMLElement;
        if (index == 0) {
            el.querySelectorAll('.intro.opacity-0').forEach(node => node.classList.add("animation-delay-400", "animate-slide-in-fast"));
            el.querySelectorAll('.thumbnail.opacity-0').forEach(node => node.classList.add("animation-delay-500", "animate-slide-in-fast"));
        }
        const handleScroll = () => {
            // if(ref.current) setScrollPosition(getElementVisibility(ref.current).visibleRatio);
            if(index != 0) {
                const vh = document.documentElement.clientHeight;
                const rect = el.getBoundingClientRect();
                if (rect.top < vh) {
                    const visibleRatio = Math.min((vh - rect.top+200)/rect.height, 1);
                    // const ratio = visibleRatio.toPrecision(6);
                    // setVisibleRatio(visibleRatio);
                    el.style.opacity = visibleRatio.toString();
                    // el.style.transform = `translateX(${200-200*visibleRatio}px) scale(${Math.max(0.5, visibleRatio)})`;
                    // console.log(`show ${visibleRatio}`, project.meta.title);
                    if (visibleRatio == 1) {
                        el.querySelectorAll('.intro.opacity-0').forEach(node => node.classList.add("animate-slide-in-fast"));
                        el.querySelectorAll('.thumbnail.opacity-0').forEach(node => node.classList.add("animation-delay-100", "animate-slide-in-fast"));
                    }
                } else {
                    // console.log('now show', project.meta.title)
                }
            }
            // console.log(scrollPosition);
        };
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
  
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [index]);

    // style={index != 0 ? {transform: `translateY(${200-200*visibleRatio}px)`} : {}}

    return (
        <div ref={ref} className={`rounded-2xl p-6 md:p-10 lg:p-16 text-dark-blue-900 ${!project.meta.half ? 'col-span-12' : 'col-span-12 md:col-span-6' } transition-all ease duration-400`}
        style={{
            backgroundColor: project.meta.background,
            opacity: index == 0 ? 1 : 0
            // opacity: scrollPosition.toString()
        }} {...rest}>
            <div className="grid grid-cols-12 gap-4 gap-y-8 items-center justify-end">
                {/* <div className={`col-span-12 transition-all duration-200 ease-bounce ${!project.meta.half ? 'row-start-2 md:row-start-1 md:col-span-4' : 'row-start-2' }`} style={index != 0 ? {opacity: 100 * visibleRatio, transform: `translateY(${100-100*visibleRatio}px)`} : {}}> */}
                <div className={`col-span-12 transition-all duration-200 ease-bounce opacity-0 intro ${!project.meta.half ? 'row-start-2 md:row-start-1 md:col-span-4' : 'row-start-2' }`}>
                    <h2>{project.meta.type == "casestudy" ? <Link href={`/project/${project.slug}`}>{project.meta.title}</Link> : project.meta.title}</h2>
                    <p className='mt-2 text-base md:text-xl _tracking-tight _font-display'>{project.meta.tagline}</p>
                    <div className='mt-5 md:mt-9 flex gap-4'>
                    {project.meta.type == "casestudy" && <Button scroll={false} href={`/project/${project.slug}`} arrow>Case study</Button>}
                    {project.meta.type == "link" && <Button scroll={false} href={project.meta.link ? project.meta.link : '#'} external>View website</Button>}
                    {project.meta.type == "casestudy" && project.meta.link && <IconButton content="View website" href={project.meta.link ? project.meta.link : '#'} external><FiEye /></IconButton>}
                    </div>
                </div>
                <div className={`col-span-12 ${!project.meta.half ? 'md:col-start-6 md:col-span-7' : 'row-start-1' } flex justify-center gap-8 md:gap-4 lg:gap-8`}>
                    {project.meta.video && <BrowserFrame url={project.meta.link && project.meta.link} className='thumbnail opacity-0'>
                        <CustomVideo src={project.meta.video} slug={project.slug} width={project.meta.videoWidth} height={project.meta.videoHeight}></CustomVideo>
                    </BrowserFrame>}
                    {project.meta.cover && project.meta.browser &&
                    
                        <BrowserFrame url={project.meta.link && project.meta.link} className='thumbnail opacity-0'>
                            <div className='relative'>
                            <CustomImage slug={project.slug} src={project.meta.cover} alt={project.meta.title} width={project.meta.coverWidth} height={project.meta.coverHeight} /></div>
                        </BrowserFrame>
              
                    }
                    {project.meta.cover && !project.meta.browser &&
                    <div className={`relative ${project.meta.cover2 && 'md:mx-4'} transition-all ease-bounce thumbnail opacity-0`}>
                        <CustomImage slug={project.slug} src={project.meta.cover} alt={project.meta.title} width={project.meta.coverWidth} height={project.meta.coverHeight} />

                    </div>
                    }
                    {project.meta.cover2 && !project.meta.browser &&
                    <div className={`relative ${project.meta.cover2 && 'md:mx-4'} transition-all ease-bounce thumbnail opacity-0`}>
                        <CustomImage slug={project.slug} src={project.meta.cover2} alt={project.meta.title} width={project.meta.coverWidth} height={project.meta.coverHeight} />

                    </div>
                    }
                </div>
            </div>
        </div>
    )
});
ProjectItem.displayName = 'ProjectItem';
export default ProjectItem