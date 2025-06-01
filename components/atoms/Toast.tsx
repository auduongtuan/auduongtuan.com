"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Transition } from "./Transition";

interface ToastProps extends React.HTMLProps<HTMLDivElement> {
  type: "success" | "error";
  afterLeave: (show?: boolean) => void;
  duration?: number;
}

const AUTOHIDE_TIME = 5000;
// ToastManager for handling toast notifications with observer pattern
type ToastType = "success" | "error";

type ToastOptions = {
  message: string;
  type: ToastType;
  duration?: number;
};

class ToastManager {
  private static instance: ToastManager;
  private listeners: ((options: ToastOptions) => void)[] = [];

  private constructor() {}

  public static getInstance(): ToastManager {
    if (!ToastManager.instance) {
      ToastManager.instance = new ToastManager();
    }
    return ToastManager.instance;
  }

  public subscribe(listener: (options: ToastOptions) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public add(options: ToastOptions): void {
    this.listeners.forEach((listener) => listener(options));
  }
}

const toastManager = ToastManager.getInstance();

export function toast(options: ToastOptions) {
  toastManager.add(options);
}

export const ToastList = () => {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  useEffect(() => {
    toastManager.subscribe((options) => {
      setToasts((prev) => [...prev, options]);
    });
  }, []);

  return (
    <div className="fixed bottom-10 left-0 z-50 flex w-full items-center justify-center">
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          type={toast.type}
          afterLeave={() => {
            setToasts((prev) => prev.filter((_, i) => i !== index));
          }}
        >
          {toast.message}
        </Toast>
      ))}
    </div>
  );
};

const Toast = ({ children, type, afterLeave, duration }: ToastProps) => {
  // const [mount, setMount] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, duration || AUTOHIDE_TIME);
  }, []);

  return (
    <Transition
      show={visible}
      onTransitionComplete={(show) => {
        if (show === false) {
          afterLeave?.();
        }
      }}
      className="transition-all duration-200 data-[ending]:translate-y-10 data-[ending]:opacity-0 data-[starting]:translate-y-10 data-[starting]:opacity-0"
      listenToChildAnimations
    >
      <div
        role="alert"
        className={`inline-flex items-center space-x-1 p-4 text-gray-100 ${
          type == "success" ? "bg-green-700/90" : "bg-red-700/90"
        } rounded-lg shadow`}
      >
        {type == "success" ? (
          <FaCheckCircle className="h-5 w-5"></FaCheckCircle>
        ) : (
          <FaTimesCircle className="h-5 w-5"></FaTimesCircle>
        )}
        <div className="pl-4 text-base font-medium">{children}</div>
      </div>
    </Transition>
  );
};

export default Toast;
