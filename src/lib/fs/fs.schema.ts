import { z } from "zod/v3";

const RESERVED_NAMES = [".", "..", "CON", "PRN", "AUX", "NUL", "COM1", "LPT1"];

export const fsNameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .regex(
    /^[a-zA-Z0-9._-]+$/,
    "Name can only contain letters, numbers, dots, hyphens, and underscores",
  )
  .refine(
    (name) => !RESERVED_NAMES.includes(name.toUpperCase()),
    "Reserved system name",
  );

export const createFolderSchema = z.object({
  name: fsNameSchema,
});
export type CreateFolderInput = z.infer<typeof createFolderSchema>;

export const createFileSchema = z.object({
  name: fsNameSchema,
});
export type CreateFileInput = z.infer<typeof createFileSchema>;
