import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supportedLanguages } from "@/config/code-languages";
import { useMemo } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const LanguageSelector = ({ value, onChange }: Props) => {
  const currentLanguage = useMemo(() => {
    return supportedLanguages.find((lang) => lang.match.includes(value));
  }, [value]);

  return (
    <Select defaultValue={value} onValueChange={(value) => onChange(value!)}>
      <SelectTrigger size="sm" tabIndex={-1} className="w-32">
        <SelectValue>{currentLanguage?.name}</SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-64 rounded-sm py-2">
        {supportedLanguages.map((lang) => (
          <SelectItem
            key={lang.id}
            value={lang.id}
            className="languages-options rounded-none"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
