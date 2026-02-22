import Button from "@atoms/Button";
import Fade from "@atoms/Fade";
import { Post } from "@lib/notion";
import MiniPostCard from "@molecules/post/MiniPostCard";
import SectionTitle from "@molecules/SectionTitle";

export default function PostList({ posts }: { posts: Post[] }) {
  return (
    <section id="writings">
      <Fade className="main-container" delay={500} duration={200}>
        <SectionTitle
          title="Writings"
          action={
            <Button href="/blog" variant="ghost">
              View all
            </Button>
          }
        />

        <div className="group mt-6 grid grid-cols-1 gap-6 md:-mx-6 md:mt-2 md:grid-cols-2 md:gap-0">
          {posts
            .filter((post) => !post.protected)
            .slice(0, 6)
            .map((postItem) => (
              <div
                className="flex flex-col border-gray-200 md:px-6 md:py-4 md:odd:border-r"
                key={postItem.id}
              >
                <MiniPostCard post={postItem} className="grow" />
              </div>
            ))}
        </div>
      </Fade>
    </section>
  );
}
