import { twMerge } from "tailwind-merge";
import { FiImage, FiVideo } from "react-icons/fi";
import { createContext, useContext } from "react";
const SkeletonContext = createContext({ loaded: false, block: false });

const SkeletonDisplay = ({
  className = "",
  type = "block",
}: {
  className?: string;
  type: "image" | "video" | "block" | "inline";
}) => {
  const skeletonSTyles = twMerge(
    "flex items-center justify-center",
    "bg-slate-900/[0.075]",
    type != "inline" ? "absolute top-0 left-0 w-full h-full z-10" : "relative",
    className
  );
  const context = useContext(SkeletonContext);
  return !context.loaded ? (
    <span role="status" className={skeletonSTyles}>
      <span
        className="
          absolute
          top-0
          left-0 
          z-5
          before:absolute before:inset-0
          before:-translate-x-full
          before:animate-[shimmer_2s_infinite]
          before:bg-linear-to-r
          before:from-transparent before:via-white/40 before:to-transparent
          isolate
          overflow-hidden
          w-full
          h-full
        "
      ></span>
      {type == "image" && (
        <FiImage className="w-12 h-12 max-w-[calc(100%-28px)] text-slate-900 opacity-[0.15]"></FiImage>
      )}
      {type == "video" && (
        <FiVideo className="w-12 h-12 max-w-[calc(100%-28px)] text-slate-900 opacity-[0.15]"></FiVideo>
      )}
    </span>
  ) : null;
};

interface SkeletonWrapperProps<T extends React.ElementType> {
  children?: React.ReactNode;
  loaded?: boolean;
  as?: T;
  block?: boolean;
}

const SkeletonContent = ({
  className,
  children,
  unmount = false,
  // loaded,
  ...rest
}: { unmount?: boolean } & React.HTMLAttributes<HTMLSpanElement>) => {
  const context = useContext(SkeletonContext);
  const Component = context.block ? "div" : "span";
  const skeletonContentStyles = twMerge(
    "block transition-opacity duration-100 ease-in",
    context.loaded ? "opacity-100" : "opacity-0",
    className
  );
  return context.loaded || (!context.loaded && !unmount) ? (
    <Component className={skeletonContentStyles} {...rest}>
      {children}
    </Component>
  ) : null;
};

const SkeletonWrapper = <T extends React.ElementType = "div">({
  className,
  children,
  loaded = false,
  as,
  block = false,
  ...rest
}: SkeletonWrapperProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof SkeletonWrapperProps<T>>) => {
  const Component = as || "span";
  return (
    <Component
      className={twMerge("relative block", className)}
      {...rest}
      data-skeleton
    >
      <SkeletonContext.Provider value={{ loaded, block }}>
        {children}
      </SkeletonContext.Provider>
    </Component>
  );
};

// ref: https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/components/transitions/transition.tsx
const Skeleton = Object.assign(SkeletonDisplay, {
  Wrapper: SkeletonWrapper,
  Content: SkeletonContent,
});
export default Skeleton;
