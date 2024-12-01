import { useEffect, useState } from "react";
import { readNote, write } from "@/utils/fs";
import { useNavigate, useParams } from "react-router";
import { Editor } from "@/components/editor/Editor";

export const Workspace = () => {
  const { "*": splat } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    readNote(splat!)
      .then((note) => {
        setContent(note.content);
        setLoading(false);
      })
      .catch(() => navigate("/no-file"));
  }, [navigate, splat]);

  if (!splat) navigate("/no-file");
  if (loading) return null;

  return (
    <div className="flex-1 overflow-auto px-8 pt-32">
      <div className="editor-wrapper mx-auto h-full w-full max-w-2xl *:h-full">
        <Editor
          className="pb-[40vh]"
          content={content}
          onChange={async (editor) => {
            await write(splat!, {
              content: editor.getHTML(),
            });
          }}
        />
      </div>
    </div>
  );
};
