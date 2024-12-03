import { Button } from "@/components/ui/button/Button";
import { useUIStore } from "@/store/ui/ui.store";
import { ChevronRight, X } from "lucide-react";

interface Props {
  settingName: string;
}

export const ConfigHeader = ({ settingName }: Props) => {
  const toggleConfig = useUIStore((store) => store.toggleConfig);

  return (
    <header className="flex items-center justify-between border-b border-border p-3 pl-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <h1 className="text-foreground-darker">Settings</h1>
        <ChevronRight className="size-4 text-foreground-darker" />
        <h2>{settingName}</h2>
      </div>
      <Button onClick={() => toggleConfig(false)}>
        <X className="size-4" />
      </Button>
    </header>
  );
};
