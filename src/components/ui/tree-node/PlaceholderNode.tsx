interface Props {
  depth: number;
}

export const PlaceholderNode = ({ depth }: Props) => {
  return (
    <div
      className="bg-accent absolute right-0 mx-2 h-0.5"
      style={{ left: depth * 15 }}
    />
  );
};
