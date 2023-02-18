const Tag = ({ children, inverted = false }) => {
  return (
    <span
      className={`uppercase tracking-wide text-xs md:text-xs font-medium ${
        inverted ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600/90"
      } px-2 py-1 rounded-md`}
    >
      {children}
    </span>
  );
};
export default Tag;
