import { LucideIcon, PaintBucket, SquarePen } from "lucide-react";
import { AppearanceConfig } from "./appearance/AppearanceConfig";
import { EditorConfig } from "./editor/EditorConfig";

interface ModalConfigItem {
  name: string;
  description?: string;
  icon: LucideIcon;
  component: () => JSX.Element;
}

export const configMenu: ModalConfigItem[] = [
  {
    name: "Appearance",
    description:
      "Customize the look and feel of the application, including themes, fonts, and layout preferences.",
    icon: PaintBucket,
    component: AppearanceConfig,
  },
  {
    name: "Editor",
    description:
      "Adjust the editor's settings, such as syntax highlighting, auto-completion, and line numbering.",
    component: EditorConfig,
    icon: SquarePen,
  },
];
