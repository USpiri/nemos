import { Dialog } from "@/components/ui/dialog/Dialog";
import { useUIStore } from "@/store/ui/ui.store";

export const ConfigModal = () => {
  const isOpen = useUIStore((store) => store.isConfigOpen);
  const toggleConfig = useUIStore((store) => store.toggleConfig);

  return (
    <Dialog isOpen={isOpen} onClose={() => toggleConfig(false)}>
      ConfigModal
    </Dialog>
  );
};
