import { cn } from "@lib/utils/cn";
import { useId, useRef, useState } from "react";
import { FaAsterisk } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";

interface PasswordFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: boolean;
  errorMessage?: React.ReactNode;
}

const PasswordField = ({
  ref,
  className,
  label,
  error,
  onChange,
  errorMessage,
  maxLength,
  ...rest
}: PasswordFieldProps & {
  ref?: React.RefObject<HTMLInputElement>;
}) => {
  const id = useId();
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const gap = 6;
  const charWidth = 12;
  return (
    <>
      {label && (
        <label htmlFor={id} className="password-base password-primary block">
          {label}
        </label>
      )}
      <div
        className="group relative"
        {...(isFocused ? { "data-focus": true } : {})}
      >
        <div
          className={cn(
            "password-base text-primary group-data-focus:border-accent w-full rounded-lg border-2 border-gray-300 px-3 py-2 font-mono leading-tight font-medium outline-hidden transition-all duration-200 group-data-focus:shadow-xs group-data-focus:shadow-blue-400/40",
            error &&
              "border-red-300 group-data-focus:border-red-600 group-data-focus:shadow-xs group-data-focus:shadow-red-400/40",
            className,
          )}
        >
          <div className="relative flex items-center">
            <div
              className="bg-accent/20 absolute top-0 left-0 h-full rounded-xs"
              style={{
                marginLeft: `-${gap / 2}px`,
                width: `${
                  (selectionEnd - selectionStart) * (charWidth + gap)
                }px`,
              }}
            ></div>
            {value.split("").map((_, i, arr) => (
              <span
                key={i}
                className={cn(
                  "mr-1 text-center",
                  maxLength && i == maxLength - 1 && "mr-0",
                )}
                style={{ width: `${charWidth}px` }}
              >
                {_}
              </span>
            ))}
            {isFocused && (
              <span className="animate-caret-blink pointer-events-none relative flex w-0 items-center justify-center">
                <span
                  className={cn(
                    "bg-accent absolute h-8 w-0.5 rounded-full",
                    error && "bg-red-600",
                  )}
                />
              </span>
            )}
            {maxLength &&
              Array.from({ length: maxLength - value.length }).map((_, i) => (
                <span
                  key={i}
                  className="text-tertiary mr-1 flex h-7 items-center text-center text-[10px] last:mr-0"
                  style={{ width: `${charWidth}px` }}
                >
                  <FaAsterisk />
                </span>
              ))}
          </div>
        </div>
        <input
          id={id}
          ref={ref}
          {...rest}
          className={cn(
            "absolute top-0 left-0 h-full w-full bg-transparent opacity-0 focus:outline-hidden",
            "text-transparent placeholder-transparent [&::selection]:bg-transparent",
          )}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (onChange) onChange(e);
          }}
          onKeyUp={(e) => {
            const input = e.currentTarget;
            if (input.selectionStart !== null)
              setSelectionStart(input.selectionStart);
            if (input.selectionEnd !== null)
              setSelectionEnd(input.selectionEnd);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
        />
      </div>
      {errorMessage && (
        <div className="password-red-600 mt-1 flex items-start justify-start gap-x-2 text-red-500">
          <FiAlertTriangle className="mt-1" />
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  );
};

PasswordField.displayName = "PasswordField";

export default PasswordField;
