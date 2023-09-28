import HeadMeta from "@atoms/HeadMeta";
import AboutPage from "@templates/about/AboutPage";

export default function About() {
  return (
    <>
      <HeadMeta
        title="About"
        description="I'm a versatile software professional, seamlessly
                  transitioning between the roles of a designer, developer, or
                  any other hat required to bring my creative visions to life."
      />
      <AboutPage />
    </>
  );
}
