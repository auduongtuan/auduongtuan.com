import {
  Listbox,
  ListboxProps,
  ListboxButton,
  Label,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { useControlledState } from "@hooks/useControlledState";
import ReactDOM from "react-dom";
import { FiCheck, FiChevronDown } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
import Checkbox from "./Checkbox";

interface SelectOption<TActualType> {
  value: TActualType;
  name: string;
  icon?: React.ReactNode;
}

interface SelectProps<TType, TActualType>
  extends ListboxProps<"div", TType, TActualType> {
  options: SelectOption<TActualType>[];
  label?: React.ReactNode;
  placeholder?: string;
  renderValue?: (value: TType | undefined) => React.ReactNode;
  buttonClassName?: string;
}

const isBrowser = typeof window !== "undefined";

const Select = <TType, TActualType>({
  options,
  label,
  value,
  defaultValue,
  onChange,
  placeholder,
  multiple,
  renderValue,
  buttonClassName,
  ...rest
}: SelectProps<TType, TActualType>) => {
  const [selected, setSelected] = useControlledState(
    value,
    defaultValue,
    onChange
  );
  const selectedOption = !multiple
    ? options.find(
        (option) =>
          option.value === (selected as unknown as TActualType | undefined)
      )
    : undefined;

  const renderValueFn = () => {
    if (multiple) {
      if (renderValue) return renderValue(selected);
      if (typeof selected == "undefined") return "All";
      if (Array.isArray(selected)) {
        if (selected.length == 0) {
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

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
      multiple={multiple}
      {...rest}
    >
      <div className="flex items-center">
        {label && <Label className={"shrink-0 mr-3 muted-text"}>{label}</Label>}
        <ListboxButton
          className={twMerge(
            "flex w-full items-center justify-between rounded-lg border border-control bg-background px-3 py-1.5 text-base ring-offset-background placeholder:text-muted focus:outline-hidden focus-visible:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            buttonClassName
          )}
        >
          {selectedOption?.icon && (
            <span className="mr-2">{selectedOption.icon}</span>
          )}
          <span className="truncate">{renderValueFn()}</span>
          <FiChevronDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </ListboxButton>
        {isBrowser
          ? ReactDOM.createPortal(
              <ListboxOptions
                className={twMerge(
                  "[--anchor-gap:4px] rounded-md border border-control bg-surface text-primary shadow-lg p-1 focus:outline-hidden grid grid-cols-1 gap-0.5 z-(--stack-popup)"
                )}
                anchor="bottom start"
              >
                {options.map((option, i) => (
                  <ListboxOption
                    key={
                      typeof option.value == "string"
                        ? option.value
                        : `option-${i}`
                    }
                    value={option.value}
                    className={twMerge(
                      "flex w-full cursor-default select-none items-center rounded-md py-1.5 pl-2 pr-2 text-base outline-hidden",
                      " data-disabled:pointer-events-none data-disabled:opacity-50",
                      multiple
                        ? "data-selected:bg-transparent data-selected:hover:bg-accent-subtlest data-active:bg-accent-subtlest"
                        : "data-selected:bg-accent data-selected:text-oncolor data-active:[&:not([data-selected])]:bg-subtle"
                    )}
                  >
                    {multiple && (
                      <Checkbox
                        checked={
                          Array.isArray(selected) &&
                          selected?.includes(option.value)
                        }
                        className={`pointer-events-none mr-2`}
                      />
                    )}
                    <div className="flex items-center grow">
                      {option.icon && (
                        <span className="mr-2">{option.icon}</span>
                      )}
                      <span>{option.name}</span>
                    </div>
                    {!multiple && (
                      <FiCheck
                        className={twMerge(
                          "ml-1 opacity-0 data-selected:opacity-100 shrink-0",
                          multiple && "text-accent"
                        )}
                      />
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>,
              document.querySelector("body") as HTMLElement
            )
          : null}
      </div>
    </Listbox>
  );
};

export default Select;
