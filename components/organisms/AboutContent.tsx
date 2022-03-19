import React from "react";
import Button from "../atoms/Button";
const Timeline = ({children}:{children?: React.ReactNode}) => (
  <div className="grid grid-cols-1 gap-4 mt-8">
    {children}
  </div>
)
// const Heading = ({children}:{children?: React.ReactNode}) => (
//   <h2 className="col-span-12 md:col-span-3 lg:col-span-4 relative mt-12 mb-6 first:mt-0 lg:mt-0 text-gray-800">
//     <span className="sticky top-4">{children}</span>
//   </h2>
// );
const Heading = ({children}:{children?: React.ReactNode}) => (
  <h2 className="text-2xl tracking-wide uppercase text-gray-800">
    {children}
  </h2>
);
const Content = ({children, className = ''}:React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`col-span-12 md:col-span-9 lg:col-span-8 text-gray-700 body-text ${className}`}>{children}</div>
)
const Item = ({title, subtitle, time, description}:{title: string, subtitle?: string, time?: string, description?: string} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="grid grid-cols-5 items-center gap-x-4 gap-y-1 group">
      <div className="col-span-5 lg:col-span-5">
      {subtitle && <p className="text-sm mt-0.5 text-gray-500">{time}</p>}

      </div>
      <div className="col-span-5 lg:col-span-5 md:flex items-baseline md:flex-gap-2">
      <h3 className="font-sans text-md font-medium body-text text-gray-800">{title}</h3>
      {subtitle && <p className="text-md body-text m-0 md:mt-0.5 text-gray-500 justify-self-end md:order-3">{subtitle}</p>}
      <div className="flex-1 border-gray-300 border-t border-dashed mt-3 md:mt-0 md:order-2 group-last:hidden md:group-last:block"></div>
      </div>
 
    </div>
  )
};
const experience = [
  {
    title: 'Aperia Vietnam',
    time: 'Apr 2020 - Current',
    subtitle: 'UI/UX Designer',
    type: 'Full-time',
    description: 'Worked as a lead designer in a specialized team to create a design system that used in company CRM products.'
  },
  {
    title: 'Samsung Vietnam',
    subtitle: 'UI/UX Designer',
    type: 'Full-time',
    time: 'Jan 2020 - Apr 2020',
    description: 'Joined in a new Samsung design team in Vietnam to build apps for IOT devices.'
  },
  {
    title: 'ECOE Vietnam',
    subtitle: 'UI/UX Designer',
    type: 'Contract',
    time: 'Mar 2019 - Oct 2019',
    description: 'Joined to a design team building a new estate platform in Vietnam Market.'
  },
  {
    title: 'Viivue Web Boutique',
    subtitle: 'Web Designer',
    type: 'Part-time', 
    time: 'Nov 2018 - Mar 2019',
    description: 'Worked as a part-time web designer for an agency.'
  },
  {
    title: 'Yeah1 Network',
    subtitle: 'Multimedia Designer',
    type: 'Part-time',
    time: 'Dec 2017 - Jul 2018',
    description: 'Worked as a part-time designer and video editor to support marketing materials, landing pages, and videos for Phở Đặc Biệt.'
  }
]

const education = [
  {
    title: 'University of Science HCMC (HCMUS)',
    subtitle: 'BSc in Information Technology',
    time: '2021 - Current',
    description: 'Focus on Web Technologies'
  },
  {
    title: 'University of Architecture HCMC (UAH)',
    subtitle: 'BFA in Graphic Design',
    time: '2016 - 2020',
    description: 'Focus on Interaction Design, valedictorian of Web/App Specialization'
  },
  {
    title: 'Keyframe Training',
    subtitle: 'Motion Graphic and C4D Animation',
    time: '2016 - 2017'
  },
  {
    title: 'Luong The Vinh High School For The Gifted',
    subtitle: 'Specialization in Physics', 
    time: '2013 - 2016'
  }
]
const skills = {
  "What I do": [
    "Information Architecture",
    "Product Design",
    "Copywriting",
    "Motion Graphic",
    "Design System",
    "Front-end Development",
  ],
  "Design Tools": [
    "Adobe Creative Suite",
    "Whimsical",
    "Sketch, Figma, XD",
    "Abstract",
    "C4D, Blender"
  ],
  "Tech Stack": [
    "HTML & CSS",
    "Javascript, Typescript",
    "ReactJS, NextJS",
    "Git",
    "PHP, WordPress"
  ]
}
const now = [
  {title:'Learning Typescript & React Hooks'},
  {title:'Build Figma Plugin'},
]
export default function AboutContent() {

  const socialNetworks = [
    {name: "Github", url: ""},
    {name: "Instagram", url: ""},
    {name: "Linkedin", url: ""}
  ];
  return (
    <div className="p-content bg-slate-50 relative h-full">
    
    <main className="main-container opacity-0 animate-fade-in-fast animation-delay-300 text-gray-800">
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-x-16 gap-y-8 md:gap-y-16  lg:gap-y-24">
    
      <section className="col-span-2 md:col-span-6 lg:col-span-8">
      
      <div className="grid grid-cols-6 gap-x-20 gap-y-16">
        <div className="col-span-6 md:col-span-6">
        <Heading>Experience</Heading>
          <Timeline>
          {
            experience.map((item, i) => <Item key={i} {...item} />)
          }
          </Timeline>
        </div>


        <div className="col-span-6 md:col-span-6">
        <Heading>Education</Heading>
        <div className="grid grid-cols-1 gap-6 mt-8">
        {
          education.map((item, i) => <Item key={i} {...item} />)
        }
        </div>
        </div>
        
        {/* <section className="col-span-6 md:col-span-6">
          <Heading>Current favorites</Heading>
          <p className="font-sans body-text mt-8">
              I&apos;d love to hear from you. Email me any time at <a href="mailto:hi@auduongtuan.com" className="-mx-2 px-2 py-1 rounded-xl hover:bg-black/5 ">hi@auduongtuan.com</a> or find me on 
              {socialNetworks.map((item, i) =>
                <React.Fragment key={i}> {i == socialNetworks.length - 1 && 'and '}<a  href={item.url} className="-mx-2 px-2 py-1 rounded-xl  hover:bg-black/5 inline-flex items-center gap-2">{item.name}</a>{i != socialNetworks.length-1 ? ',' : '.'}</React.Fragment>
              )}
              </p>
          </section> */}
        <section className="col-span-6 md:col-span-6">
          <Heading>Contact</Heading>
          <p className="font-sans body-text mt-8">
              I&apos;d love to hear from you. Email me any time at <a href="mailto:hi@auduongtuan.com" className="-mx-2 px-2 py-1 rounded-xl hover:bg-black/5 ">hi@auduongtuan.com</a> or find me on 
              {socialNetworks.map((item, i) =>
                <React.Fragment key={i}> {i == socialNetworks.length - 1 && 'and '}<a  href={item.url} className="-mx-2 px-2 py-1 rounded-xl  hover:bg-black/5 inline-flex items-center gap-2">{item.name}</a>{i != socialNetworks.length-1 ? ',' : '.'}</React.Fragment>
              )}
              </p>
          </section>
      </div>
      </section>
      <aside className="col-span-2 md:col-span-6 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-12">
        {
          Object.keys(skills).map((group, i) => 
            <div key={i} className="col-span-6 md:col-span-3">
            <Heading>{group}</Heading>
            <ul className="mt-8">
            {
              skills[group].map((item, i) => <li className="mt-2 body-text" key={i}>{item}</li>)
            }
            </ul>
            </div>
          )
        }        
        
        {/* <div><Button href="#">Download CV</Button></div> */}
      </aside>
   
    </div>
    </main>
  </div>
  );
}