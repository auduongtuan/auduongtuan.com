export const Grid = ({
  cols = 12,
  className = "",
  children,
  full = true,
}: {
  cols?: number;
  className?: string;
  children?: React.ReactNode;
  full?: boolean;
}) => {
  return (
    <div
      className={`content-grid-item grid grid-cols-12 gap-4 ${
        full && "full"
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const Col = ({
  span,
  spanMd,
  spanSm,
  spanLg,
  className = "",
  children,
  ...rest
}: {
  span?: string | number;
  spanSm?: string | number;
  spanMd?: string | number;
  spanLg?: string | number;
  className?: string;
  children?: React.ReactNode;
}) => {
  const getClass = (
    span: string | number | undefined,
    breakpoint: string = "lg"
  ): string => {
    const spanClass: { [key: string]: { [key: string]: string } } = {
      lg: {
        "1": "lg:col-span-1",
        "2": "lg:col-span-2",
        "3": "lg:col-span-3",
        "4": "lg:col-span-4",
        "5": "lg:col-span-5",
        "6": "lg:col-span-6",
        "7": "lg:col-span-7",
        "8": "lg:col-span-8",
        "9": "lg:col-span-9",
        "12": "lg:col-span-12",
      },
      md: {
        "1": "md:col-span-1",
        "2": "md:col-span-2",
        "3": "md:col-span-3",
        "4": "md:col-span-4",
        "5": "md:col-span-5",
        "6": "md:col-span-6",
        "7": "md:col-span-7",
        "8": "md:col-span-8",
        "9": "md:col-span-9",
        "12": "md:col-span-12",
      },
      sm: {
        "1": "col-span-1",
        "2": "col-span-2",
        "3": "col-span-3",
        "4": "col-span-4",
        "5": "col-span-5",
        "6": "col-span-6",
        "7": "col-span-7",
        "8": "col-span-8",
        "9": "col-span-9",
        "12": "col-span-12",
      },
    };
    if (span && span in spanClass[breakpoint]) {
      return spanClass[breakpoint][span];
    } else {
      if (breakpoint == "sm") return "col-span-12";
      return "";
    }
  };
  return (
    <div
      className={`${getClass(spanSm, "sm")} ${getClass(
        spanMd,
        "md"
      )} ${getClass(spanLg, "lg")} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Grid;
