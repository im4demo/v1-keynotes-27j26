import { notFound } from "next/navigation";
import { PageHeader, Stack } from "@keynotes/ui";
import { NoteForm } from "@/components/note-form";
import { updateNoteAction } from "@/lib/actions";
import { getNote } from "@/lib/api";

type EditNotePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditNotePage({ params }: EditNotePageProps) {
  const { id } = await params;

  let note;
  try {
    note = await getNote(id);
  } catch {
    notFound();
  }

  const action = updateNoteAction.bind(null, note.id);

  return (
    <Stack gap="lg">
      <PageHeader title="Edit note" description="Update the title or body." />
      <NoteForm
        action={action}
        defaultTitle={note.title}
        defaultBody={note.body}
        submitLabel="Save changes"
        cancelHref={`/notes/${note.id}`}
      />
    </Stack>
  );
}
