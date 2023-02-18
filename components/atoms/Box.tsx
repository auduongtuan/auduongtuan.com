import Balancer from "react-wrap-balancer"
const Box = ({
  children,
  className = "",
  caption,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  caption?: string;
}) => {
  return (
    <div
      className={`box shadow-[0_4px_5px_-1px_rgb(0_0_0/0.04),_0_2px_3px_-2px_rgb(0_0_0/0.03)] bg-white p-4 h-full rounded-xl ${className}`}
      {...rest}
    >
      {caption ? (
        <div className="flex flex-col  justify-center h-full">
          <div className="flex-grow flex items-center justify-center">
            {children}
          </div>
          <h4 className="text-center font-medium">{caption}</h4>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
export const EmojiBox = ({
  children,
  caption,
  emoji,
}: {
  children: React.ReactNode;
  emoji: string;
  caption?: string;
}) => {
  return (
    <Box>
      <div className="text-6xl text-center mb-4">{emoji}</div>
      {caption && <div className="body-text font-medium leading-normal text-center"><Balancer>{caption}</Balancer></div>}
    </Box>
  );
};
export const VideoBox = ({ children }: { children: React.ReactNode }) => (
  <Box className="p-2">{children}</Box>
);
export default Box;
