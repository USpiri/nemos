import { FileIcon } from "@/components/ui/file-icon/FileIcon";
import { useActiveFile } from "@/hooks/useActiveFile";
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
      <span className="truncate">{text}</span>
    </NodeWrapper>
  );
};

interface FileNodeProps {
  text: string;
  path: string;
}

export const FileNode = ({ text, path }: FileNodeProps) => {
  const { setActiveFile } = useActiveFile();
  return (
    <NodeWrapper onClick={() => setActiveFile(path)}>
      <FileIcon fileName={text} className={iconClasses} />
      <span className="truncate">{text}</span>
    </NodeWrapper>
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
