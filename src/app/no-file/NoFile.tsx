import { Button } from "@/components/ui/button/Button";
import { useFiles } from "@/hooks/useFiles";
import { useUIStore } from "@/store/ui/ui.store";

export const NoFile = () => {
  const toggleSidebar = useUIStore((store) => store.toggleSidebar);
  const { createNote } = useFiles();

  const onNavigate = () => {
    toggleSidebar(true);
  };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-8 pt-32">
      <h1 className="text-4xl font-semibold">There is something missing!</h1>
      <p className="text-foreground-darker">
        Navigate to an existing file or create a new one!
      </p>
      <hr className="border-foreground-faint" />
      <div className="flex gap-2 *:text-foreground">
        <Button className="px-4" onClick={onNavigate}>
          Navigate
        </Button>
        <Button className="px-4" onClick={() => createNote()}>
          Create new Note
        </Button>
      </div>
    </div>
  );
};
