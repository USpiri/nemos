import { icons } from "@/config/icons";

export const getIcon = (extension: string) => icons[extension] || File;
