import { useDialogStore } from "@/store";

export const useDialog = () => {
  const dialog = useDialogStore((state) => state.dialog);
  const data = useDialogStore((state) => state.data);

  const open = useDialogStore((state) => state.open);
  const close = useDialogStore((state) => state.close);
  const isOpen = useDialogStore((state) => state.isOpen);

  return { dialog, data, open, close, isOpen };
};
