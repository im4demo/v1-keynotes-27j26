import { Button } from "@keynotes/ui";

function getWebAppUrl() {
  return (process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );
}

export default function HomePage() {
  const webAppUrl = getWebAppUrl();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="animate-wash absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgb(228_242_238/0.95),transparent_42%),radial-gradient(circle_at_82%_12%,rgb(255_255_255/0.7),transparent_36%),linear-gradient(160deg,#eef3ef_0%,#dfe8e2_48%,#c9d8d0_100%)]"
      />
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute -right-16 top-24 h-[28rem] w-[22rem] rounded-[2rem] border border-white/50 bg-paper-elevated/55 shadow-soft backdrop-blur-sm sm:right-10 sm:top-20"
      />
      <div
        aria-hidden
        className="animate-drift pointer-events-none absolute right-6 top-40 hidden h-64 w-48 -rotate-6 rounded-2xl border border-paper-line/80 bg-paper-elevated/80 p-5 shadow-soft sm:block"
        style={{ animationDelay: "180ms" }}
      >
        <div className="h-2.5 w-20 rounded-full bg-accent/30" />
        <div className="mt-5 space-y-2.5">
          <div className="h-2 w-full rounded-full bg-ink/10" />
          <div className="h-2 w-5/6 rounded-full bg-ink/10" />
          <div className="h-2 w-2/3 rounded-full bg-ink/10" />
          <div className="h-2 w-3/4 rounded-full bg-ink/10" />
        </div>
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <p className="animate-rise font-display text-4xl tracking-tight text-ink sm:text-5xl">
          KeyNotes
        </p>
        <h1 className="animate-rise-delay mt-6 max-w-xl font-display text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
          Capture thoughts without the clutter.
        </h1>
        <p className="animate-rise-delay-2 mt-4 max-w-md text-base leading-relaxed text-ink-muted sm:text-lg">
          A calm, minimal notes app for writing, editing, and keeping ideas in
          one place.
        </p>
        <div className="animate-rise-delay-2 mt-8">
          <a href={webAppUrl}>
            <Button className="px-5 py-2.5 text-base">Open the app</Button>
          </a>
        </div>
      </div>
    </main>
  );
}
