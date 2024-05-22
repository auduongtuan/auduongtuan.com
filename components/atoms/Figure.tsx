import { twMerge } from "tailwind-merge";

const Figure = ({
  children,
  className = "",
  caption,
  borderRadius = true,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  caption?: React.ReactNode;
  borderRadius?: boolean;
}) => (
  <figure className={className} {...rest}>
    <div
      className={twMerge(
        borderRadius && "rounded-xl",
        "overflow-hidden translate-z-0 leading-[0]"
      )}
    >
      {children}
    </div>
    {caption && (
      <figcaption className="mt-2 text-base text-center text-tertiary lg:mt-4">
        {caption}
      </figcaption>
    )}
  </figure>
);

export default Figure;
