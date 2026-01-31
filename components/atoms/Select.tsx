import { Select as BaseSelect } from "@base-ui/react";
import { useControlledState } from "@hooks/useControlledState";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { cn } from "@lib/utils/cn";
import Checkbox from "./Checkbox";
import { ReactNode, useState } from "react";

interface SelectOption<TActualType> {
  value: TActualType;
  name: string;
  icon?: ReactNode;
}

interface SelectProps<TType, TActualType> {
  options: SelectOption<TActualType>[];
  label?: ReactNode;
  placeholder?: string;
  value?: TType;
  defaultValue?: TType;
  onChange?: (value: TType) => void;
  multiple?: boolean;
  renderValue?: (value: TType | undefined) => ReactNode;
  buttonClassName?: string;
  disabled?: boolean;
  align?: "start" | "center" | "end";
}

const Select = <TType, TActualType>({
  options,
  label,
  value,
  defaultValue,
  onChange,
  placeholder = "Select an option",
  multiple,
  renderValue,
  buttonClassName,
  disabled,
  align = "start",
  ...rest
}: SelectProps<TType, TActualType>) => {
  const [selected, setSelected] = useControlledState(
    value,
    defaultValue,
    onChange,
  );

  const selectedOption = !multiple
    ? options.find(
        (option) =>
          option.value === (selected as unknown as TActualType | undefined),
      )
    : undefined;

  const renderValueFn = () => {
    if (multiple) {
      if (renderValue) return renderValue(selected);
      if (typeof selected === "undefined") return "All";
      if (Array.isArray(selected)) {
        if (selected.length === 0) {
          return "All";
        } else {
          return selected.length + " selected";
        }
      }
    }
    if (selectedOption) {
      if (renderValue)
        return renderValue(selectedOption.value as unknown as TType);
      return selectedOption.name;
    }
    return placeholder;
  };

  const handleValueChange = (newValue: any) => {
    setSelected(newValue as TType);
  };

  return (
    <div className="flex items-center">
      {label && <div className="muted-text mr-3 shrink-0">{label}</div>}
      <div className="grow">
        <BaseSelect.Root
          defaultValue={defaultValue as any}
          value={selected as any}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <BaseSelect.Trigger
            className={cn(
              "border-control bg-background ring-offset-background placeholder:text-muted focus:ring-ring flex w-full items-center justify-between rounded-lg border px-3 py-1.5 text-base focus:ring-offset-2 focus:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
              buttonClassName,
              "data-disabled:cursor-not-allowed data-disabled:opacity-50",
            )}
          >
            <div className="flex items-center">
              {selectedOption?.icon && (
                <span className="mr-2">{selectedOption.icon}</span>
              )}
              <BaseSelect.Value className={"cursor-default"}>
                {(label) => renderValueFn()}
              </BaseSelect.Value>
            </div>
            <BaseSelect.Icon>
              <FiChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </BaseSelect.Icon>
          </BaseSelect.Trigger>

          <BaseSelect.Portal>
            <BaseSelect.Positioner
              sideOffset={4}
              align={align}
              alignItemWithTrigger={false}
            >
              <BaseSelect.Popup className="border-control bg-surface text-primary z-[var(--stack-popup)] grid grid-cols-1 gap-0.5 rounded-md border p-1 shadow-lg focus:outline-hidden data-closed:hidden data-ending-style:opacity-0 data-starting-style:opacity-0">
                {options.map((option, i) => (
                  <BaseSelect.Item
                    key={
                      typeof option.value === "string"
                        ? option.value
                        : `option-${i}`
                    }
                    value={option.value}
                    label={option.name}
                    className={cn(
                      "flex w-full cursor-default items-center rounded-md py-1.5 pr-2 pl-2 text-base outline-hidden select-none",
                      "data-disabled:pointer-events-none data-disabled:opacity-50",
                      multiple
                        ? "data-selected:hover:bg-accent-subtlest data-highlighted:bg-accent-subtlest data-selected:bg-transparent"
                        : "data-selected:bg-accent data-selected:text-oncolor data-highlighted:bg-subtle",
                    )}
                  >
                    {multiple && (
                      <Checkbox
                        checked={
                          Array.isArray(selected) &&
                          selected?.includes(option.value)
                        }
                        className="pointer-events-none mr-2"
                        readOnly
                      />
                    )}
                    <BaseSelect.ItemText className="flex grow items-center">
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      <span>{option.name}</span>
                    </BaseSelect.ItemText>
                    {!multiple && (
                      <BaseSelect.ItemIndicator>
                        <FiCheck
                          className={cn(
                            "ml-1 shrink-0 opacity-0 data-selected:opacity-100",
                            multiple && "text-accent",
                          )}
                        />
                      </BaseSelect.ItemIndicator>
                    )}
                  </BaseSelect.Item>
                ))}
              </BaseSelect.Popup>
            </BaseSelect.Positioner>
          </BaseSelect.Portal>
        </BaseSelect.Root>
      </div>
    </div>
  );
};

export default Select;
