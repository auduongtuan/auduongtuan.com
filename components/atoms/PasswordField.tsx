import { cn } from "@lib/utils/cn";
import { forwardRef, useId, useRef, useState } from "react";
import { FaAsterisk } from "react-icons/fa";
import { FiAlertTriangle } from "react-icons/fi";

interface PasswordFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: boolean;
  errorMessage?: React.ReactNode;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  (
    { className, label, error, onChange, errorMessage, maxLength, ...rest },
    ref
  ) => {
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
          <label htmlFor={id} className="block password-base password-primary">
            {label}
          </label>
        )}
        <div
          className="relative group"
          {...(isFocused ? { "data-focus": true } : {})}
        >
          <div
            className={cn(
              "w-full px-3 py-2 password-base leading-tight text-primary font-mono font-medium transition-all duration-200 border-2 border-gray-300 rounded-lg outline-hidden group-data-focus:border-blue-600 group-data-focus:shadow-xs group-data-focus:shadow-blue-400/40",
              error &&
                "border-red-300 group-data-focus:border-red-600 group-data-focus:shadow-xs group-data-focus:shadow-red-400/40",
              className
            )}
          >
            <div className="relative flex items-center">
              <div
                className="absolute top-0 left-0 h-full rounded-xs bg-blue-600/20"
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
                    "text-center mr-1",
                    maxLength && i == maxLength - 1 && "mr-0"
                  )}
                  style={{ width: `${charWidth}px` }}
                >
                  {_}
                </span>
              ))}
              {isFocused && (
                <span className="relative flex items-center justify-center w-0 pointer-events-none animate-caret-blink">
                  <span
                    className={cn(
                      "h-8 bg-blue-600 w-0.5 absolute rounded-full ",
                      error && "bg-red-600"
                    )}
                  />
                </span>
              )}
              {maxLength &&
                Array.from({ length: maxLength - value.length }).map((_, i) => (
                  <span
                    key={i}
                    className="mr-1 last:mr-0 text-tertiary  text-[10px] text-center h-7 flex items-center"
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
              "absolute top-0 left-0 w-full h-full  bg-transparent focus:outline-hidden opacity-0",
              "text-transparent placeholder-transparent [&::selection]:bg-transparent"
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
          <div className="flex items-start justify-start mt-1 text-red-500 password-red-600 gap-x-2">
            <FiAlertTriangle className="mt-1" />
            <p>{errorMessage}</p>
          </div>
        )}
      </>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
