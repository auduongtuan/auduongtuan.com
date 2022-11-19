import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { Transition } from "@headlessui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface ToastProps extends React.HTMLProps<HTMLDivElement> {
  type: "success" | "error";
}
const AUTOHIDE_TIME = 4000;

const Toast = ({ children, type }: ToastProps) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
    setTimeout(() => setVisible(false), AUTOHIDE_TIME);
  }, []);
  return (
    <Transition
      show={visible}
      enter="transition-all duration-200"
      enterFrom="opacity-0 translate-y-10"
      enterTo="opacity-100 translate-y-0"
      leave="transition-all duration-200"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-10"
      className={`inline-flex items-center p-4 space-x-1 text-gray-100 ${
        type == "success" ? "bg-green-700/90" : "bg-red-700/90"
      } rounded-lg shadow`}
      role="alert"
    >
      {type == "success" ? (
        <FaCheckCircle className="w-5 h-5"></FaCheckCircle>
      ) : (
        <FaTimesCircle className="w-5 h-5"></FaTimesCircle>
      )}
      <div className="pl-4 text-base font-medium">{children}</div>
    </Transition>
  );
};
export const ToastContainer = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
     setMounted(true)

     return () => setMounted(false)
  }, []);
  return (
    mounted ? ReactDOM.createPortal(
    <div className="fixed z-60 bottom-10 flex w-full left-0 items-center justify-center">
      {children}
    </div>, document.querySelector('#toast-root')) : null
  );
};
export default Toast;
