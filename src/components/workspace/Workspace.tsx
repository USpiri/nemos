import { useEffect, useState } from "react";
import { Editor } from "../editor/Editor";
import { useActiveFile } from "@/hooks/useActiveFile";
import { write } from "@/utils/fs";

export const Workspace = () => {
  const { loadActiveFile, content, path } = useActiveFile();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveFile().then(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div className="editor-wrapper mx-auto h-full w-full max-w-2xl *:h-full">
      <Editor
        className="pb-[30vh]"
        content={content}
        onChange={async (editor) => {
          if (!path) return;
          await write(path, {
            content: editor.getHTML(),
          });
        }}
      />
    </div>
  );
};
