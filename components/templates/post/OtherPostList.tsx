import { Post } from "@lib/notion";
import OtherPostListItem from "./OtherPostListItem";

const OtherPostList = ({ posts, post }: { post: Post; posts: Post[] }) => {
  return (
    <>
      <h3 className="sub-heading">Other posts</h3>
      <div className="grid grid-cols-1 gap-6 mt-6 md:mt-2 md:grid-cols-2 md:gap-0 md:-mx-6 group">
        {posts
          .filter((postItem) => postItem.slug != post.slug)
          .map((postItem) => (
            <div
              className="flex flex-col border-gray-200 md:odd:border-r md:px-6 md:py-4 "
              key={postItem.id}
            >
              <OtherPostListItem post={postItem} className="flex-grow" />
            </div>
          ))}
      </div>
    </>
  );
};

export default OtherPostList;
