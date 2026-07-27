"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createNote, deleteNote, updateNote } from "@/lib/api";

function readNoteFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  if (!title) {
    throw new Error("Title is required");
  }

  return { title, body };
}

export async function createNoteAction(formData: FormData) {
  const note = await createNote(readNoteFields(formData));
  revalidatePath("/");
  redirect(`/notes/${note.id}`);
}

export async function updateNoteAction(id: string, formData: FormData) {
  await updateNote(id, readNoteFields(formData));
  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect(`/notes/${id}`);
}

export async function deleteNoteAction(id: string) {
  await deleteNote(id);
  revalidatePath("/");
  redirect("/");
}
