import { LoaderCircle, X } from "lucide-react";
import { Editor } from "../editor/Editor";
import { Button } from "../ui/button/Button";
import { useUpdate } from "@/hooks/useUpdate";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";

export const Updater = () => {
  const {
    available,
    version,
    isDownloading,
    percentage,
    onInstall,
    close,
    body,
  } = useUpdate();

  return (
    <Dialog
      open={available}
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <DialogTrigger className="sr-only" />
      <DialogContent
        className="max-w-2xl overflow-hidden outline-none"
        hideClose
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Customize your settings here.
        </DialogDescription>
        <div className="divide-y divide-border *:py-3">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-md font-mono">
              New version avaliable (v{version})
            </h2>
            <DialogClose asChild>
              <Button onClick={close} className="p-1" tabIndex={-1}>
                <X className="size-4" />
              </Button>
            </DialogClose>
          </div>
          <div className="prose-sm max-h-96 overflow-auto px-8 outline-none">
            <Editor content={body} readonly className="pt-10 outline-none" />
          </div>
          <div className="relative flex items-center justify-end">
            {isDownloading && (
              <>
                <div className="absolute bottom-0 h-1 w-full bg-background-primary-alt">
                  <div
                    className="h-1 bg-stone-200"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
                <LoaderCircle className="size-4 animate-spin text-foreground-muted" />
              </>
            )}
            <Button
              className="mx-4 bg-stone-200 px-4 text-sm text-stone-900 hover:bg-stone-100 active:text-stone-900"
              onClick={onInstall}
              tabIndex={-1}
            >
              Install and restart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
