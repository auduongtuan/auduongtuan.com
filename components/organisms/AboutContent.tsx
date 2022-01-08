const Heading = ({children}:{children?: React.ReactNode}) => (
  <h2 className="col-span-4 relative mt-15 text-gray-900">
    <span className="sticky top-4">{children}</span>
  </h2>
);
const Content = ({children}:{children?: React.ReactNode}) => (
  <div className="col-span-8 mt-15 text-gray-700">{children}</div>
)
export default function AboutContent() {


  return (
    <div className="pt-28 pb-28 bg-zinc-100 relative h-full">
    
    <main className="main-container opacity-0 animate-fade-in-fast animation-delay-300">
    <div className="grid grid-cols-12 gap-3 text-xl">
      <Heading>Back in the day</Heading> 
      <Content>
      <h3 className="mt-10 first:mt-0 text-gray-900">The begining</h3>
      <p className="mt-6 leading-normal">My journey in digital world started in 2009, when I learned Photoshop and CSS on my own to make Yahoo! blog themes. Then, I acquired skills in PHP, Wordpress and Javascript to create websites for hobby and friends.</p>

      <h3 className="mt-10 first:mt-0 text-gray-900">From hobby to professional</h3>
      <p className="mt-6 leading-normal">After high-school graduation in 2013, it’s hard for me to choose between the art side and the tech side (there is no in-between field like HCI in Vietnam at that time). So I ended up to go to Design school to boost my creativity.
      Although the curriculumn is more about print design, I learned a lot of design principles, typography, layout and animation in design school.</p>
      <p className="mt-6 leading-normal">I still remained my interests in programing to create real functional interactive products. It helped me a lot when working for freelance customers or volunteer projects when I was in my UAH.</p>

      <h3 className="mt-10 first:mt-0 text-gray-900">Broaden my world</h3>
      <p className="mt-6 leading-normal">After graduated university and having worked in UX field for a time, although having kinda good skill in front-end dev, I always felt unfullfilled that I’m lack of something (lost something about the tech fundamentals). Therefore, I signed up for my second degree in tech at HCMUS and currenly on my way to pursue it.</p>
      <p className="mt-6 leading-normal">During this time, my programing skill is improved a lot. I learned a lot of data structure and agorithm, got used to React, Typescript and modern front-end technologies.</p>
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