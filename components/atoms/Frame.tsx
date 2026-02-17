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
  inverted?: boolean;
  mainClassname?: string;
  draggable?: boolean;
  startContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const BaseFrame = ({
  ref,
  children,
  title,
  inverted = false,
  mainClassname,
  className = "",
  draggable = false,
  startContent,
  middleContent,
  endContent,
  ...rest
}: BaseFrameProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const draggleRef = useDraggable(!!draggable);
  const renderFrame = () => {
    return (
      <div
        className={cn(
          `bg-surface relative z-40 flex w-full translate-z-0 flex-col rounded-xl border-0 shadow-lg`,
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
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-xl rounded-t-[11px] border border-solid border-black/20"></div>
        <header
          className={cn(
            `flex items-center justify-between`,
            inverted ? "bg-slate-100" : "bg-slate-800",
            draggable && "cursor-move",
            "z-1 rounded-t-[11px] px-3 py-1.5",
          )}
        >
          <div className="flex grow basis-0 items-center">
            <span className="mr-1.5 block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
            <span className="mr-1.5 block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
            <span className="mr-1.5 block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
            {startContent}
          </div>
          {middleContent}
          <div className="flex grow basis-0 items-center justify-end gap-2 justify-self-end">
            {/* <FiGrid className="hidden md:inline-block text-slate-400" />
            <FiPlus className="hidden md:inline-block text-slate-400" /> */}
            {endContent}
          </div>
        </header>
        <main
          className={cn(
            "grow-0 overflow-hidden rounded-b-xl p-0 leading-0 [&_*[data-skeleton]]:rounded-tl-none [&_*[data-skeleton]]:rounded-tr-none",
            mainClassname,
          )}
        >
          {children}
        </main>
      </div>
    );
  };
  return renderFrame();
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
    <div className="inline-block min-h-[20px] w-[60%] justify-self-center rounded-md px-4 py-[2px] text-center text-xs text-white/80 md:w-1/2">
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
      <FiChevronLeft className="mr-1 ml-2 hidden text-slate-400 md:inline-block" />
      <FiChevronRight className="hidden text-slate-600 md:inline-block" />
      {startContent}
    </>
  );
  const middleContentRender = () => (
    <>
      <div className="bg-surface/20 inline-block min-h-[20px] w-[60%] justify-self-center rounded-md px-4 py-[2px] text-center text-xs text-white/80 md:w-1/2">
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
      <FiGrid className="hidden text-slate-400 md:inline-block" />
      <FiPlus className="hidden text-slate-400 md:inline-block" />
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

export interface PhotoFrameProps extends React.HTMLProps<HTMLDivElement> {
  name?: string;
  inverted?: boolean;
  onClose?: MouseEventHandler;
  closeTooltipContent?: string;
  mainClassname?: string;
}
export const PhotoFrame = ({
  ref,
  children,
  inverted = false,
  name,
  className = "",
  onClose,
  closeTooltipContent,
  mainClassname,
  draggable,
  as,
  ...rest
}: PhotoFrameProps & {
  ref?: React.RefObject<HTMLDivElement>;
}) => {
  const draggleRef = useDraggable(!!draggable);
  const renderFrame = () => (
    <div
      // ref={innerRef}
      // ref={ref}
      ref={(el) => {
        draggleRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref && el) {
          ref.current = el;
        }
      }}
      className={cn(
        `relative flex w-full translate-z-0 flex-col overflow-hidden rounded-xl border border-solid border-black/20 shadow-lg`,
        className,
      )}
      {...rest}
    >
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-full rounded-xl"></div>
      <header
        className={cn(
          "flex items-center justify-between font-sans",
          inverted ? "bg-slate-100" : "bg-slate-800",
          draggable && "cursor-move",
          "z-1 rounded-t-xl border-b border-black/10 px-3 py-1.5",
        )}
      >
        <div className="flex grow basis-0 items-center gap-2">
          {closeTooltipContent ? (
            <Tooltip content={closeTooltipContent}>
              <button
                aria-label="Close it"
                className="block h-2.5 w-2.5 cursor-pointer rounded-full bg-slate-400 hover:bg-red-500 active:bg-red-700"
                onClick={onClose}
              ></button>
            </Tooltip>
          ) : (
            <span className="block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
          )}
          <span className="block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
          <span className="block h-2.5 w-2.5 rounded-full bg-slate-400"></span>
          {/* <FiChevronLeft className="ml-3 text-slate-400" />
      <FiChevronRight className="text-slate-600" /> */}
        </div>
        <div
          className={`text-sm font-semibold ${
            inverted ? "text-slate-700" : "text-white/80"
          } w-full px-8 py-[2px]`}
        >
          {name}
        </div>
        <div className="flex grow basis-0 items-center justify-end gap-2 justify-self-end">
          <FiZoomOut className="text-slate-400" />
          <FiZoomIn className="text-slate-400" />
        </div>
      </header>
      <main
        className={cn(
          "grow-0 leading-0 [&_*[data-skeleton]]:rounded-tl-none [&_*[data-skeleton]]:rounded-tr-none",
          mainClassname,
        )}
      >
        {children}
      </main>
    </div>
  );
  return renderFrame();
};

PhotoFrame.displayName = "PhotoFrame";

export default BrowserFrame;
