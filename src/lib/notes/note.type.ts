import { NoteSchema } from "./note.schema";
import { z } from "zod";

export type Note = z.infer<typeof NoteSchema>;
