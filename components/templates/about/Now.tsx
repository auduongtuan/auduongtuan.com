import { AppFrame } from "@atoms/Frame";
import InlineLink from "@atoms/InlineLink";
import { NotionNowItem } from "@lib/notion/now";
import { cn } from "@lib/utils/cn";
import Image from "next/image";

const Now = ({ items }: { items: NotionNowItem[] }) => {
  return (
    // <AppFrame title="Now" draggable>
    <div className="grid grid-cols-1 gap-4 leading-normal md:grid-cols-6">
      {items.map((item, i) => (
        <div
          className={cn(
            "px-3 py-3 rounded-md md:px-4 bg-slate-100 md:col-span-6"
            // i == 2 ? "md:col-span-6" : "md:col-span-3"
          )}
          key={`now-${i}`}
        >
          <p className="text-sm mt-0.5 text-tertiary">{item.title}</p>
          <div className="flex items-center gap-5 mt-2 font-mono leading-tight tracking-tight text-md body-text">
            {(item.thumbnail || item.link) && (
              <div className={cn("w-[100px] flex items-center justify-center")}>
                <Image
                  src={
                    item.thumbnail || "/api/website-thumbnail?url=" + item.link
                  }
                  alt={item.content}
                  width="100"
                  height={item.type == "youtube" ? 90 : 100}
                  className="rounded-md"
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
      ))}
    </div>
    // </AppFrame>
  );
};

export default Now;
