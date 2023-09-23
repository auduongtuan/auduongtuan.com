import { Fragment, useEffect } from "react";
import { Dialog as HDialog, Transition } from "@headlessui/react";
import useAppStore from "@store/useAppStore";
function Dialog({ children, open, onClose, title, ...rest }) {
  const { setPauseScrollEvent } = useAppStore();
  useEffect(() => {
    if (open) setPauseScrollEvent(true);
    return () => {
      setPauseScrollEvent(false);
    };
  }, [open, setPauseScrollEvent]);
  return (
    <Transition show={open} as={Fragment}>
      <HDialog onClose={onClose} className="relative z-[45]" {...rest}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </Transition.Child>
        {/* Full-screen container to center the panel */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center p-4">
            {/* The actual HDialog panel  */}
            <HDialog.Panel
              className={`w-full max-w-md flex flex-col border-solid border border-black/20 rounded-xl overflow-hidden translate-z-0 shadow-lg`}
            >
              <HDialog.Title
                as="header"
                className={` flex items-center justify-between bg-slate-100
          px-3 py-1.5 rounded-t-[11px] z-[1] shadow-[0_0_0_1px_rgba(0,0,0,0.06)] relative`}
              >
                <div className="absolute flex items-center flex-grow flex-gap-2 basis-0">
                  <button
                    aria-label="Close it"
                    className="block w-2 h-2 rounded cursor-pointer bg-slate-400 hover:bg-red-500 active:bg-red-700"
                    onClick={onClose}
                  ></button>
                  {/* <span className="block w-2 h-2 rounded bg-slate-400"></span>
                <span className="block w-2 h-2 rounded bg-slate-400"></span> */}
                  {/* <FiChevronLeft className="ml-3 text-slate-400" />
            <FiChevronRight className="text-slate-600" /> */}
                </div>
                <div
                  className={`text-sm font-semibold 
                 text-slate-700 text-center
                 px-8 py-[2px] w-full`}
                >
                  {title}
                </div>
                {/* <div className="flex items-center justify-end flex-grow gap-2 basis-0 justify-self-end"> */}
                {/* <FiZoomOut className="text-slate-400" />
                <FiZoomIn className="text-slate-400" /> */}
                {/* </div> */}
              </HDialog.Title>

              <main className="flex-grow-0 bg-white">{children}</main>
            </HDialog.Panel>
          </div>
        </Transition.Child>
      </HDialog>
    </Transition>
  );
}
export default Dialog;
