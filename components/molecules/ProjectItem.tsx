import React, {useEffect, useState, useRef, useCallback} from 'react'
import { Project } from '../../lib/project'
import Button from '../atoms/Button'
import Image from 'next/image'
import Link from 'next/link'
import BrowserFrame from '../atoms/Frame'
import CustomImage from '../atoms/CustomImage'
import CustomVideo from '../atoms/CustomVideo'
export type ProjectItemProps = {
    project: Project,
    index: number
}

export default function ProjectItem({project, index, ...rest}:ProjectItemProps) {

    const ref = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [visibleRatio, setVisibleRatio] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            // if(ref.current) setScrollPosition(getElementVisibility(ref.current).visibleRatio);
            if(ref.current && index != 0) {
                const el = ref.current as HTMLElement;
                const vh = document.documentElement.clientHeight;
                const rect = el.getBoundingClientRect();
                if (rect.top < vh) {
                    const visibleRatio = Math.min((vh - rect.top+200)/rect.height, 1);
                    // const ratio = visibleRatio.toPrecision(6);
                    setVisibleRatio(visibleRatio);
                    el.style.opacity = visibleRatio.toString();
                    // el.style.transform = `translateX(${200-200*visibleRatio}px) scale(${Math.max(0.5, visibleRatio)})`;
                    // console.log(`show ${visibleRatio}`, project.meta.title);
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
    }, [setScrollPosition]);
    return (
        <div ref={ref} className={`rounded-2xl p-6 md:p-10 lg:p-16 text-blue-900 ${!project.meta.half ? 'col-span-12' : 'col-span-12 md:col-span-6' } transition-all ease duration-400`}
        style={{
            backgroundColor: project.meta.background,
            opacity: index == 0 ? 1 : 0
            // opacity: scrollPosition.toString()
        }} {...rest}>
            <div className="grid grid-cols-12 gap-4 gap-y-8 items-center justify-end">
                <div className={`col-span-12 transition-all duration-200 ease-bounce ${!project.meta.half ? 'row-start-2 md:row-start-1 md:col-span-4' : 'row-start-2' }`} style={index != 0 ? {opacity: 100 * visibleRatio, transform: `translateY(${100-100*visibleRatio}px)`} : {}}>
                    <h2><Link href={`/project/${project.slug}`}>{project.meta.title}</Link></h2>
                    <p className='mt-2 description'>{project.meta.tagline}</p>
                    <Button scroll={false} href={`/project/${project.slug}`} className='mt-5 md:mt-9' arrow>{project.meta.type == "casestudy" ? "Case study" : "View website"}</Button>
                </div>
                <div className={`col-span-12 ${!project.meta.half ? 'md:col-start-6 md:col-span-7' : 'row-start-1' } flex justify-center gap-8 md:gap-4 lg:gap-8`}>
                    {project.meta.video && <BrowserFrame url={project.meta.link && project.meta.link} style={index != 0 ? {transform: `translateY(${200-200*visibleRatio}px)`} : {}}>
                        <CustomVideo src={project.meta.video} slug={project.slug} width={project.meta.videoWidth} height={project.meta.videoHeight}></CustomVideo>
                    </BrowserFrame>}
                    {project.meta.cover && project.meta.browser &&
                    
                        <BrowserFrame url={project.meta.link && project.meta.link} style={index != 0 ? {transform: `translateY(${200-200*visibleRatio}px)`} : {}}>
                            <div className='relative'>
                            <CustomImage slug={project.slug} src={project.meta.cover} alt={project.meta.title} width={project.meta.coverWidth} height={project.meta.coverHeight} /></div>
                        </BrowserFrame>
              
                    }
                    {project.meta.cover && !project.meta.browser &&
                    <div className='relative md:mx-4 transition-all ease-bounce' style={index != 0 ? {transform: `translateY(${200-200*visibleRatio}px)`} : {}}>
                        <CustomImage slug={project.slug} src={project.meta.cover} alt={project.meta.title} width={project.meta.coverWidth} height={project.meta.coverHeight} />

                    </div>
                    }
                    {project.meta.cover2 && !project.meta.browser &&
                    <div className='relative md:mx-4 transition-all ease-bounce' style={index != 0 ? {transform: `translateY(${200-200*visibleRatio}px)`} : {}}>
                        <CustomImage slug={project.slug} src={project.meta.cover2} alt={project.meta.title} width={project.meta.coverWidth} height={project.meta.coverHeight} />

                    </div>
                    }
                </div>
            </div>
        </div>
    )
}
