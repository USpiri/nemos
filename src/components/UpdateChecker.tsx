import { useEffect } from "react";
import { useUpdate } from "@/hooks/use-update";

/**
 * Component that checks for updates on mount
 * Should be mounted once at the root of the application
 */
export const UpdateChecker = () => {
  const { check } = useUpdate();

  useEffect(() => {
    check();
  }, [check]);

  return null;
};
