import React from "react";
import Fade from "@atoms/Fade";
import { newExperience, now, cvLink, education } from "./content";
import InlineLink from "@atoms/InlineLink";
import { twMerge } from "tailwind-merge";

const Heading = ({
  children,
  className,
  ...rest
}: React.ComponentPropsWithRef<"h2">) => (
  <h2
    className={twMerge(
      "pb-2 -mb-1 border-b border-gray-200 sub-heading",
      className
    )}
    {...rest}
  >
    {children}
  </h2>
);

const NewItem = ({
  title,
  subtitle,
  time,
  education,
}: {
  title: string;
  subtitle?: string;
  time?: string;
  education?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="items-center bg-white rounded-md gap-x-4 gap-y-0 group ">
      <div className="items-baseline col-span-5 lg:col-span-5 ">
        <span className="font-medium text-md body-text ">{title}</span>{" "}
        {!education && subtitle && (
          <span className="text-sm text-gray-500">· {subtitle}</span>
        )}
        {education && subtitle && (
          <span className="block text-sm my-0.5 text-gray-500">{subtitle}</span>
        )}
      </div>
      <div className="col-span-5 lg:col-span-5">
        {time && (
          <p className="text-sm m-0 md:mt-0.5 text-gray-500 justify-self-end tabular-nums">
            {time}
          </p>
        )}
      </div>
    </div>
  );
};

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
    <div className="grid items-center grid-cols-5 gap-x-4 gap-y-0 group">
      <div className="items-baseline col-span-5 lg:col-span-5 md:flex md:flex-gap-2">
        <div className="font-medium text-md body-text ">{title}</div>
        <div className="flex-1 hidden mt-3 border-t border-gray-300 border-dashed md:block md:mt-0"></div>
        {time && (
          <p className="text-sm  m-0 md:mt-0.5 text-gray-500 justify-self-end fonts-mono tabular-nums">
            {time}
          </p>
        )}
      </div>
      <div className="col-span-5 lg:col-span-5">
        {subtitle && <p className="text-sm mt-0.5 text-gray-500">{subtitle}</p>}
        <div className="flex-1 mt-3 border-t border-gray-300 border-dashed md:hidden md:mt-0 md:order-2 group-last:hidden"></div>
      </div>
    </div>
  );
};

export default function AboutContent() {
  return (
    <div className="relative h-full p-content">
      <Fade delay={300} className="text-gray-800 main-container">
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-x-8 gap-y-8 md:gap-y-12 lg:gap-y-24">
          <section className="col-span-2 md:col-span-6 lg:col-span-8 lg:mr-8">
            <div className="grid grid-cols-1 gap-y-8 md:gap-y-12 gap-x-16">
              <div className="col-span-6 md:col-span-6">
                <Heading>Work Experience</Heading>

                <div className="grid grid-cols-1 gap-5 mt-4 md:gap-6 md:grid-cols-2 md:mt-8">
                  {newExperience.map((item, i) => (
                    <NewItem key={i} {...item} />
                  ))}
                </div>
              </div>

              {/* <div className="col-span-6 md:col-span-6">
                <Heading>Experience</Heading>
                <div className="grid grid-cols-1 gap-6 mt-4 md:mt-8">
                  {experience.map((item, i) => (
                    <Item key={i} {...item} />
                  ))}
                </div>
              </div> */}

              <div className="col-span-6 md:col-span-6">
                <Heading>Education</Heading>
                <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 md:mt-8">
                  {education.map((item, i) => (
                    <NewItem education key={i} {...item} />
                  ))}
                </div>
              </div>
            </div>
          </section>
          {/* <aside className="flex flex-col col-span-2 md:col-span-6 lg:col-span-4 lg:col-start-9 only-sm:flex-gap-x-4 md:flex-gap-x-6 lg:flex-gap-x-8 flex-gap-y-8 md:flex-gap-y-12">
            {Object.keys(skills).map((group, i) => (
              <div key={i} className="col-span-1">
                <Heading>{group}</Heading>
                <ul className="mt-4 md:mt-8">
                  {skills[group].map((item, i) => (
                    <li className="mt-1 text-base md:mt-2 md:text-lg" key={i}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-1">
              <Button href={cvLink} icon={<FiDownload />} external>
                Download my CV
              </Button>
            </div>
          </aside> */}
          <aside className="flex flex-col col-span-2 md:col-span-6 lg:col-span-4 lg:col-start-9 only-sm:flex-gap-x-4 md:flex-gap-x-6 lg:flex-gap-x-8 flex-gap-y-8 md:flex-gap-y-12">
            {/* {Object.keys(skills).map((group, i) => (
              <div key={i} className="col-span-1">
                <Heading>{group}</Heading>
                <ul className="mt-4 md:mt-8">
                  {skills[group].map((item, i) => (
                    <li className="mt-1 text-base md:mt-2 md:text-lg" key={i}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))} */}
            <div className="col-span-6 md:col-span-6">
              <Heading>Now</Heading>
              <div className="grid grid-cols-1 gap-6 mt-4 md:mt-8">
                <p className="col-span-1">
                  {`This section updates what I'm doing, as inspired by `}
                  <InlineLink href="https://sive.rs/nowff">
                    Now page momment ↗
                  </InlineLink>
                  .
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-1">
                  {now.map((item, i) => (
                    <div
                      className="px-3 py-2 rounded-md md:px-4 bg-slate-100"
                      key={`now-${i}`}
                    >
                      <p className="text-sm mt-0.5 text-gray-500">
                        {item.title}
                      </p>
                      <div className="mt-1 font-medium text-md body-text">
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
          </aside>
        </div>
      </Fade>
    </div>
  );
}
