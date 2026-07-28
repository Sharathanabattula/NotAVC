import { createClient } from "@supabase/supabase-js";

/*
  Server-only Supabase client.

  Every table has RLS on with zero policies, so anon and authenticated can
  read nothing — the service role key is the only way in, and it must never
  reach the browser. Importing this from a client component is a bug; the
  throw below turns that bug into a build-time failure rather than a leak.
*/

if (typeof window !== "undefined") {
  throw new Error("lib/supabase.ts is server-only — do not import it in a client component");
}

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/*
  A placeholder is truthy, so `!serviceKey` alone lets an unconfigured
  deployment through and the failure surfaces later as a confusing auth
  error from PostgREST instead of a missing-config error here.
*/
const unset = (v?: string) => !v || v.startsWith("PASTE_");

export function db() {
  if (unset(url) || unset(serviceKey)) {
    throw new Error(
      "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are unset or still placeholders — see GO-LIVE.md step 1",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type PlatterStatus =
  | "draft"
  | "pending_approval"
  | "changes_requested"
  | "approved"
  | "archived";

export type PostStatus =
  | "draft"
  | "pending_approval"
  | "changes_requested"
  | "approved"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed";

export type Channel = "linkedin" | "instagram";
export type PostFormat = "post" | "carousel" | "reel" | "story" | "thread";

export type Platter = {
  id: string;
  ep: string;
  title: string;
  desk: string | null;
  publish_date: string;
  status: PlatterStatus;
  brief: string | null;
  created_at: string;
  updated_at: string;
};

export type Post = {
  id: string;
  platter_id: string;
  channel: Channel;
  format: PostFormat;
  caption: string;
  hashtags: string[];
  media_urls: string[];
  scheduled_for: string | null;
  status: PostStatus;
  external_id: string | null;
  external_url: string | null;
  posted_at: string | null;
  last_error: string | null;
  attempts: number;
  created_at: string;
  updated_at: string;
};

export type Source = {
  id: string;
  platter_id: string;
  url: string;
  title: string | null;
  publisher: string | null;
  published_at: string | null;
};
