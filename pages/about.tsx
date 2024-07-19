import HeadMeta from "@atoms/HeadMeta";
import { getNotionNowItems, NotionNowItem } from "@lib/notion/now";
import AboutPage from "@templates/about/AboutPage";

export default function About({ nowItems }: { nowItems: NotionNowItem[] }) {
  return (
    <>
      <HeadMeta
        title="About"
        description="I'm a versatile software professional, seamlessly
                  transitioning between the roles of a designer, developer, or
                  any other hat required to bring my creative visions to life."
      />
      <AboutPage nowItems={nowItems} />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      nowItems: await getNotionNowItems(),
    },
    revalidate: 120,
  };
}
