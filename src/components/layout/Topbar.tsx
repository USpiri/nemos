import { useParams } from "@tanstack/react-router";
import { SidebarTrigger } from "../ui/sidebar";
import { getNoteNameWithoutExtension } from "@/lib/notes";
import { FILE_EXTENSION } from "@/config/constants";
import { useMemo } from "react";
import { EditableFilename } from "../EditableFilename";

export const Topbar = () => {
  const { noteId } = useParams({
    strict: false,
  });

  const noteName = useMemo(
    () => (noteId ? getNoteNameWithoutExtension(noteId) : ""),
    [noteId],
  );

  if (!noteId) return null;
  return (
    <div className="border-border flex items-center justify-between gap-2 border-b px-2.5 py-2">
      <SidebarTrigger className="size-8" />
      <EditableFilename
        display={noteName!}
        path={noteId}
        suffix={FILE_EXTENSION}
        className="p-0"
      />
    </div>
  );
};
