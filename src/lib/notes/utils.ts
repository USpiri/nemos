export const getNoteIdFromPath = (path: string) =>
  path.split("/").slice(2).join("/");

export const emptyNote = {
  content: "",
};
