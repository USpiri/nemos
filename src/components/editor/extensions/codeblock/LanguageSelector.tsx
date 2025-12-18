import { ScrollArea } from "@/components/ui/scroll-area";
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
  console.log(value);
  const currentLanguage = useMemo(() => {
    return supportedLanguages.find((lang) => lang.match.includes(value));
  }, [value]);

  return (
    <Select defaultValue={value} onValueChange={(value) => onChange(value!)}>
      <SelectTrigger size="sm" tabIndex={-1} className="w-32">
        <SelectValue tabIndex={-1}>{currentLanguage?.name}</SelectValue>
      </SelectTrigger>
      <SelectContent
        className="rounded-sm py-2"
        tabIndex={-1}
        alignItemWithTrigger={false}
      >
        <ScrollArea className="h-64">
          {supportedLanguages.map((lang) => (
            <SelectItem
              key={lang.id}
              value={lang.id}
              className="languages-options rounded-none"
              tabIndex={-1}
            >
              {lang.name}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};
