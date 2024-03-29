const Note = ({ children }: { children: React.ReactNode }) => {
  return (
    <aside className="filter drop-shadow-md">
      <div
        className="overflow-hidden relative
    after:absolute after:content-['']
    after:border-t-[2rem] after:border-b-[2rem] after:border-y-blue-400 after:border-x-transparent after:border-l-[2rem] 
    after:rotate-90 after:block after:-top-4 after:-right-4 after:w-0 after:h-0"
      >
        <div
          className="clip-path-paper-fold bg-[#aad0ff] text-dark-blue-700 rounded-sm no-first-child-mt p-4 lg:p-6 text-sm body relative
    "
        >
          {children}
        </div>
      </div>
    </aside>
  );
};
export default Note;
