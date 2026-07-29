import ComposeForm from "@/components/ComposeForm";

export const metadata = { title: "Write a post — NotAVC Studio" };

export default function NewPost() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
      <header className="mb-12 border-b border-rule pb-8">
        <p className="voice-kicker mb-3 text-accent">No API key required</p>
        <h1 className="voice-display text-5xl text-ink sm:text-6xl">
          Write it<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-2xl font-light leading-relaxed text-muted">
          You write the words. The machine renders the carousel, schedules both
          posts, sends the approval card to Telegram, and publishes when you say
          so. Costs nothing.
        </p>
        <a
          href="/studio"
          className="voice-data mt-6 inline-flex text-[11px] tracking-[0.2em] text-accent hover:underline"
        >
          ← BACK TO THE BOARD
        </a>
      </header>

      <ComposeForm />
    </main>
  );
}
