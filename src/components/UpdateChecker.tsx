import { useEffect } from "react";
import { useUpdate } from "@/hooks/use-update";
import { UpdateDialog } from "@/components/UpdateDialog";

/**
 * Component that checks for updates on mount and displays the update dialog
 * Should be mounted once at the root of the application
 */
export const UpdateChecker = () => {
  const { check } = useUpdate();

  useEffect(() => {
    check();
  }, [check]);

  return <UpdateDialog />;
};
