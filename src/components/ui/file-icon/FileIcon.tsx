import { getExtension } from "@/utils/fs";
import { getIcon } from "@/utils/icons";

export const FileIcon = ({
  fileName,
  className,
}: {
  fileName: string;
  className?: string;
}) => {
  const Icon = getIcon(getExtension(fileName));
  return <Icon className={className} />;
};
