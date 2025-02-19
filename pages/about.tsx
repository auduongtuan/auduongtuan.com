import HeadMeta from "@atoms/HeadMeta";
import { Fact, getFacts } from "@lib/notion/fact";
import { getNotionNowItems, NotionNowItem } from "@lib/notion/now";
import AboutPage from "@templates/about/AboutPage";

export default function About({
  nowItems,
  facts,
}: {
  nowItems: NotionNowItem[];
  facts: Fact[];
}) {
  return (
    <>
      <HeadMeta
        title="About"
        description="I'm a versatile software professional, seamlessly
                  transitioning between the roles of a designer, developer, or
                  any other hat required to bring my creative visions to life."
      />
      <AboutPage nowItems={nowItems} facts={facts} />
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      nowItems: await getNotionNowItems(),
      facts: await getFacts(),
    },
    revalidate: 120,
  };
}
