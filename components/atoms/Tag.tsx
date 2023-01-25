const Tag = ({ children, inverted = false }) => {
  return (
    <span
      className={`text-xs md:text-sm ${
        inverted ? "bg-white/20 text-white" : "bg-slate-200 text-gray-800"
      } px-2 py-1 rounded-md`}
    >
      {children}
    </span>
  );
};
export default Tag;
