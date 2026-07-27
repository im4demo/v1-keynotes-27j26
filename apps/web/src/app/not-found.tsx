import Link from "next/link";
import { Stack } from "@keynotes/ui";

export default function NotFound() {
  return (
    <Stack gap="md">
      <h1 className="font-display text-3xl text-ink">Note not found</h1>
      <p className="text-sm text-ink-muted">
        That note may have been deleted or the link is invalid.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        ← Back to notes
      </Link>
    </Stack>
  );
}
