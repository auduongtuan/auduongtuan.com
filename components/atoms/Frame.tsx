import { useDraggable } from "@hooks/useDraggable";
import { cn } from "@lib/utils/cn";
import React, { MouseEventHandler } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiPlus,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import Tooltip from "./Tooltip";

export interface BaseFrameProps extends React.ComponentPropsWithoutRef<"div"> {
  mainClassname?: string;
  headerClassName?: string;
  borderOverlayClassName?: string;
  startContainerClassName?: string;
  draggable?: boolean;
  startContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  endContent?: React.ReactNode;
  dots?: React.ReactNode;
}

export const BaseFrame = ({
  ref,
  children,
  title,
  mainClassname,
  headerClassName,
  borderOverlayClassName,
  startContainerClassName,
  className = "",
  draggable = false,
  startContent,
  middleContent,
  endContent,
  dots,
  ...rest
}: BaseFrameProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const draggleRef = useDraggable(!!draggable);
  const defaultDots = (
    <>
      <span className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 rounded-full"></span>
      <span className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 rounded-full"></span>
      <span className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 rounded-full"></span>
    </>
  );
  return (
    <div
      className={cn(
        `relative z-40 flex w-full translate-z-0 flex-col rounded-xl border-0 shadow-lg`,
        className,
      )}
      ref={(el) => {
        draggleRef.current = el;
        if (ref && el) {
          ref.current = el;
        }
      }}
      {...rest}
    >
      <div
        className={cn(
          "border-primary/20 pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-xl rounded-t-[11px] border border-solid",
          borderOverlayClassName,
        )}
      ></div>
      <header
        className={cn(
          `bg-surface/40 flex items-center justify-between backdrop-blur-md`,
          draggable && "cursor-move",
          "z-1 rounded-t-[11px] px-3 py-1.5",
          headerClassName,
        )}
      >
        <div
          className={cn(
            "flex grow basis-0 items-center",
            startContainerClassName,
          )}
        >
          {dots ?? defaultDots}
          {startContent}
        </div>
        {middleContent}
        <div className="flex grow basis-0 items-center justify-end gap-2 justify-self-end">
          {endContent}
        </div>
      </header>
      <main
        className={cn(
          "bg-surface relative grow-0 overflow-hidden rounded-b-xl p-0 leading-0 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:shadow-[inset_0_1px_0_0_rgba(0,0,0,0.1)] [&_*[data-skeleton]]:rounded-tl-none [&_*[data-skeleton]]:rounded-tr-none",
          mainClassname,
        )}
      >
        {children}
      </main>
    </div>
  );
};
BaseFrame.displayName = "BaseFrame";

export interface AppFrameProps extends BaseFrameProps {
  title?: string;
}

export const AppFrame = ({
  ref,
  middleContent,
  title,
  ...rest
}: BaseFrameProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const middleContentRender = () => (
    <div className="text-surface/80 inline-block min-h-5 w-[60%] justify-self-center rounded-md px-4 py-[2px] text-center text-xs md:w-1/2">
      {title && title.replace(/(^\w+:|^)\/\//, "")}
    </div>
  );
  return (
    <BaseFrame {...rest} ref={ref} middleContent={middleContentRender()} />
  );
};
AppFrame.displayName = "AppFrame";

export interface BrowserFrameProps extends BaseFrameProps {
  url?: string;
}
const BrowserFrame = ({
  ref,
  startContent,
  endContent,
  middleContent,
  title,
  url,
  ...rest
}: BrowserFrameProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const startContentRender = () => (
    <>
      {/* <FiChevronLeft className="hidden md:inline-block opacity-20 mr-1 ml-2 text-primary" />
      <FiChevronRight className="hidden md:inline-block opacity-20 text-primary" /> */}
      {startContent}
    </>
  );
  const middleContentRender = () => (
    <>
      <div className="bg-primary/5 text-primary/70 inline-block min-h-5 w-[80%] justify-self-center rounded-md px-4 py-0.5 text-center text-xs md:w-1/2">
        {url && (
          <a href={url} target="_blank" rel="noreferrer">
            {(title || url).replace(/(^\w+:|^)\/\//, "")}
          </a>
        )}
      </div>
      {middleContent}
    </>
  );
  const endContentRender = () => (
    <>
      <FiGrid className="text-primary hidden opacity-30 md:inline-block" />
      <FiPlus className="text-primary hidden opacity-30 md:inline-block" />
      {endContent}
    </>
  );

  return (
    <BaseFrame
      {...rest}
      ref={ref}
      startContent={startContentRender()}
      middleContent={middleContentRender()}
      endContent={endContentRender()}
    />
  );
};

BrowserFrame.displayName = "BrowserFrame";

export interface PhotoFrameProps extends BaseFrameProps {
  name?: string;
  onClose?: MouseEventHandler;
  closeTooltipContent?: string;
}
export const PhotoFrame = ({
  ref,
  name,
  onClose,
  closeTooltipContent,
  ...rest
}: PhotoFrameProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const closeDot = onClose ? (
    closeTooltipContent ? (
      <Tooltip content={closeTooltipContent}>
        <button
          aria-label="Close it"
          className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 cursor-pointer rounded-full hover:bg-red-500 active:bg-red-700"
          onClick={onClose}
        ></button>
      </Tooltip>
    ) : (
      <button
        aria-label="Close it"
        className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 cursor-pointer rounded-full hover:bg-red-500 active:bg-red-700"
        onClick={onClose}
      ></button>
    )
  ) : null;

  return (
    <BaseFrame
      ref={ref}
      {...rest}
      dots={
        closeDot ? (
          <>
            {closeDot}
            <span className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 rounded-full"></span>
            <span className="bg-primary/15 mr-1.5 block h-2.5 w-2.5 rounded-full"></span>
          </>
        ) : undefined
      }
      middleContent={
        name ? (
          <div className="text-primary/70 w-full px-6 py-0.5 text-center text-sm font-medium">
            {name}
          </div>
        ) : undefined
      }
      endContent={
        <>
          <FiZoomOut className="text-primary opacity-30" />
          <FiZoomIn className="text-primary opacity-30" />
          {rest.endContent}
        </>
      }
    />
  );
};

PhotoFrame.displayName = "PhotoFrame";

export default BrowserFrame;
