import { Editor, Range } from "@tiptap/react";
import { LucideIcon } from "lucide-react";

export interface SuggestionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  searchTerms?: string[];
  command?: (props: { editor: Editor; range: Range }) => void;
}
