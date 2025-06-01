import { cn } from "@lib/utils/cn";
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
  const skeletonSTyles = cn(
    "flex items-center justify-center",
    "bg-slate-900/[0.075]",
    type != "inline" ? "absolute top-0 left-0 w-full h-full z-10" : "relative",
    className,
  );
  const context = useContext(SkeletonContext);
  return !context.loaded ? (
    <span role="status" className={skeletonSTyles}>
      <span className="absolute top-0 left-0 isolate z-5 h-full w-full overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-linear-to-r before:from-transparent before:via-white/40 before:to-transparent"></span>
      {type == "image" && (
        <FiImage className="h-12 w-12 max-w-[calc(100%-28px)] text-slate-900 opacity-[0.15]"></FiImage>
      )}
      {type == "video" && (
        <FiVideo className="h-12 w-12 max-w-[calc(100%-28px)] text-slate-900 opacity-[0.15]"></FiVideo>
      )}
    </span>
  ) : null;
};

const SkeletonGroup = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const context = useContext(SkeletonContext);
  return !context.loaded ? <div className={className}>{children}</div> : null;
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
  const skeletonContentStyles = cn(
    "block transition-opacity duration-100 ease-in",
    context.loaded ? "opacity-100" : "opacity-0",
    className,
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
      className={cn("relative block", className)}
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
  Group: SkeletonGroup,
});

export default Skeleton;
