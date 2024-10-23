export const Sidebar = () => {
  return (
    <div className="min-w-40 w-80 max-w-80 relative border-r border-neutral-800 print:hidden grid grid-rows-[auto_1fr_auto]">
      <div className="h-11 border-b border-neutral-800">Sidebar Title</div>
      <div>Sidebar Content</div>
      <div className="h-11 border-t border-neutral-800">Sidebar Footer</div>
    </div>
  );
};
