import { LoaderCircle } from "lucide-react";
import { Editor } from "../editor/Editor";
import { Button } from "../ui/button/Button";
import { Dialog } from "../ui/dialog/Dialog";
import { useUpdate } from "@/hooks/useUpdate";

// TODO:
// - dynamically get this content or fetch to github

const content =
  "<h1>Nemos v1.0.0 | 03/02/2025</h1><h3>Added</h3><ul><li><p><strong>Image Plugin:</strong> Add image display with size and align attributes.</p></li><li><p><strong>New Math Plugin:</strong> More user friendly and performant plugin for math expressions.</p></li></ul><h3>Changed</h3><ul><li><p><strong>Link Popover</strong>: Link button on the Editor MenuBar now make use of LinkPopover to create or edit a link.</p></li><li><p>Disabled edit mode setting (bugged).</p></li></ul><h3>Fixed</h3><ul><li><p><strong>Max height folders and sidebar</strong>: The folders had a maximum height seted and the sidebar did not render correctly when there were more than 6 notes/folders.</p></li><li><p><strong>Callout style</strong>: Titles and inline code.</p></li></ul><h3>Performance</h3><ul><li><p>something awesome</p></li></ul><p></p>";

export const Updater = () => {
  const { available, version, isDownloading, percentage, onInstall } =
    useUpdate();

  return (
    <Dialog
      isOpen={available}
      dialogClassName="max-w-2xl max-h-fit"
      className="flex h-fit flex-col divide-y divide-border p-0 *:py-3"
    >
      <h2 className="text-md px-4 font-mono">
        New version avaliable (v{version})
      </h2>
      <div className="prose-sm max-h-96 overflow-auto px-8 outline-none">
        <Editor content={content} readonly className="outline-none" />
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
        >
          Install and restart
        </Button>
      </div>
    </Dialog>
  );
};
