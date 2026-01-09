import { UpdaterError } from "../errors";
import { Updater } from "../updater.type";

export const close = async (updater: Updater) => {
  try {
    await updater.close();
  } catch (error) {
    throw new UpdaterError(
      "CLOSE_FAILED",
      `Failed to close updater\n` +
        `Cause: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
};
