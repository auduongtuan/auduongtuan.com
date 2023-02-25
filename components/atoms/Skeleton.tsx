import { twMerge } from "tailwind-merge";
import { FiImage, FiVideo } from "react-icons/fi";
const SkeletonDisplay = ({
  className = "",
  type,
}: {
  className?: string;
  type: "image" | "video" | "block";
}) => {
  return (
    <span
      role="status"
      className={twMerge(
        "flex items-center justify-center absolute top-0 left-0 w-full h-full z-10 bg-gray-200 rounded-md overflow-hidden",
        className
      )}
    >
      <div
        className="
          absolute
          top-0
          left-0 
          z-5
          before:absolute before:inset-0
          before:-translate-x-full
          before:animate-[shimmer_2s_infinite]
          before:bg-gradient-to-r
          before:from-transparent before:via-white/60 before:to-transparent
          isolate
          overflow-hidden
          w-full
          h-full
        "
      ></div>
      {type == "image" && (
        <FiImage className="w-12 h-12 text-gray-300"></FiImage>
      )}
      {type == "video" && (
        <FiVideo className="w-12 h-12 text-gray-300"></FiVideo>
      )}
    </span>
  );
};
const SkeletonWrapper = ({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={twMerge("relative block", className)}>{children}</span>
  );
};
// ref: https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/components/transitions/transition.tsx
const Skeleton = Object.assign(SkeletonDisplay, { Wrapper: SkeletonWrapper });
export default Skeleton;
