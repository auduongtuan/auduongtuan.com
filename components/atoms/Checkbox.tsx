import { Fragment } from "react";
import {
  Field,
  Label,
  Checkbox as HCheckbox,
  CheckboxProps as HCheckboxProps,
} from "@headlessui/react";
import { FiCheck } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export interface CheckboxProps extends HCheckboxProps {
  label?: React.ReactNode;
}

const Checkbox = ({ checked, onChange, label, ...rest }: CheckboxProps) => {
  // const [enabled, setEnabled] = useState(false)

  return (
    <Field className="flex items-center flex-gap-2">
      <HCheckbox checked={checked} onChange={onChange} {...rest}>
        {({ checked }) => (
          /* Use the `checked` state to conditionally style the button. */
          <button
            className={twMerge(
              checked
                ? "bg-accent focus:ring-[3px] focus:ring-blue-600/20"
                : "bg-surface border border-control focus:ring-2 focus:ring-accent",
              "relative flex h-4 w-4 items-center justify-center rounded-sm focus:shadow-sm focus:shadow-blue-400/40 outline-none bg-clip-padding"
            )}
          >
            {checked && <FiCheck className="w-3 h-3 text-white" />}
          </button>
        )}
      </HCheckbox>
      {label && (
        <Label className="text-base cursor-pointer text-primary">{label}</Label>
      )}
    </Field>
  );
};

export default Checkbox;
