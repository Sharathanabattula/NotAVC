export const metadata = { title: "Studio — NotAVC" };

export default async function StudioLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-svh items-center justify-center px-5">
      <form
        action="/api/studio/login"
        method="POST"
        className="panel panel-lit ticked w-full max-w-sm p-8"
      >
        <p className="voice-kicker mb-2 text-accent">Restricted</p>
        <h1 className="voice-heading text-2xl text-ink">Studio</h1>
        <p className="mt-2 text-sm font-light text-muted">
          Scheduling and approvals for live accounts.
        </p>

        <label className="voice-kicker mt-8 block text-faint" htmlFor="password">
          Passphrase
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="voice-data mt-2 w-full border border-rule bg-bg px-4 py-3 text-ink outline-none focus:border-accent"
        />

        {error ? (
          <p className="voice-data mt-3 text-xs text-accent">Incorrect passphrase.</p>
        ) : null}

        <button
          type="submit"
          className="press voice-data mt-6 w-full bg-accent px-6 py-3 text-sm font-semibold text-bg"
        >
          ENTER
        </button>
      </form>
    </main>
  );
}
