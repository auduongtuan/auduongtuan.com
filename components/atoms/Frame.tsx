import React, {MouseEventHandler, useImperativeHandle, useRef} from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
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

const BrowserFrame = React.forwardRef<
  HTMLDivElement,
  { url?: string; inverted?: boolean } & React.HTMLProps<HTMLDivElement>
>(({ children, url, inverted = false, className = "", ...rest }, ref) => {
  return (
    <div
      className={`w-full flex flex-col border-solid border border-black/20 rounded-xl overflow-hidden translate-z-0 shadow-lg ${className}`}
      {...rest}
    >
      <header
        className={`flex items-center justify-between ${
          inverted ? "bg-slate-100" : "bg-slate-800"
        } px-3 py-1.5 rounded-t-[11px] z-[1] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]`}
      >
        <div className="flex flex-gap-2 flex-grow basis-0 items-center">
          <span className="w-2 h-2 bg-slate-400 rounded block"></span>
          <span className="w-2 h-2 bg-slate-400 rounded block"></span>
          <span className="w-2 h-2 bg-slate-400 rounded block"></span>
          <FiChevronLeft className="hidden md:inline-block ml-3 text-slate-400" />
          <FiChevronRight className="hidden md:inline-block text-slate-600" />
        </div>
        <div className="bg-white/20 text-xs text-white/80 text-center min-h-[20px] px-4 py-[2px] rounded-md inline-block justify-self-center w-[60%] md:w-1/2">
          {url && (
            <a href={url} target="_blank" rel="noreferrer">
              {url.replace(/(^\w+:|^)\/\//, "")}
            </a>
          )}
        </div>
        <div className="flex-grow flex-gap-2 basis-0 justify-self-end flex items-center justify-end">
          <FiGrid className="hidden md:inline-block text-slate-400" />
          <FiPlus className="hidden md:inline-block text-slate-400" />
        </div>
      </header>
      <main className="flex-grow-0 leading-[0]">{children}</main>
    </div>
  );
});
BrowserFrame.displayName = "BrowserFrame";

export interface PhotoFrameProps extends React.HTMLProps<HTMLDivElement> {
  name?: string;
  inverted?: boolean;
  buttonCallbacks?: {
    [key: string]: MouseEventHandler;
  };
}
export const PhotoFrame = React.forwardRef<HTMLDivElement, PhotoFrameProps>(
  (
    {
      children,
      inverted = false,
      name,
      className = "",
      buttonCallbacks,
      ...rest
    },
    ref
  ) => {
    const innerRef = useRef<HTMLDivElement>(null  );
    useImperativeHandle(ref, () => innerRef.current as HTMLDivElement);
    const closeCallback = buttonCallbacks?.close ? buttonCallbacks?.close : (e) => {
      if(innerRef?.current) {
        innerRef?.current.classList.add('opacity-0');
        innerRef?.current.classList.add('invisible');
      }
    };
    const bp = useBreakpoint();
    const renderFrame = () => (
      <div
        ref={innerRef}
        className={`w-full flex flex-col border-solid border border-black/20 rounded-xl overflow-hidden translate-z-0 shadow-lg ${className}`}
        {...rest}
      >
        <header
          className={`md:cursor-move flex items-center justify-between ${
            inverted ? "bg-slate-100" : "bg-slate-800"
          } px-3 py-1.5 rounded-t-[11px] z-[1] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]`}
        >
          <div className="flex flex-gap-2 flex-grow basis-0 items-center">
            <Tooltip content="Hide my face 😢"><button aria-label="Close it"
              className="w-2 h-2 bg-slate-400 rounded block cursor-pointer hover:bg-red-500 active:bg-red-700"
              onClick={closeCallback}
            ></button></Tooltip>
            <span className="w-2 h-2 bg-slate-400 rounded block"></span>
            <span className="w-2 h-2 bg-slate-400 rounded block"></span>
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
          <div className="flex-grow flex-gap-2 basis-0 justify-self-end flex items-center justify-end">
            <FiZoomOut className="text-slate-400" />
            <FiZoomIn className="text-slate-400" />
          </div>
        </header>
        <main className="flex-grow-0 leading-[0]">{children}</main>
      </div>
    );
    return (
      (bp == 'lg') ? <Draggable>{renderFrame()}</Draggable> : renderFrame()
    );
  }
);
PhotoFrame.displayName = "PhotoFrame";

export default BrowserFrame;
