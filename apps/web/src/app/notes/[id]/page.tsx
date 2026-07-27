import Link from "next/link";
import { notFound } from "next/navigation";
import { Button, PageHeader, Stack } from "@keynotes/ui";
import { DeleteNoteButton } from "@/components/delete-note-button";
import { getNote } from "@/lib/api";

type NotePageProps = {
  params: Promise<{ id: string }>;
};

function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default async function NotePage({ params }: NotePageProps) {
  const { id } = await params;

  let note;
  try {
    note = await getNote(id);
  } catch {
    notFound();
  }

  return (
    <Stack gap="lg">
      <PageHeader
        title={note.title}
        description={`Updated ${formatDate(note.updatedAt)}`}
        actions={
          <>
            <Link href={`/notes/${note.id}/edit`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <DeleteNoteButton id={note.id} />
          </>
        }
      />
      <article className="rounded-lg border border-paper-line bg-paper-elevated p-6 shadow-soft">
        <p className="whitespace-pre-wrap text-base leading-relaxed text-ink">
          {note.body || "No content"}
        </p>
      </article>
      <div>
        <Link
          href="/"
          className="text-sm font-medium text-accent hover:text-accent-hover"
        >
          ← Back to notes
        </Link>
      </div>
    </Stack>
  );
}
