const Caption = ({
  as = "p",
  children,
}: {
  as?: React.ElementType;
  children?: React.ReactNode;
}) => {
  const Tag = as;
  return (
    <Tag className="mt-2 text-base text-center text-tertiary lg:mt-4">
      {children}
    </Tag>
  );
};

export default Caption;
