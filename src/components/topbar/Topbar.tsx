import { useUIStore } from "@/store/ui/ui.store";
import { EllipsisVertical, Lock, Menu, PenLine } from "lucide-react";
import { Button } from "../ui/button/Button";
import { Filename } from "./filename/Filename";
import { useEditorStore } from "@/store/editor/editor.store";
import { readNote, write } from "@/utils/fs";
import { useParams } from "react-router";

// TODO:
// - Move readonly button

export const Topbar = () => {
  const toogleSidebar = useUIStore((store) => store.toggleSidebar);
  const readonly = useEditorStore((store) => store.readonly);
  const setReadonly = useEditorStore((store) => store.setReadOnly);
  const { "*": splat } = useParams();

  const onSetReadonly = async () => {
    if (!splat) return;
    const note = await readNote(splat);
    await write(splat, {
      ...note,
      readonly: !readonly,
    }).then(() => setReadonly(!readonly));
  };

  return (
    <div className="flex h-topbar items-center justify-between border-b border-border px-2.5 print:hidden">
      <Button onClick={() => toogleSidebar()}>
        <Menu className="h-4 w-4" />
      </Button>
      <Filename />
      <div className="flex gap-1">
        <Button onClick={onSetReadonly}>
          {readonly ? (
            <Lock className="size-4" />
          ) : (
            <PenLine className="size-4" />
          )}
        </Button>
        <Button>
          <EllipsisVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
