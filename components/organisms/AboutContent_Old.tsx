import React from "react";
const Timeline = ({children}:{children?: React.ReactNode}) => (
  <div className="grid grid-cols-1 gap-6">
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
      <h3 className="font-sans font-semibold body-text">{title}</h3>
      {subtitle && <p className="text-sm mt-0.5 text-gray-500">{subtitle}</p>}
      {description && <p className="body-text mt-2">{description}</p>}
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
    subtitle: 'Graphic Designer and Video Editor, Part-time, Dec 2017 - Jul 2018',
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
  "Disciplines": [
    "User Research",
    "Motion Graphic",
    "UX/UI Design",
    "Design System",
    "Front-end Development",
    "Copywriting"
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


  return (
    <div className="p-content bg-slate-50 relative h-full">
    
    <main className="main-container opacity-0 animate-fade-in-fast animation-delay-300">
    <div className="grid grid-cols-12 gap-x-6 gap-y-0 md:gap-y-16 lg:gap-y-24">
      <Heading>Back in the day</Heading> 
      <Content>
      <h3 className="mt-10 first:mt-0 text-gray-900">The beginning</h3>
      <p className="mt-content-node">My journey in the digital world started in 2009 when I learned Photoshop and CSS on my own to make Yahoo! blog themes. Then, I acquired skills in PHP, WordPress, and Javascript to create websites and me and friends as a hobby.</p>

      <h3 className="mt-10 first:mt-0 text-gray-900">From hobby to professional</h3>
      <p className="mt-content-node">
        After high-school graduation in 2013, it’s hard for me to choose between the art side and the tech side (there is no in-between field like HCI in Vietnam at that time). I signed up for both Software Engineering and Graphic Design in the college entrance exam and luckily passed both. Finally, I chose Design school because think it is fun and the environment is more open-minded.
      </p>
      <p className="mt-content-node">
      Although the curriculum is more about traditional graphic design than digital media, I learned how to research thoroughly, think critically and present my ideas. Also, design principles, knowledge about typography, layout, and animation are absorbed through internal and external courses.</p>
      <p className="mt-content-node">I remained interested in programming to create real functional interactive products. It helped me a lot when working for freelance customers or volunteer projects when I was in my UAH.</p>

      <h3 className="mt-10 first:mt-0 text-gray-900">Broaden my world</h3>
      <p className="mt-content-node">After graduated university and having worked in the UX field for a time, although knowing to code enough for the job, I always felt unfulfilled that I’m lack some tech fundamentals. Therefore, I signed up for my second degree in tech at HCMUS and am currently on my way to pursuing it.</p>
      <p className="mt-content-node">During this time, my programming skill is improved a lot. I learned a lot of data structure and algorithms, got used to React, Typescript, and modern front-end technologies.</p>
      </Content>
      
     
      <Heading>Experience</Heading>
      <Content>
        <Timeline>
        {
          experience.map((item, i) => <Item key={i} {...item} />)
        }
        </Timeline>
      </Content>


      <Heading>Education</Heading>
      
      <Content>
      <div className="grid grid-cols-1 gap-6">

      {
        education.map((item, i) => <Item key={i} {...item} />)
      }
      </div>
      </Content>
      <Heading>Skills</Heading>
      
      <Content>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {
          Object.keys(skills).map((group, i) => 
            <div key={i}>
            <h3 className="font-sans font-semibold body-text">{group}</h3>
            {
              skills[group].map((item, i) => <p className="mt-2" key={i}>{item}</p>)
            }</div>
          )
        }
        
      </div>
      </Content>
    </div>
    </main>
  </div>
  );
}