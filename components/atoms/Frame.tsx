import React, { MouseEventHandler } from "react";
import useBreakpoint from "@hooks/useBreakpoint";
import Draggable from "react-draggable";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiGrid,
  FiZoomIn,
  FiZoomOut,
} from "react-icons/fi";
import Tooltip from "./Tooltip";
import { twMerge } from "tailwind-merge";

export interface BaseFrameProps extends React.ComponentPropsWithoutRef<"div"> {
  inverted?: boolean;
  mainClassname?: string;
  draggable?: boolean;
  startContent?: React.ReactNode;
  middleContent?: React.ReactNode;
  endContent?: React.ReactNode;
}
export const BaseFrame = React.forwardRef<HTMLDivElement, BaseFrameProps>(
  (
    {
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
    },
    ref
  ) => {
    const renderFrame = () => {
      return (
        <div
          className={`w-full flex flex-col border-0 z-40 relative bg-surface rounded-xl translate-z-0 shadow-lg ${className}`}
          {...rest}
        >
          <div className="pointer-events-none border-solid border border-black/20 rounded-t-[11px] w-full h-full z-10 rounded-xl absolute top-0 left-0"></div>
          <header
            className={twMerge(
              `flex items-center justify-between`,
              inverted ? "bg-slate-100" : "bg-slate-800",
              draggable && "cursor-move",
              "px-3 py-1.5  rounded-t-[11px] z-[1]"
            )}
          >
            <div className="flex items-center flex-grow flex-gap-2 basis-0">
              <span className="block w-2 h-2 rounded bg-slate-400"></span>
              <span className="block w-2 h-2 rounded bg-slate-400"></span>
              <span className="block w-2 h-2 rounded bg-slate-400"></span>
              {startContent}
            </div>
            {middleContent}
            <div className="flex items-center justify-end flex-grow flex-gap-2 basis-0 justify-self-end">
              {/* <FiGrid className="hidden md:inline-block text-slate-400" />
              <FiPlus className="hidden md:inline-block text-slate-400" /> */}
              {endContent}
            </div>
          </header>
          <main
            className={twMerge(
              "overflow-hidden p-0 rounded-b-xl flex-grow-0 leading-[0] [&_*[data-skeleton]]:rounded-tl-none [&_*[data-skeleton]]:rounded-tr-none",
              mainClassname
            )}
          >
            {children}
          </main>
        </div>
      );
    };
    return draggable ? <Draggable>{renderFrame()}</Draggable> : renderFrame();
  }
);
BaseFrame.displayName = "BaseFrame";

export interface AppFrameProps extends BaseFrameProps {
  title?: string;
}

export const AppFrame = React.forwardRef<HTMLDivElement, BaseFrameProps>(
  ({ middleContent, title, ...rest }, ref) => {
    const middleContentRender = () => (
      <div className="text-xs text-white/80 text-center min-h-[20px] px-4 py-[2px] rounded-md inline-block justify-self-center w-[60%] md:w-1/2">
        {title && title.replace(/(^\w+:|^)\/\//, "")}
      </div>
    );
    return (
      <BaseFrame {...rest} ref={ref} middleContent={middleContentRender()} />
    );
  }
);
AppFrame.displayName = "AppFrame";

export interface BrowserFrameProps extends BaseFrameProps {
  url?: string;
}
const BrowserFrame = React.forwardRef<HTMLDivElement, BrowserFrameProps>(
  ({ startContent, endContent, middleContent, url, ...rest }, ref) => {
    const startContentRender = () => (
      <>
        <FiChevronLeft className="hidden ml-3 md:inline-block text-slate-400" />
        <FiChevronRight className="hidden md:inline-block text-slate-600" />
        {startContent}
      </>
    );
    const middleContentRender = () => (
      <>
        <div className="bg-white/20 text-xs text-white/80 text-center min-h-[20px] px-4 py-[2px] rounded-md inline-block justify-self-center w-[60%] md:w-1/2">
          {url && (
            <a href={url} target="_blank" rel="noreferrer">
              {url.replace(/(^\w+:|^)\/\//, "")}
            </a>
          )}
        </div>
        {middleContent}
      </>
    );
    const endContentRender = () => (
      <>
        <FiGrid className="hidden md:inline-block text-slate-400" />
        <FiPlus className="hidden md:inline-block text-slate-400" />
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
  }
);

BrowserFrame.displayName = "BrowserFrame";

export interface PhotoFrameProps extends React.HTMLProps<HTMLDivElement> {
  name?: string;
  inverted?: boolean;
  onClose?: MouseEventHandler;
  closeTooltipContent?: string;
  mainClassname?: string;
}
export const PhotoFrame = React.forwardRef<HTMLDivElement, PhotoFrameProps>(
  (
    {
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
    },
    ref
  ) => {
    const bp = useBreakpoint();
    const renderFrame = () => (
      <div
        // ref={innerRef}
        ref={ref}
        className={twMerge(
          `w-full flex flex-col relative border-solid border border-black/20 rounded-xl overflow-hidden translate-z-0 shadow-lg`,
          className
        )}
        {...rest}
      >
        <div className="absolute top-0 left-0 z-10 w-full h-full pointer-events-none rounded-xl"></div>
        <header
          className={twMerge(
            "flex items-center justify-between",
            inverted ? "bg-slate-100" : "bg-slate-800",
            draggable && "cursor-move",
            "px-3 py-1.5 rounded-t-xl border-b border-black/10 z-[1] "
          )}
        >
          <div className="flex items-center flex-grow flex-gap-2 basis-0">
            {closeTooltipContent ? (
              <Tooltip content={closeTooltipContent}>
                <button
                  aria-label="Close it"
                  className="block w-2 h-2 rounded cursor-pointer bg-slate-400 hover:bg-red-500 active:bg-red-700"
                  onClick={onClose}
                ></button>
              </Tooltip>
            ) : (
              <span className="block w-2 h-2 rounded bg-slate-400"></span>
            )}
            <span className="block w-2 h-2 rounded bg-slate-400"></span>
            <span className="block w-2 h-2 rounded bg-slate-400"></span>
            {/* <FiChevronLeft className="ml-3 text-slate-400" />
        <FiChevronRight className="text-slate-600" /> */}
          </div>
          <div
            className={`text-sm font-semibold ${
              inverted ? "text-slate-700" : "text-white/80"
            } px-8 py-[2px] w-full`}
          >
            {name}
          </div>
          <div className="flex items-center justify-end flex-grow flex-gap-2 basis-0 justify-self-end">
            <FiZoomOut className="text-slate-400" />
            <FiZoomIn className="text-slate-400" />
          </div>
        </header>
        <main
          className={twMerge(
            "flex-grow-0 leading-[0] [&_*[data-skeleton]]:rounded-tl-none [&_*[data-skeleton]]:rounded-tr-none",
            mainClassname
          )}
        >
          {children}
        </main>
      </div>
    );
    return draggable ? <Draggable>{renderFrame()}</Draggable> : renderFrame();
  }
);
PhotoFrame.displayName = "PhotoFrame";

export default BrowserFrame;
