import Balancer from "react-wrap-balancer";
import { cn } from "@lib/utils/cn";

const Box = ({
  children,
  className = "",
  caption,
  contentMaxWidth,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  caption?: string;
  contentMaxWidth?: string;
}) => {
  const renderChildren = () =>
    contentMaxWidth ? (
      <div style={{ maxWidth: contentMaxWidth }}>{children}</div>
    ) : (
      children
    );

  return (
    <div
      className={cn(
        "border-divider box bg-surface h-full rounded-xl border p-4 shadow-[0_4px_5px_-1px_rgb(0_0_0/0.02),_0_2px_3px_-2px_rgb(0_0_0/0.03)] [&>*:first-child]:mt-0",
        className,
      )}
      {...rest}
    >
      {caption ? (
        <figure className="flex h-full flex-col justify-center">
          <div className="flex grow items-center justify-center [&>*:first-child]:mt-0">
            {renderChildren()}
          </div>
          <figcaption className="text-secondary mt-6 text-center text-sm">
            {caption}
          </figcaption>
        </figure>
      ) : (
        renderChildren()
      )}
    </div>
  );
};

export const EmojiBox = ({
  children,
  caption,
  emoji = "🥹",
}: {
  children: React.ReactNode;
  emoji?: string;
  caption?: React.ReactNode;
}) => {
  return (
    <Box>
      <div className="mb-4 text-center text-6xl">{emoji}</div>
      {caption && (
        <div className="body-text text-center leading-normal font-medium">
          <Balancer>{caption}</Balancer>
        </div>
      )}
      {children && (
        <div className="w-full [&_.body-text]:text-base! [&_.mt-content-node]:mt-2">
          {children}
        </div>
      )}
    </Box>
  );
};

export const VideoBox = ({ children }: { children: React.ReactNode }) => (
  <Box className="p-2">{children}</Box>
);

export default Box;
