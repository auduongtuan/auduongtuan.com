import { useState, Fragment } from "react";
import { Switch as HSwitch } from "@headlessui/react";

const Switch = ({ checked, onChange, label }) => {
  // const [enabled, setEnabled] = useState(false)

  return (
    <HSwitch.Group>
      <div className="flex items-center gap-2">
        <HSwitch checked={checked} onChange={onChange} as={Fragment}>
          {({ checked }) => (
            /* Use the `checked` state to conditionally style the button. */
            <button
              className={`${
                checked
                  ? "bg-blue-600 focus:ring-[3px] focus:ring-blue-600/20"
                  : "bg-slate-300 focus:ring-2 focus:ring-blue-600"
              } relative inline-flex h-6 w-11 items-center rounded-full border-transparent focus:shadow-xs focus:shadow-blue-400/40 outline-hidden bg-clip-padding`}
            >
              <span className="sr-only">{label}</span>
              <span
                className={`${
                  checked ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-surface transition`}
              />
            </button>
          )}
        </HSwitch>
        <HSwitch.Label className="text-primary text-base cursor-pointer">
          {label}
        </HSwitch.Label>
      </div>
    </HSwitch.Group>
  );
};
export default Switch;
