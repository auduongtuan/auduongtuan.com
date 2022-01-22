import React from "react";
import Button from "../atoms/Button";
const Timeline = ({children}:{children?: React.ReactNode}) => (
  <div className="grid grid-cols-1 gap-4 mt-8">
    {children}
  </div>
)
const Heading = ({children}:{children?: React.ReactNode}) => (
  <h2 className="col-span-12 md:col-span-3 lg:col-span-4 relative mt-12 mb-6 first:mt-0 lg:mt-0 text-gray-900">
    <span className="sticky top-4">{children}</span>
  </h2>
);
const Content = ({children, className = ''}:React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`col-span-12 md:col-span-9 lg:col-span-8 text-gray-700 body-text ${className}`}>{children}</div>
)
const Item = ({title, subtitle, description}:{title: string, subtitle?: string, description?: string} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="">
      <h3 className="font-sans text-md font-medium body-text text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm mt-0.5 text-gray-500">{subtitle}</p>}
    </div>
  )
};
const experience = [
  {
    title: 'Aperia Vietnam',
    subtitle: 'UI/UX Designer, Full-time, Apr 2020 - Current',
    description: 'Worked as a lead designer in a specialized team to create a design system that used in company CRM products.'
  },
  {
    title: 'Samsung Vietnam',
    subtitle: 'UI/UX Designer, Full-time, Jan 2020 - Apr 2020',
    description: 'Joined in a new Samsung design team in Vietnam to build apps for IOT devices.'
  },
  {
    title: 'ECOE Vietnam',
    subtitle: 'UI/UX Designer, Contract, Mar 2019 - Oct 2019',
    description: 'Joined to a design team building a new estate platform in Vietnam Market.'
  },
  {
    title: 'Viivue Web Boutique',
    subtitle: 'Web Designer, Part-time, Nov 2018 - Mar 2019',
    description: 'Worked as a part-time web designer for an agency.'
  },
  {
    title: 'Yeah1 Network',
    subtitle: 'Multimedia Designer, Part-time, Dec 2017 - Jul 2018',
    description: 'Worked as a part-time designer and video editor to support marketing materials, landing pages, and videos for Phở Đặc Biệt.'
  }
]

const education = [
  {
    title: 'University of Science HCMC (HCMUS)',
    subtitle: 'BSc in Information Technology, class of 2021',
    description: 'Focus on Web Technologies'
  },
  {
    title: 'University of Architecture HCMC (UAH)',
    subtitle: 'BFA in Graphic Design, class of 2016',
    description: 'Focus on Interaction Design, valedictorian of Web/App Specialization'
  },
  {
    title: 'Keyframe Training',
    subtitle: 'Motion Graphic and C4D Animation, class of 2016'
  },
  {
    title: 'Luong The Vinh High School For The Gifted',
    subtitle: 'Specialization in Physics, class of 2013'
  }
]
const skills = {
  "Skills": [
    "Information Architecture",
    "User-centered Design",
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
    "Javascript/Typescript",
    "ReactJS",
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
    
    <main className="main-container opacity-0 animate-fade-in-fast animation-delay-300 text-gray-900">
    <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-x-12 gap-y-8 md:gap-y-16  lg:gap-y-24">

      <div className="col-span-2 md:col-span-6 lg:col-span-8">
      <h2 className="font-semibold text-3xl">Back in the day</h2> 
      <div className="mt-12">
      <h3 className="mt-10 first:mt-0  text-xl font-sans -mb-1 ">The beginning</h3>
      <p className="mt-content-node body-text text-gray-700">My journey in the digital world started in 2009 when I learned Photoshop and CSS on my own to make Yahoo! blog themes. Then, I acquired skills in PHP, WordPress, and Javascript to create websites and me and friends as a hobby.</p>

      <h3 className="mt-10 first:mt-0  text-xl font-sans -mb-1">From hobby to professional</h3>
      <p className="mt-content-node body-text text-gray-700">
        After high-school graduation in 2013, it’s hard for me to choose between the art side and the tech side (there is no in-between field like HCI in Vietnam at that time). I signed up for both Software Engineering and Graphic Design in the college entrance exam and luckily passed both. Finally, I chose Design school because think it is fun and the environment is more open-minded.
      </p>
      <p className="mt-content-node body-text text-gray-700">
      Although the curriculum is more about traditional graphic design than digital media, I learned how to research thoroughly, think critically and present my ideas. Also, design principles, knowledge about typography, layout, and animation are absorbed through internal and external courses.</p>
      <p className="mt-content-node body-text text-gray-700">I remained interested in programming to create real functional interactive products. It helped me a lot when working for freelance customers or volunteer projects when I was in my UAH.</p>

      <h3 className="mt-10 first:mt-0  text-xl font-sans -mb-1">Broaden my world</h3>
      <p className="mt-content-node body-text text-gray-700">After graduated university and having worked in the UX field for a time, although knowing to code enough for the job, I always felt unfulfilled that I’m lack some tech fundamentals. Therefore, I signed up for my second degree in tech at HCMUS and am currently on my way to pursuing it.</p>
      <p className="mt-content-node body-text text-gray-700">During this time, my programming skill is improved a lot. I learned a lot of data structure and algorithms, got used to React, Typescript, and modern front-end technologies.</p>
      </div>
      </div>
      
      <aside className="col-span-2 md:col-span-6 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-col gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-12">
        <div>
        <h2 className="font-semibold text-3xl">Experience</h2>
          <Timeline>
          {
            experience.map((item, i) => <Item key={i} {...item} />)
          }
          </Timeline>
        </div>


        <div>
        <h2 className="font-semibold text-3xl">Education</h2>
        <div className="grid grid-cols-1 gap-6 mt-8">
        {
          education.map((item, i) => <Item key={i} {...item} />)
        }
        </div>
        </div>
        
        <div><Button href="#">Download CV</Button></div>
      </aside>
    
      
      <section className="col-span-2 md:col-span-6 lg:col-span-8">
      <div className="grid grid-cols-6 gap-x-6 gap-y-16">
         {
          Object.keys(skills).map((group, i) => 
            <div key={i} className="col-span-3 md:col-span-2">
            <h3 className="font-semibold">{group}</h3>
            <ul className="mt-8">
            {
              skills[group].map((item, i) => <li className="mt-2" key={i}>{item}</li>)
            }
            </ul>
            </div>
          )
        }        
      </div>
      </section>
      <section className="col-span-2 md:col-span-6 lg:col-span-4">
          <h3>Contact</h3>
          <p className="font-sans body-text mt-8">
              I&apos;d love to hear from you. Email me any time at <a href="mailto:hi@auduongtuan.com" className="-mx-2 px-2 py-1 rounded-xl hover:bg-black/5 ">hi@auduongtuan.com</a> or find me on 
              {socialNetworks.map((item, i) =>
                <React.Fragment key={i}> {i == socialNetworks.length - 1 && 'and '}<a  href={item.url} className="-mx-2 px-2 py-1 rounded-xl  hover:bg-black/5 inline-flex items-center gap-2">{item.name}</a>{i != socialNetworks.length-1 ? ',' : '.'}</React.Fragment>
              )}
              </p>
      </section>
    </div>
    </main>
  </div>
  );
}