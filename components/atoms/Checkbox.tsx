import { Checkbox as BaseCheckbox } from "@base-ui-components/react";
import { FiCheck } from "react-icons/fi";
import { cn } from "@lib/utils/cn";

export interface CheckboxProps
  extends Omit<BaseCheckbox.Root.Props, "onCheckedChange"> {
  label?: React.ReactNode;
  onChange?: BaseCheckbox.Root.Props["onCheckedChange"];
}

const Checkbox = ({
  checked,
  onChange,
  label,
  className,
  ...rest
}: CheckboxProps) => {
  // const [enabled, setEnabled] = useState(false)

  return (
    <label className="flex items-center gap-2">
      <BaseCheckbox.Root
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          "bg-surface border-control focus:ring-accent border focus:ring-2",
          "relative flex h-4 w-4 items-center justify-center rounded-xs bg-clip-padding outline-hidden focus:shadow-xs focus:shadow-blue-400/40",
          "data-checked:bg-accent data-checked:focus:ring-accent/20 data-checked:focus:ring-[3px]",
          className,
        )}
        {...rest}
      >
        <BaseCheckbox.Indicator
          className={"transition-opacity duration-200 data-checked:opacity-0"}
        >
          <FiCheck className="h-3 w-3 text-white" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label && (
        <span className="text-primary cursor-pointer text-base">{label}</span>
      )}
    </label>
  );
};

export default Checkbox;
