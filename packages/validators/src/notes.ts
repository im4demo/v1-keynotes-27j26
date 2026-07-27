import { notes } from "@keynotes/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const selectNoteSchema = createSelectSchema(notes);

export const createNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateNoteSchema = createNoteSchema.partial();

export const noteIdSchema = z.object({
  id: z.string().uuid(),
});

export type Note = z.infer<typeof selectNoteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type NoteIdInput = z.infer<typeof noteIdSchema>;
