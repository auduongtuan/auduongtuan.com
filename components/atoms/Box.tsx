import Balancer from "react-wrap-balancer";
import { twMerge } from "tailwind-merge";
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
      className={twMerge(
        "border border-divider box shadow-[0_4px_5px_-1px_rgb(0_0_0/0.02),_0_2px_3px_-2px_rgb(0_0_0/0.03)] bg-surface p-4 h-full rounded-xl [&>*:first-child]:mt-0",
        className
      )}
      {...rest}
    >
      {caption ? (
        <figure className="flex flex-col justify-center h-full">
          <div className="flex items-center justify-center flex-grow [&>*:first-child]:mt-0">
            {renderChildren()}
          </div>
          <figcaption className="mt-6 text-sm text-center text-secondary">
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
      <div className="mb-4 text-6xl text-center">{emoji}</div>
      {caption && (
        <div className="font-medium leading-normal text-center body-text">
          <Balancer>{caption}</Balancer>
        </div>
      )}
      {children && (
        <div className="w-full [&_.body-text]:!text-base [&_.mt-content-node]:mt-2">
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
