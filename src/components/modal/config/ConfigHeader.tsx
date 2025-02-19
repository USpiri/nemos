import { Button } from "@/components/ui/button/Button";
import { DialogClose } from "@/components/ui/dialog";
import { ChevronRight, X } from "lucide-react";

interface Props {
  settingName: string;
}

export const ConfigHeader = ({ settingName }: Props) => {
  return (
    <header className="flex items-center justify-between border-b border-border p-3 pl-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <h1 className="text-foreground-muted">Settings</h1>
        <ChevronRight className="size-4 text-foreground-muted" />
        <h2>{settingName}</h2>
      </div>
      <DialogClose asChild>
        <Button>
          <X className="size-4" />
        </Button>
      </DialogClose>
    </header>
  );
};
