import { useEffect, useState } from "react";

interface Props {
  value: string;
  isEditing: boolean;
  onChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onDoubleClick?: () => void;
}

export const EditableLabel = ({
  value,
  isEditing,
  onChange,
  onBlur,
}: Props) => {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  return (
    <>
      {isEditing ? (
        <input
          type="text"
          value={text}
          autoFocus
          size={text.length}
          className="inline-flex bg-transparent text-center outline-none"
          onChange={(event) => {
            setText(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.stopPropagation();
              event.preventDefault();
              if (text.trim().length) onChange?.(text);
              else setText(value);
            } else if (event.key === "Escape") setText(value);
          }}
          onBlur={() => {
            if (text.trim().length) onBlur?.(text);
            else setText(value);
          }}
        />
      ) : (
        <span>{text}</span>
      )}
    </>
  );
};
