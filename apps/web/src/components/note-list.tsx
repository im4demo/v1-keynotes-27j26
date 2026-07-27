import Link from "next/link";
import type { Note } from "@keynotes/validators";

function formatDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function NoteList({ notes }: { notes: Note[] }) {
  if (notes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-paper-line bg-paper-elevated/70 px-6 py-12 text-center">
        <p className="font-display text-xl text-ink">No notes yet</p>
        <p className="mt-2 text-sm text-ink-muted">
          Create your first note to get started.
        </p>
        <Link
          href="/notes/new"
          className="mt-6 inline-flex text-sm font-medium text-accent hover:text-accent-hover"
        >
          New note
        </Link>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-paper-line overflow-hidden rounded-lg border border-paper-line bg-paper-elevated shadow-soft">
      {notes.map((note) => (
        <li key={note.id}>
          <Link
            href={`/notes/${note.id}`}
            className="block px-5 py-4 transition-colors hover:bg-accent-soft/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-medium text-ink">
                  {note.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-ink-muted">
                  {note.body || "No content"}
                </p>
              </div>
              <time className="shrink-0 text-xs text-ink-faint">
                {formatDate(note.updatedAt)}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
