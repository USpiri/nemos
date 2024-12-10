import { FileIcon } from "@/components/ui/file-icon/FileIcon";
import { Folder, FolderOpen } from "lucide-react";

interface FolderNodeProps {
  text: string;
  isOpen: boolean;
  onClick?: () => void;
}

const iconClasses = "h-4 w-4 shrink-0";

export const FolderNode = ({ isOpen, text, onClick }: FolderNodeProps) => {
  return (
    <NodeWrapper onClick={onClick}>
      {isOpen ? (
        <FolderOpen className={iconClasses} />
      ) : (
        <Folder className={iconClasses} />
      )}
      <FileName name={text} />
    </NodeWrapper>
  );
};

interface FileNodeProps {
  text: string;
  onClick?: () => void;
}

const splitFileName = (str: string) => [
  str.substring(0, str.lastIndexOf(".")),
  str.substring(str.lastIndexOf("."), str.length),
];

export const FileNode = ({ text, onClick }: FileNodeProps) => {
  const [fileName, extension] = splitFileName(text);
  return (
    <NodeWrapper onClick={onClick}>
      <FileIcon fileName={text} className={iconClasses} />
      <FileName name={fileName} extension={extension} />
    </NodeWrapper>
  );
};

// TODO:
// - replace color and hover color with variable colors
// - Move FileName to its own component

interface FileNameProps {
  name: string;
  extension?: string;
}

const FileName = ({ name, extension }: FileNameProps) => {
  return (
    <span className="truncate">
      {name}
      {extension && <span className="text-foreground-faint">{extension}</span>}
    </span>
  );
};

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
}

const NodeWrapper = ({ children, onClick }: Props) => {
  return (
    <div
      className="flex items-center gap-1.5 overflow-hidden px-2 py-1"
      onClick={onClick}
    >
      {children}
    </div>
  );
};
