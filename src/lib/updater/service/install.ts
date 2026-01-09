import { UpdaterError } from "../errors";
import { Updater } from "../updater.type";

export const install = async (updater: Updater) => {
  try {
    await updater.install();
  } catch (error) {
    throw new UpdaterError(
      "INSTALL_FAILED",
      `Failed to install update\n` +
        `Cause: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
