import { ensureRoot } from "./ensure-root";

export const initialize = async () => {
  await ensureRoot();
};
