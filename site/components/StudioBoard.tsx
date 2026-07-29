"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Platter, Post, PostStatus } from "@/lib/supabase";

const STATUS_TONE: Record<PostStatus, string> = {
  draft: "border-rule text-muted",
  pending_approval: "border-amber/50 text-amber",
  changes_requested: "border-amber/50 text-amber",
  approved: "border-info/50 text-info",
  scheduled: "border-info/50 text-info",
  publishing: "border-info/50 text-info",
  published: "border-emerald-400/50 text-emerald-400",
  failed: "border-coral/60 text-coral",
};

const LANES: { key: string; label: string; match: PostStatus[] }[] = [
  { key: "draft", label: "Draft", match: ["draft"] },
  { key: "review", label: "Awaiting approval", match: ["pending_approval", "changes_requested"] },
  { key: "queued", label: "Approved / queued", match: ["approved", "scheduled", "publishing"] },
  { key: "done", label: "Published", match: ["published", "failed"] },
];

export default function StudioBoard({
  platters,
  posts,
}: {
  platters: Platter[];
  posts: Post[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platterById = useMemo(
    () => new Map(platters.map((p) => [p.id, p])),
    [platters],
  );

  const act = async (postId: string, body: Record<string, unknown>) => {
    setBusy(postId);
    setError(null);
    try {
      const res = await fetch(`/api/studio/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.error ?? `Request failed (${res.status})`);
      }
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
      <header className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-rule pb-8">
        <div>
          <p className="voice-kicker mb-3 text-accent">Control room</p>
          <h1 className="voice-display text-5xl text-ink sm:text-6xl">
            Studio<span className="text-accent">.</span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-4">
        <a
          href="/studio/new"
          className="press voice-data bg-accent px-6 py-3 text-sm font-semibold text-bg"
        >
          + WRITE A POST
        </a>
        <dl className="voice-data grid grid-cols-3 gap-px overflow-hidden border border-rule bg-rule text-[10px] sm:w-80">
          {[
            { k: "PLATTERS", v: platters.length },
            { k: "QUEUED", v: posts.filter((p) => p.status === "approved").length },
            { k: "LIVE", v: posts.filter((p) => p.status === "published").length },
          ].map((cell) => (
            <div key={cell.k} className="bg-bg px-4 py-3">
              <dt className="tracking-[0.2em] text-faint">{cell.k}</dt>
              <dd className="mt-1 text-xl font-semibold text-ink">{cell.v}</dd>
            </div>
          ))}
        </dl>
        </div>
      </header>

      {error ? (
        <p className="voice-data mb-8 border border-coral/50 bg-coral/10 px-4 py-3 text-xs text-coral">
          {error}
        </p>
      ) : null}

      {posts.length === 0 ? (
        <p className="voice-data text-sm text-muted">
          No posts yet. The daily platter routine writes them here — see
          content-hq/AUTOMATION.md.
        </p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-4">
          {LANES.map((lane) => {
            const inLane = posts.filter((p) => lane.match.includes(p.status));
            return (
              <section key={lane.key}>
                <h2 className="voice-kicker mb-4 flex items-center justify-between text-muted">
                  {lane.label}
                  <span className="text-faint">{inLane.length}</span>
                </h2>
                <div className="flex flex-col gap-3">
                  {inLane.map((post) => (
                    <article
                      key={post.id}
                      className="panel ticked relative p-5"
                      aria-busy={busy === post.id || pending}
                    >
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="voice-data text-[10px] tracking-[0.2em] text-faint">
                          {platterById.get(post.platter_id)?.ep ?? "—"} ·{" "}
                          {post.channel.toUpperCase()}
                        </span>
                        <span
                          className={`voice-data rounded-full border px-2 py-0.5 text-[9px] tracking-[0.15em] ${STATUS_TONE[post.status]}`}
                        >
                          {post.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>

                      <p className="line-clamp-5 text-sm font-light leading-relaxed text-ink/85">
                        {post.caption}
                      </p>

                      <p className="voice-data mt-3 text-[10px] text-faint">
                        {post.scheduled_for
                          ? new Date(post.scheduled_for).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })
                          : "unscheduled"}
                      </p>

                      {post.last_error ? (
                        <p className="voice-data mt-2 text-[10px] leading-relaxed text-coral">
                          {post.last_error}
                        </p>
                      ) : null}

                      <div className="mt-4 flex flex-wrap gap-2">
                        {post.status === "draft" ? (
                          <button
                            onClick={() =>
                              act(post.id, { status: "pending_approval", notify: true })
                            }
                            disabled={busy === post.id}
                            className="press voice-data border border-rule px-3 py-1.5 text-[10px] text-ink hover:border-accent hover:text-accent disabled:opacity-40"
                          >
                            SEND TO TELEGRAM
                          </button>
                        ) : null}

                        {["pending_approval", "changes_requested"].includes(post.status) ? (
                          <button
                            onClick={() => act(post.id, { status: "approved" })}
                            disabled={busy === post.id}
                            className="press voice-data bg-accent px-3 py-1.5 text-[10px] font-semibold text-bg disabled:opacity-40"
                          >
                            APPROVE
                          </button>
                        ) : null}

                        {post.status === "failed" ? (
                          <button
                            onClick={() => act(post.id, { status: "approved", resetAttempts: true })}
                            disabled={busy === post.id}
                            className="press voice-data border border-rule px-3 py-1.5 text-[10px] text-ink hover:border-accent hover:text-accent disabled:opacity-40"
                          >
                            RETRY
                          </button>
                        ) : null}

                        {post.external_url ? (
                          <a
                            href={post.external_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="press voice-data border border-rule px-3 py-1.5 text-[10px] text-muted hover:border-accent hover:text-accent"
                          >
                            VIEW ↗
                          </a>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}
