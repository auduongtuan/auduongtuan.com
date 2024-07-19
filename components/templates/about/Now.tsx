import { AppFrame } from "@atoms/Frame";
import InlineLink from "@atoms/InlineLink";
import { NotionNowItem } from "@lib/notion/now";

const Now = ({ items }: { items: NotionNowItem[] }) => {
  return (
    <AppFrame title="Now" draggable>
      <div className="flex flex-col gap-4 p-4 leading-normal">
        <p>
          {`This section updates what I'm doing, as inspired by `}
          <InlineLink href="https://sive.rs/nowff">
            Now page momment ↗
          </InlineLink>
          .
        </p>
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div
              className="px-3 py-2 rounded-md md:px-4 bg-slate-100"
              key={`now-${i}`}
            >
              <p className="text-sm mt-0.5 text-tertiary">{item.title}</p>
              <div className="mt-1 font-medium text-md body-text">
                {item.link ? (
                  <InlineLink href={item.link}>{item.content}</InlineLink>
                ) : (
                  item.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppFrame>
  );
};

export default Now;
