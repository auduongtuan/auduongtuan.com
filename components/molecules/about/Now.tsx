import InlineLink from "@atoms/InlineLink";
import { NotionNowItem } from "@lib/notion/now";
import { cn } from "@lib/utils/cn";
import Image from "next/image";

const NowItem = ({ item }: { item: NotionNowItem }) => {
  return (
    <div className={cn("rounded-md bg-slate-100 px-3 py-3 md:px-4")}>
      <p className="text-tertiary mt-0.5 text-sm">{item.title}</p>
      <div className="mt-2 flex items-center gap-5 font-mono text-sm leading-tight tracking-tight md:text-base">
        {item.thumbnail && item.link && (
          <div
            className={cn(
              "flex w-[100px] shrink-0 items-center justify-center",
            )}
          >
            <Image
              src={item.thumbnail?.url}
              alt={item.content}
              width={item.thumbnail?.width}
              height={item.thumbnail?.height}
              className="w-full grow rounded-md"
            />
          </div>
        )}
        {item.link ? (
          <div className="flex flex-col gap-2">
            <InlineLink
              className="inline-flex whitespace-normal"
              href={item.link}
            >
              {item.content}
            </InlineLink>
          </div>
        ) : (
          <p className="truncate">{item.content}</p>
        )}
      </div>
    </div>
  );
};

const Now = ({ items }: { items: NotionNowItem[] }) => {
  return (
    <div className="grid grid-cols-1 gap-4 leading-normal md:grid-cols-2">
      {items
        .filter((item) => !item.archived)
        .map((item, i) => (
          <NowItem item={item} key={`now-${i}`} />
        ))}
    </div>
  );
};

export default Now;
