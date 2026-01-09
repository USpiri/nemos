import { useParams } from "@tanstack/react-router";
import { SidebarTrigger } from "../ui/sidebar";
import { getNoteNameWithoutExtension, getNotePath } from "@/lib/notes";
import { FILE_EXTENSION } from "@/config/constants";
import { useMemo } from "react";
import { EditableFilename } from "../EditableFilename";

export const Topbar = () => {
  const { noteId, workspaceId } = useParams({
    strict: false,
  });

  const noteName = useMemo(
    () => (noteId ? getNoteNameWithoutExtension(noteId) : ""),
    [noteId],
  );

  if (!noteId || !workspaceId) return null;

  return (
    <div className="border-border flex items-center justify-between gap-2 border-b px-2.5 py-2">
      <SidebarTrigger className="size-8" />
      <EditableFilename
        display={noteName!}
        path={getNotePath(`${workspaceId}/${noteId}`)}
        suffix={FILE_EXTENSION}
        className="p-0"
        isFolder={false}
        context="topbar"
      />
    </div>
  );
};
