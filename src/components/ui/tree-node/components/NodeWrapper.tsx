interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

export const NodeWrapper = ({ children, onClick }: Props) => {
  return (
    <div
      className="flex items-center gap-1.5 overflow-hidden px-2 py-1"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
