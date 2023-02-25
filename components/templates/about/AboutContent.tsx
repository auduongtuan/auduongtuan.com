import React from "react";
import { FiDownload } from "react-icons/fi";
import Button from "../../atoms/Button";
import Fade from "../../atoms/Fade";
import { experience, education, skills, now } from "./content";
import InlineLink from "../../atoms/InlineLink";
const Heading = ({ children }: { children?: React.ReactNode }) => (
  <h2 className="sub-heading border-b border-gray-200 pb-2 -mb-1">
    {children}
  </h2>
);
const Item = ({
  title,
  subtitle,
  time,
}: {
  title: string;
  subtitle?: string;
  time?: string;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="grid grid-cols-5 items-center gap-x-4 gap-y-0 group">
      <div className="col-span-5 lg:col-span-5 md:flex items-baseline md:flex-gap-2">
        <div className="text-md font-medium body-text ">{title}</div>
        <div className="hidden md:block flex-1 border-gray-300 border-t border-dashed mt-3 md:mt-0"></div>
        {time && (
          <p className="text-sm  m-0 md:mt-0.5 text-gray-500 justify-self-end fonts-mono tabular-nums">
            {time}
          </p>
        )}
      </div>
      <div className="col-span-5 lg:col-span-5">
        {subtitle && <p className="text-sm mt-0.5 text-gray-500">{subtitle}</p>}
        <div className="md:hidden flex-1 border-gray-300 border-t border-dashed mt-3 md:mt-0 md:order-2 group-last:hidden"></div>
      </div>
    </div>
  );
};
export default function AboutContent() {
  return (
    <div className="p-content relative h-full">
      <Fade delay={300} className="content-container text-gray-800">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-x-8 gap-y-8 md:gap-y-12 lg:gap-y-24">
          <section className="col-span-2 md:col-span-6 lg:col-span-8 lg:mr-8">
            <div className="grid grid-cols-1 gap-y-8 md:gap-y-12 gap-x-16">
              <div className="col-span-6 md:col-span-6">
                <Heading>Now</Heading>
                <div className="grid grid-cols-1 gap-6 mt-4 md:mt-8">
                  <p className="col-span-1">
                    {`This section updates what I'm doing, as inspired by `}
                    <InlineLink href="https://sive.rs/nowff">
                      Now page momment ↗
                    </InlineLink>.
                  </p>
                  <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
                    {now.map((item, i) => (
                      <div
                        className="px-3 md:px-4 py-2 bg-slate-100 rounded-md"
                        key={`now-${i}`}
                      >
                        <p className="text-sm mt-0.5 text-gray-500">
                          {item.title}
                        </p>
                        <div className="text-md font-medium body-text mt-1">
                          {item.link ? (
                            <InlineLink href={item.link}>
                              {item.content}
                            </InlineLink>
                          ) : (
                            item.content
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-span-6 md:col-span-6">
                <Heading>Experience</Heading>
                <div className="grid grid-cols-1 gap-6 mt-4 md:mt-8">
                  {/* <Timeline> */}
                  {experience.map((item, i) => (
                    <Item key={i} {...item} />
                  ))}
                  {/* </Timeline> */}
                </div>
              </div>

              <div className="col-span-6 md:col-span-6">
                <Heading>Education</Heading>
                <div className="grid grid-cols-1 gap-6 mt-4 md:mt-8">
                  {education.map((item, i) => (
                    <Item key={i} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </section>
          <aside className="col-span-2 md:col-span-6 lg:col-span-4 lg:col-start-9 flex flex-col only-sm:flex-gap-x-4 md:flex-gap-x-6 lg:flex-gap-x-8 flex-gap-y-8 md:flex-gap-y-12">
            {Object.keys(skills).map((group, i) => (
              <div key={i} className="col-span-1">
                <Heading>{group}</Heading>
                <ul className="mt-4 md:mt-8">
                  {skills[group].map((item, i) => (
                    <li className="mt-1 md:mt-2 text-base md:text-lg" key={i}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-1">
              <Button href="/cv.pdf" icon={<FiDownload />} external>
                Download my CV
              </Button>
            </div>
          </aside>
        </div>
      </Fade>
    </div>
  );
}
