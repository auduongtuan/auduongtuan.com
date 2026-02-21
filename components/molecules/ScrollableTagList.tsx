import Tag from "@atoms/Tag";
import FadeScrollableContainer from "@atoms/FadeScrollableContainer";

interface ScrollableTagListProps extends React.ComponentPropsWithoutRef<"div"> {
  tags: string[];
}

const ScrollableTagList = ({ tags, ...rest }: ScrollableTagListProps) => {
  return (
    <FadeScrollableContainer {...rest}>
      <div className="flex items-start gap-2">
        {tags.map((tag, i) => (
          <Tag key={`tag-${i}`} className="shrink-0">
            {tag}
          </Tag>
        ))}
      </div>
    </FadeScrollableContainer>
  );
};

export default ScrollableTagList;
