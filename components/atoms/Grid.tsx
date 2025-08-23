import { cn } from "@lib/utils/cn";

const GRID_COLS_CLASSES = {
  12: "grid-cols-12",
  6: "grid-cols-6",
  4: "grid-cols-4",
  2: "grid-cols-2",
  1: "grid-cols-1",
};

const GRID_GAP_CLASSES = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  12: "gap-12",
};

const GRID_JUSTIFY_CLASSES = {
  between: "justify-between",
  center: "justify-center",
};

const GRID_ALIGN_CLASSES = {
  between: "items-between",
  center: "items-center",
};

export const Grid = ({
  cols = 12,
  gap = 4,
  className = "",
  children,
  full = true,
  justify,
  align,
}: {
  cols?: number | string;
  gap?: number | string;
  className?: string;
  children?: React.ReactNode;
  full?: boolean;
  justify?: keyof typeof GRID_JUSTIFY_CLASSES;
  align?: keyof typeof GRID_ALIGN_CLASSES;
}) => {
  return (
    <div
      className={cn(
        "content-grid-item grid",
        GRID_COLS_CLASSES[cols],
        GRID_GAP_CLASSES[gap],
        full && "full",
        justify && GRID_JUSTIFY_CLASSES[justify],
        align && GRID_ALIGN_CLASSES[align],
        className,
      )}
    >
      {children}
    </div>
  );
};

const ROW_START_CLASSES: { [key: string]: { [key: string]: string } } = {
  lg: {
    "1": "lg:row-start-1",
    "2": "lg:row-start-2",
    "3": "lg:row-start-3",
    "4": "lg:row-start-4",
    "5": "lg:row-start-5",
    "6": "lg:row-start-6",
    "7": "lg:row-start-7",
    "8": "lg:row-start-8",
    "9": "lg:row-start-9",
    "12": "lg:row-start-12",
  },
  md: {
    "1": "md:row-start-1",
    "2": "md:row-start-2",
    "3": "md:row-start-3",
    "4": "md:row-start-4",
    "5": "md:row-start-5",
    "6": "md:row-start-6",
    "7": "md:row-start-7",
    "8": "md:row-start-8",
    "9": "md:row-start-9",
    "12": "md:row-start-12",
  },
  sm: {
    "1": "row-start-1",
    "2": "row-start-2",
    "3": "row-start-3",
    "4": "row-start-4",
    "5": "row-start-5",
    "6": "row-start-6",
    "7": "row-start-7",
    "8": "row-start-8",
    "9": "row-start-9",
    "12": "row-start-12",
  },
};

const COL_START_CLASSES: { [key: string]: { [key: string]: string } } = {
  lg: {
    "1": "lg:col-start-1",
    "2": "lg:col-start-2",
    "3": "lg:col-start-3",
    "4": "lg:col-start-4",
    "5": "lg:col-start-5",
    "6": "lg:col-start-6",
    "7": "lg:col-start-7",
    "8": "lg:col-start-8",
    "9": "lg:col-start-9",
    "12": "lg:col-start-12",
  },
  md: {
    "1": "md:col-start-1",
    "2": "md:col-start-2",
    "3": "md:col-start-3",
    "4": "md:col-start-4",
    "5": "md:col-start-5",
    "6": "md:col-start-6",
    "7": "md:col-start-7",
    "8": "md:col-start-8",
    "9": "md:col-start-9",
    "12": "md:col-start-12",
  },
  sm: {
    "1": "col-start-1",
    "2": "col-start-2",
    "3": "col-start-3",
    "4": "col-start-4",
    "5": "col-start-5",
    "6": "col-start-6",
    "7": "col-start-7",
    "8": "col-start-8",
    "9": "col-start-9",
    "12": "col-start-12",
  },
};

const COL_SPAN_CLASSES: { [key: string]: { [key: string]: string } } = {
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

const ROW_SPAN_CLASSES: { [key: string]: { [key: string]: string } } = {
  lg: {
    "1": "lg:row-span-1",
    "2": "lg:row-span-2",
    "3": "lg:row-span-3",
    "4": "lg:row-span-4",
    "5": "lg:row-span-5",
    "6": "lg:row-span-6",
    "7": "lg:row-span-7",
    "8": "lg:row-span-8",
    "9": "lg:row-span-9",
    "12": "lg:row-span-12",
  },
  md: {
    "1": "md:row-span-1",
    "2": "md:row-span-2",
    "3": "md:row-span-3",
    "4": "md:row-span-4",
    "5": "md:row-span-5",
    "6": "md:row-span-6",
    "7": "md:row-span-7",
    "8": "md:row-span-8",
    "9": "md:row-span-9",
    "12": "md:row-span-12",
  },
  sm: {
    "1": "row-span-1",
    "2": "row-span-2",
    "3": "row-span-3",
    "4": "row-span-4",
    "5": "row-span-5",
    "6": "row-span-6",
    "7": "row-span-7",
    "8": "row-span-8",
    "9": "row-span-9",
    "12": "row-span-12",
  },
};
const getClass = (
  classes: { [key: string]: { [key: string]: string } },
  span: string | number | undefined,
  breakpoint: string = "lg",
): string => {
  if (span && span in classes[breakpoint]) {
    return classes[breakpoint][span];
  } else {
    if (breakpoint == "sm") return "col-span-12";
    return "";
  }
};
export const Col = ({
  span,
  spanMd,
  spanSm,
  spanLg,
  rowSpan,
  rowSpanSm,
  rowSpanMd,
  rowSpanLg,
  rowStart,
  rowStartSm,
  rowStartMd,
  rowStartLg,
  colStart,
  colStartSm,
  colStartMd,
  colStartLg,
  className = "",
  children,
  ...rest
}: {
  span?: string | number;
  spanSm?: string | number;
  spanMd?: string | number;
  spanLg?: string | number;
  rowSpan?: string | number;
  rowSpanSm?: string | number;
  rowSpanMd?: string | number;
  rowSpanLg?: string | number;
  rowStart?: string | number;
  rowStartSm?: string | number;
  rowStartMd?: string | number;
  rowStartLg?: string | number;
  colStart?: string | number;
  colStartSm?: string | number;
  colStartMd?: string | number;
  colStartLg?: string | number;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        getClass(COL_SPAN_CLASSES, spanSm || span, "sm"),
        getClass(COL_SPAN_CLASSES, spanMd, "md"),
        getClass(COL_SPAN_CLASSES, spanLg, "lg"),
        getClass(ROW_SPAN_CLASSES, rowSpanSm || rowSpan, "sm"),
        getClass(ROW_SPAN_CLASSES, rowSpanMd, "md"),
        getClass(ROW_SPAN_CLASSES, rowSpanLg, "lg"),
        getClass(ROW_START_CLASSES, rowStartSm || rowStart, "sm"),
        getClass(ROW_START_CLASSES, rowStartMd, "md"),
        getClass(ROW_START_CLASSES, rowStartLg, "lg"),
        getClass(COL_START_CLASSES, colStartSm || colStart, "sm"),
        getClass(COL_START_CLASSES, colStartMd, "md"),
        getClass(COL_START_CLASSES, colStartLg, "lg"),
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Grid;
