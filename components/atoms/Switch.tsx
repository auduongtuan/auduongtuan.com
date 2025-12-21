import { useState, Fragment } from "react";
import { Switch as BaseSwitch } from "@base-ui/react";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: React.ReactNode;
}

const Switch = ({ checked, onChange, label }: SwitchProps) => {
  // const [enabled, setEnabled] = useState(false)

  return (
    <label>
      <div className="flex items-center gap-2">
        <BaseSwitch.Root
          checked={checked}
          onCheckedChange={onChange}
          className={`${
            checked
              ? "bg-accent focus:ring-accent/20 focus:ring-[3px]"
              : "focus:ring-accent bg-slate-300 focus:ring-2"
          } relative inline-flex h-6 w-11 items-center rounded-full border-transparent bg-clip-padding outline-hidden focus:shadow-xs focus:shadow-blue-400/40`}
        >
          <span className="sr-only">{label}</span>
          <BaseSwitch.Thumb
            className={`${
              checked ? "translate-x-6" : "translate-x-1"
            } bg-surface inline-block h-4 w-4 transform rounded-full transition`}
          />
        </BaseSwitch.Root>
        <span className="text-primary cursor-pointer text-base">{label}</span>
      </div>
    </label>
  );
};

export default Switch;
