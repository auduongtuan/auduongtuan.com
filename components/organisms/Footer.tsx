import React from "react";
import useSWR from 'swr';
import { FiFacebook, FiGithub, FiInstagram, FiLinkedin } from "react-icons/fi";
import ExternalLink from "../atoms/ExternalLink";
import socialNetworks from "../../lib/socialNetworks";
import Link from "next/link";
export default function Footer() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR('/api/spotify', fetcher);

  return (
    <div id="contact" className="relative">
      <footer className="text-gray-900 sticky bottom-0 z-0">
        <div className="main-container pt-0 pb-12 md:pb-16 lg:pb-24 ">
          <section className="grid grid-cols-12 lg:grid-rows-2 gap-x-3 gap-y-8 border-t border-t-gray-200 pt-12">
            <div className="col-span-12 lg:col-span-4 lg:row-span-1 opacity-0 animate-slide-in-fast animation-delay-0">
              {data &&
              <div className="flex items-center flex-gap-4">
                <img className={`rounded-full ${data.isPlaying && 'animate-spin-slow'} flex-grow-0`} width="64" height="64" src={data.albumImageUrl} alt={data.title} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">{data.isPlaying ? 'Now playing 🎵' : 'Offline - Recently played'}</p>
                  <p className="font-medium">
                  {data.artist} <span className="text-gray-600">-</span> <a href={data.songUrl} target="_blank" rel="noreferrer">{data.title}</a>
                  </p>
                </div>
              </div>
              }
          
            </div>
       
             <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:justify-self-end lg:self-end">
             {/* tracking-tight */}
             <p className="text-xl md:text-2xl lg:text-3xl leading-normal md:leading-normal lg:leading-normal  font-medium opacity-0 animate-slide-in-fast animation-delay-200">
              I&apos;d love to hear from you. Email me any time at <a href="mailto:hi@auduongtuan.com" className="underline-link-light">hi@auduongtuan.com</a> or find me on 
              {socialNetworks.map((item, i) =>
                <React.Fragment key={i}> {i == socialNetworks.length - 1 && 'and '}<ExternalLink href={item.url} className="underline-link-light">{item.name}</ExternalLink>{i != socialNetworks.length-1 ? ',' : '.'}</React.Fragment>
              )}
              </p>
            </div>
              
            <div className="text-sm md:text-base col-span-12 lg:col-span-4 lg:row-start-2 lg:row-span-1 self-end leading-6 md:leading-8 opacity-0 animate-slide-in-fast animation-delay-100">
             Written, designed and built by Tuan<br />using <ExternalLink href="https://nextjs.org/">Next.js</ExternalLink>, <ExternalLink href="https://tailwindcss.com/">Tailwind</ExternalLink>, <Link className="hover:underline" href='/blog/enhance-skills-building-personal-websites'>...</Link><br />
             © {new Date().getFullYear()}.
            </div>
           
          </section>
        </div>
      </footer>
    </div>
  );
}
