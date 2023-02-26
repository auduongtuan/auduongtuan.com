import React from "react";
import useSWR from "swr";
import socialNetworks from "../../lib/socialNetworks";
import { useInView } from "react-intersection-observer";
import Fade from "../atoms/Fade";
import CustomImage from "../atoms/CustomImage";
import InlineLink from "../atoms/InlineLink";
import Skeleton from "../atoms/Skeleton";
export default function Footer() {
  const fetcher = (url: string) => fetch(url).then((r) => r.json());
  const { data } = useSWR("/api/spotify", fetcher);
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0.5,
    initialInView: false,
    triggerOnce: true,
    // rootMargin: '-10px'
  });
  return (
    <div id="contact" className="relative">
      <footer className="text-gray-900 sticky bottom-0 z-0">
        <div className="main-container pt-0 pb-12 md:pb-16 lg:pb-24" ref={ref}>
          <section className="grid grid-cols-12 lg:grid-rows-2 gap-x-3 gap-y-8 border-t border-t-gray-200 pt-12 md:min-h-[18rem]">
            <Fade slide
              show={inView}
              as={"div"}
              delay={0}
              className={`col-span-12 lg:col-span-4 lg:row-span-1`}
            >
              {data ? (
                <div className="flex items-center flex-gap-4">
                  <CustomImage
                    className={`rounded-full overflow-hidden ${
                      data.isPlaying && "animate-spin-slow"
                    } flex-grow-0`}
                    width="64"
                    height="64"
                    src={data.albumImageUrl}
                    alt={data.title}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {data.isPlaying
                        ? "Now playing 🎵"
                        : "Offline - Recently played"}
                    </p>
                    <p className="font-medium">
                      {data.artist} <span className="text-gray-600">-</span>{" "}
                      <a href={data.songUrl} target="_blank" rel="noreferrer">
                        {data.title}
                      </a>
                    </p>
                  </div>
                </div>
              ) : <Skeleton.Wrapper loaded={false} className="flex items-center flex-gap-4">
                <Skeleton className="w-16 h-16 rounded-full" type="inline"></Skeleton>
                <div className="flex-1">
                  <Skeleton className="w-[80%] h-4 rounded-full" type="inline"></Skeleton>
                  <Skeleton className="w-[50%] h-4 rounded-full mt-2" type="inline"></Skeleton>
                </div>
              </Skeleton.Wrapper>}
            </Fade>

            <div className="col-span-12 lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:justify-self-end lg:self-end">
              {/* tracking-tight */}
              <Fade slide
                show={inView}
                delay={100}
                as="p"
                className={`text-lg md:text-xl lg:text-2xl leading-relaxed md:leading-relaxed lg:leading-relaxed  font-medium`}
              >
                I&apos;d love to hear from you. Email me any time at{" "}
                <InlineLink
                  href="mailto:hi@auduongtuan.com"
                >
                  hi@auduongtuan.com
                </InlineLink>{" "}
                or find me on
                {socialNetworks.map((item, i) => (
                  <React.Fragment key={i}>
                    {" "}
                    {i == socialNetworks.length - 1 && "and "}
                    <InlineLink
                      href={item.url}
                    >
                      {item.name}
                    </InlineLink>
                    {i != socialNetworks.length - 1 ? "," : "."}
                  </React.Fragment>
                ))}
              </Fade>
            </div>

            <Fade slide
              as="div"
              delay={100}
              show={inView}
              className={`text-sm leading-loose col-span-12 lg:col-span-4 lg:row-start-2 lg:row-span-1 self-end`}
            >
              Written, designed and built by Tuan
              <br />
              using{" "}
              <InlineLink href="https://nextjs.org/" underline={false}>
                Next.js
              </InlineLink>,{" "}
              <InlineLink href="https://tailwindcss.com/" underline={false}>
                Tailwind
              </InlineLink>
              ,{" "}
              <InlineLink
                href="/blog/enhance-skills-building-personal-websites"
                underline={false}
              >
                ...
              </InlineLink>
              <br />© {new Date().getFullYear()}.
            </Fade>
          </section>
        </div>
      </footer>
    </div>
  );
}
