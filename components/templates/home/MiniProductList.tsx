import Fade from "@atoms/Fade";
import { Project } from "@lib/notion";
import ProductCard from "@molecules/project/ProductCard";
import SectionTitle from "@molecules/SectionTitle";

export default function ProductList({ products }: { products: Project[] }) {
  return (
    <section
      id="works"
      className="relative"
      style={
        {
          "--half-margin":
            "calc(var(--section-horizontal-padding) + (var(--vw) * 100 - var(--main-width)) / 2)",
        } as React.CSSProperties
      }
    >
      <Fade
        // className="main-container ml-0"
        delay={500}
        duration={200}
      >
        <div className="main-container">
          <SectionTitle
            title="My pet products"
            // action={
            //   <Button href="/work" secondary>
            //     View all
            //   </Button>
            // }
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {products
              .sort((a, b) => b.point - a.point)
              .slice(0, 6)
              .map((project, i) => (
                <ProductCard
                  key={`{project.slug}-${i}`}
                  index={i}
                  project={project}
                  projects={products}
                  // className="w-[calc(min(440px,var(--vw)*100-var(--section-horizontal-padding)*2-60px))] shrink-0 translate-x-(--half-margin)"
                  className="w-"
                />
              ))}
          </div>
        </div>

        {/* <div className="main-container">
          <Button href="/work" className="mt-6 w-full justify-center" secondary>
            View all projects
          </Button>
        </div> */}
      </Fade>
    </section>
  );
}
