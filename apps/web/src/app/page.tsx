import Link from "next/link";
import { Button, PageHeader, Stack } from "@keynotes/ui";
import { NoteList } from "@/components/note-list";
import { listNotes } from "@/lib/api";

export default async function HomePage() {
  const notes = await listNotes();

  return (
    <Stack gap="lg">
      <PageHeader
        title="Notes"
        description="Create, read, and edit your notes."
        actions={
          <Link href="/notes/new">
            <Button>New note</Button>
          </Link>
        }
      />
      <NoteList notes={notes} />
    </Stack>
  );
}
