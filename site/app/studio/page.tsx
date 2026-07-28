import { db, type Platter, type Post } from "@/lib/supabase";
import StudioBoard from "@/components/StudioBoard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Studio — NotAVC" };

/*
  The control room. Reads through the service-role client on the server, so
  no Supabase credential ever reaches the browser; every mutation goes back
  through /api/studio/* rather than the client talking to the database.
*/
export default async function Studio() {
  const supabase = db();

  const [{ data: platters }, { data: posts }] = await Promise.all([
    supabase
      .from("platters")
      .select("*")
      .order("publish_date", { ascending: false })
      .limit(30),
    supabase
      .from("posts")
      .select("*")
      .order("scheduled_for", { ascending: true, nullsFirst: false })
      .limit(200),
  ]);

  return (
    <StudioBoard
      platters={(platters ?? []) as Platter[]}
      posts={(posts ?? []) as Post[]}
    />
  );
}
