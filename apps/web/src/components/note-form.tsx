import Link from "next/link";
import { Button, Input, Label, Stack, Textarea } from "@keynotes/ui";

type NoteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  defaultTitle?: string;
  defaultBody?: string;
  submitLabel: string;
  cancelHref: string;
};

export function NoteForm({
  action,
  defaultTitle = "",
  defaultBody = "",
  submitLabel,
  cancelHref,
}: NoteFormProps) {
  return (
    <form action={action}>
      <Stack gap="lg">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={defaultTitle}
            placeholder="Note title"
          />
        </div>
        <div>
          <Label htmlFor="body">Body</Label>
          <Textarea
            id="body"
            name="body"
            defaultValue={defaultBody}
            placeholder="Write your note..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit">{submitLabel}</Button>
          <Link
            href={cancelHref}
            className="inline-flex items-center justify-center rounded-md border border-paper-line bg-paper-elevated px-3.5 py-2 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            Cancel
          </Link>
        </div>
      </Stack>
    </form>
  );
}
