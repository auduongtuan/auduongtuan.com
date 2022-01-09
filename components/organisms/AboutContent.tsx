const Heading = ({children}:{children?: React.ReactNode}) => (
  <h2 className="col-span-12 md:col-span-3 lg:col-span-4 relative mt-15 text-gray-900">
    <span className="sticky top-4">{children}</span>
  </h2>
);
const Content = ({children}:{children?: React.ReactNode}) => (
  <div className="col-span-12 md:col-span-9 lg:col-span-8 mt-15 text-gray-700">{children}</div>
)
export default function AboutContent() {


  return (
    <div className="pt-28 pb-28 bg-zinc-100 relative h-full">
    
    <main className="main-container opacity-0 animate-fade-in-fast animation-delay-300">
    <div className="grid grid-cols-12 gap-6 text-xl">
      <Heading>Back in the day</Heading> 
      <Content>
      <h3 className="mt-10 first:mt-0 text-gray-900">The beginning</h3>
      <p className="mt-6 leading-normal">My journey in the digital world started in 2009 when I learned Photoshop and CSS on my own to make Yahoo! blog themes. Then, I acquired skills in PHP, WordPress, and Javascript to create websites and me and friends as a hobby.</p>

      <h3 className="mt-10 first:mt-0 text-gray-900">From hobby to professional</h3>
      <p className="mt-6 leading-normal">After high-school graduation in 2013, it’s hard for me to choose between the art side and the tech side (there is no in-between field like HCI in Vietnam at that time). So I ended up going to Design school to boost my creativity. Although the curriculum is more about print design, I learned a lot of design principles, typography, layout, and animation in design school.</p>
      <p className="mt-6 leading-normal">I remained interested in programming to create real functional interactive products. It helped me a lot when working for freelance customers or volunteer projects when I was in my UAH.</p>

      <h3 className="mt-10 first:mt-0 text-gray-900">Broaden my world</h3>
      <p className="mt-6 leading-normal">After graduated university and having worked in the UX field for a time, although having kinda good skills in front-end dev, I always felt unfulfilled that I’m lack some tech fundamentals. Therefore, I signed up for my second degree in tech at HCMUS and am currently on my way to pursuing it.</p>
      <p className="mt-6 leading-normal">During this time, my programming skill is improved a lot. I learned a lot of data structure and algorithms got used to React, Typescript, and modern front-end technologies.</p>
      </Content>
      
      <Heading>Now</Heading>
      <Content></Content>

      <Heading>Experience</Heading>
      <Content>

      </Content>


      <Heading>Education</Heading>
      <Content>

      </Content>
    </div>
    </main>
  </div>
  );
}