"use client";

import { useTransition } from "react";
import { Button } from "@keynotes/ui";
import { deleteNoteAction } from "@/lib/actions";

export function DeleteNoteButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="danger"
      disabled={pending}
      onClick={() => {
        if (!window.confirm("Delete this note?")) return;
        startTransition(() => {
          void deleteNoteAction(id);
        });
      }}
    >
      {pending ? "Deleting…" : "Delete"}
    </Button>
  );
}
