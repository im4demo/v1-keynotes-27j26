import type { Note } from "@keynotes/validators";

function getApiBaseUrl() {
  // API_URL is for server-side calls inside Docker (e.g. http://api:4000).
  // NEXT_PUBLIC_API_URL is for the browser (e.g. http://localhost:4000).
  const base = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("API_URL or NEXT_PUBLIC_API_URL is required");
  }
  return base.replace(/\/$/, "");
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function listNotes() {
  return apiFetch<Note[]>("/api/notes");
}

export function getNote(id: string) {
  return apiFetch<Note>(`/api/notes/${id}`);
}

export function createNote(input: { title: string; body: string }) {
  return apiFetch<Note>("/api/notes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateNote(
  id: string,
  input: { title?: string; body?: string },
) {
  return apiFetch<Note>(`/api/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteNote(id: string) {
  return apiFetch<void>(`/api/notes/${id}`, {
    method: "DELETE",
  });
}
