import { AppFrame } from "@atoms/Frame";
import InlineLink from "@atoms/InlineLink";
import { NotionNowItem } from "@lib/notion/now";
import { cn } from "@lib/utils/cn";

const Now = ({ items }: { items: NotionNowItem[] }) => {
  return (
    // <AppFrame title="Now" draggable>
    <div className="grid grid-cols-1 gap-4 leading-normal md:grid-cols-6">
      {items.map((item, i) => (
        <div
          className={cn(
            "px-3 py-3 rounded-md md:px-4 bg-slate-100",
            i == 2 ? "md:col-span-6" : "md:col-span-3"
          )}
          key={`now-${i}`}
        >
          <p className="text-sm mt-0.5 text-tertiary">{item.title}</p>
          <div className="mt-1.5 font-mono tracking-tight leading-tight text-md body-text">
            {item.link ? (
              <InlineLink
                className="inline-block max-w-full min-w-0 truncate"
                href={item.link}
              >
                {item.content}
              </InlineLink>
            ) : (
              <p className="truncate">{item.content}</p>
            )}
          </div>
        </div>
      ))}
    </div>
    // </AppFrame>
  );
};

export default Now;
