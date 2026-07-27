import { PageHeader, Stack } from "@keynotes/ui";
import { NoteForm } from "@/components/note-form";
import { createNoteAction } from "@/lib/actions";

export default function NewNotePage() {
  return (
    <Stack gap="lg">
      <PageHeader
        title="New note"
        description="Add a title and body, then save."
      />
      <NoteForm
        action={createNoteAction}
        submitLabel="Create note"
        cancelHref="/"
      />
    </Stack>
  );
}
