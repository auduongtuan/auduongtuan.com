const Figure = ({
  children,
  className = "",
  caption,
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  caption?: React.ReactNode;
}) => (
  <figure className={className} {...rest}>
    <div className="rounded-xl overflow-hidden translate-z-0 leading-[0]">
      {children}
    </div>
    {caption && (
      <figcaption className="mt-2 text-base lg:mt-4">{caption}</figcaption>
    )}
  </figure>
);

export default Figure;
