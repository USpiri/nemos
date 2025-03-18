import cn from "@/utils/cn";
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
    <span className="relative">
      <span className={cn(isEditing && "invisible")}>{text}</span>
      {isEditing && (
        <input
          type="text"
          value={text}
          autoFocus
          size={text.length || 1}
          className="absolute right-0 top-0 inline-flex bg-transparent text-right outline-hidden"
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
      )}
    </span>
  );
};
