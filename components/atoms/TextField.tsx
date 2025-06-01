import { useId } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { cn } from "@lib/utils/cn";
interface TextFieldProps extends React.ComponentPropsWithRef<"input"> {
  label?: string;
  error?: boolean;
  errorMessage?: React.ReactNode;
}

const TextField = ({
  ref,
  className,
  label,
  error,
  errorMessage,
  ...rest
}: TextFieldProps) => {
  const id = useId();
  return (
    <>
      {label && (
        <label htmlFor={id} className="text-primary block text-base">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "text-primary focus:border-accent w-full rounded-lg border-2 border-gray-300 px-3 py-2 text-base leading-tight outline-hidden transition-all duration-200 focus:shadow-xs focus:shadow-blue-400/40",
          error &&
            "border-red-300 focus:border-red-600 focus:shadow-xs focus:shadow-red-400/40",
          className,
        )}
        ref={ref}
        {...rest}
      />
      {errorMessage && (
        <div className="mt-1 flex items-start justify-start gap-x-2 text-red-600">
          <FiAlertTriangle className="mt-1" />
          <p>{errorMessage}</p>
        </div>
      )}
    </>
  );
};

TextField.displayName = "TextField";

export default TextField;
