import { forwardRef, useId } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { twMerge } from "tailwind-merge";
interface TextFieldProps extends React.ComponentPropsWithoutRef<"input"> {
  label?: string;
  error?: boolean;
  errorMessage?: React.ReactNode;
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, label, error, errorMessage, ...rest }, ref) => {
    const id = useId();
    return (
      <>
        {label && (
          <label htmlFor={id} className="block text-base text-primary">
            {label}
          </label>
        )}
        <input
          id={id}
          className={twMerge(
            "w-full px-3 py-2 text-base leading-tight text-primary transition-all duration-200 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-600 focus:shadow-sm focus:shadow-blue-400/40",
            error &&
              "border-red-300 focus:border-red-600 focus:shadow-sm focus:shadow-red-400/40",
            className
          )}
          ref={ref}
          {...rest}
        />
        {errorMessage && (
          <div className="flex items-start justify-start mt-1 text-red-600 flex-gap-x-2">
            <FiAlertTriangle className="mt-1" />
            <p>{errorMessage}</p>
          </div>
        )}
      </>
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
