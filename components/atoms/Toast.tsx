import { Fragment, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Portal } from 'react-portal';

interface ToastProps extends React.HTMLProps<HTMLDivElement> {
  type: "success" | "error";
  afterLeave: () => void;
}
const AUTOHIDE_TIME = 5000;

const Toast = ({ children, type, afterLeave }: ToastProps) => {
  // const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);
  // useEffect(() => {
  //   setMount(true);
  //   return () => {
  //     setMount(false);
  //   };
  // }, []);
  useEffect(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), AUTOHIDE_TIME);
  }, []);
  return (
    typeof document != 'undefined' && ReactDOM.createPortal(
    <Transition show={visible} className="fixed z-50 bottom-10 flex w-full left-0 items-center justify-center">
      <Transition.Child
        as={Fragment}
        enter="transition-all duration-200"
        enterFrom="opacity-0 translate-y-10"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-10"
        afterLeave={afterLeave}
      
      >
        <div role="alert" className={`inline-flex items-center p-4 space-x-1 text-gray-100 ${
          type == "success" ? "bg-green-700/90" : "bg-red-700/90"
        } rounded-lg shadow`}>
          {type == "success" ? (
            <FaCheckCircle className="w-5 h-5"></FaCheckCircle>
          ) : (
            <FaTimesCircle className="w-5 h-5"></FaTimesCircle>
          )}
          <div className="pl-4 text-base font-medium">{children}</div>
        </div>
      </Transition.Child>
    </Transition>, document.querySelector('#toast-root'))
  );
};

export default Toast;
