#!/usr/bin/env node
/*
  NotAVC — LinkedIn auto-publish (official LinkedIn API, "Share on LinkedIn").
  Posts a text post to your own profile.

  Usage:
    node linkedin-publish.mjs "Post text here"
    node linkedin-publish.mjs --file path/to/post.txt

  Requires env vars (see SETUP-KEYS.md):
    LI_TOKEN      — member access token with w_member_social scope
    LI_PERSON_ID  — your member id (from https://api.linkedin.com/v2/userinfo -> "sub")
*/

import { readFileSync } from "node:fs";

const { LI_TOKEN, LI_PERSON_ID } = process.env;

if (!LI_TOKEN || !LI_PERSON_ID) {
  console.error("Missing LI_TOKEN or LI_PERSON_ID env vars. See SETUP-KEYS.md");
  process.exit(1);
}

const args = process.argv.slice(2);
const text =
  args[0] === "--file" ? readFileSync(args[1], "utf-8").trim() : args[0];

if (!text) {
  console.error("No post text given.");
  process.exit(1);
}

const res = await fetch("https://api.linkedin.com/rest/posts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${LI_TOKEN}`,
    "Content-Type": "application/json",
    "LinkedIn-Version": "202506",
    "X-Restli-Protocol-Version": "2.0.0",
  },
  body: JSON.stringify({
    author: `urn:li:person:${LI_PERSON_ID}`,
    commentary: text,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  }),
});

if (res.status === 201) {
  console.log(`Published. Post ID: ${res.headers.get("x-restli-id")}`);
} else {
  console.error(`Failed (${res.status}):`, await res.text());
  process.exit(1);
}
