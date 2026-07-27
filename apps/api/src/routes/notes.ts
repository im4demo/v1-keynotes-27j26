import { notes } from "@keynotes/db";
import {
  createNoteSchema,
  noteIdSchema,
  updateNoteSchema,
} from "@keynotes/validators";
import { desc, eq } from "drizzle-orm";
import { Router } from "express";
import { db } from "../db.js";

export const notesRouter: Router = Router();

notesRouter.get("/", async (_req, res, next) => {
  try {
    const rows = await db.select().from(notes).orderBy(desc(notes.updatedAt));
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createNoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid request body", details: parsed.error.flatten() });
      return;
    }

    const [created] = await db.insert(notes).values(parsed.data).returning();
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
});

notesRouter.get("/:id", async (req, res, next) => {
  try {
    const parsed = noteIdSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid note id", details: parsed.error.flatten() });
      return;
    }

    const [note] = await db
      .select()
      .from(notes)
      .where(eq(notes.id, parsed.data.id))
      .limit(1);

    if (!note) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

notesRouter.patch("/:id", async (req, res, next) => {
  try {
    const idParsed = noteIdSchema.safeParse(req.params);
    if (!idParsed.success) {
      res.status(400).json({ error: "Invalid note id", details: idParsed.error.flatten() });
      return;
    }

    const bodyParsed = updateNoteSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      res.status(400).json({ error: "Invalid request body", details: bodyParsed.error.flatten() });
      return;
    }

    if (Object.keys(bodyParsed.data).length === 0) {
      res.status(400).json({ error: "Request body must include at least one field" });
      return;
    }

    const [updated] = await db
      .update(notes)
      .set({ ...bodyParsed.data, updatedAt: new Date() })
      .where(eq(notes.id, idParsed.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

notesRouter.delete("/:id", async (req, res, next) => {
  try {
    const parsed = noteIdSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid note id", details: parsed.error.flatten() });
      return;
    }

    const [deleted] = await db
      .delete(notes)
      .where(eq(notes.id, parsed.data.id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Note not found" });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
