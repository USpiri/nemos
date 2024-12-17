interface Props {
  depth: number;
}

export const PlaceholderNode = ({ depth }: Props) => {
  return (
    <div
      className="absolute right-0 mx-2 h-0.5 bg-detail"
      style={{ left: depth * 15 }}
    />
  );
};
