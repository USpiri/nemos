import { useUIStore } from "@/store/ui/ui.store";
import { ConfigSidebar, ConfigSidebarItem } from "./ConfigSidebar";
import { useState } from "react";
import { configMenu } from "./modal-config";
import { ConfigHeader } from "./ConfigHeader";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

export const ConfigModal = () => {
  const [activeItem, setActiveItem] = useState(configMenu[0]);
  const isOpen = useUIStore((store) => store.isConfigOpen);
  const toggleConfig = useUIStore((store) => store.toggleConfig);

  return (
    <Dialog open={isOpen} onOpenChange={(state) => toggleConfig(state)}>
      <DialogTrigger className="sr-only" />
      <DialogContent className="h-[85vh]" hideClose>
        <DialogTitle className="sr-only">App settings</DialogTitle>
        <DialogDescription className="sr-only">
          Set app settings
        </DialogDescription>
        <div className="flex">
          <ConfigSidebar>
            {configMenu.map((item) => (
              <ConfigSidebarItem
                key={item.name}
                isActive={activeItem.name === item.name}
                onClick={() => setActiveItem(item)}
              >
                <item.icon className="size-4" />
                <span>{item.name}</span>
              </ConfigSidebarItem>
            ))}
          </ConfigSidebar>
          <main className="h-full flex-1 flex-col">
            <ConfigHeader settingName={activeItem.name} />
            <div className="p-8">
              <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
                <header className="mb-5 flex flex-col gap-4">
                  <h2 className="text-3xl font-semibold">{activeItem.name}</h2>
                  {activeItem.description && <p>{activeItem.description}</p>}
                </header>
                <activeItem.component />
              </div>
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
};
